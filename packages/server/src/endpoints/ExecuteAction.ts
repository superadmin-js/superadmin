import { parseBearerToken } from '@nzyme/crypto';
import { HttpError } from '@nzyme/fetch-utils/HttpError.js';
import { Container } from '@nzyme/ioc/Container.js';
import { Logger } from '@nzyme/logging/Logger.js';
import { defineEndpoint } from '@nzyme/rpc/defineEndpoint.js';
import { HttpContextProvider } from '@nzyme/rpc/services/HttpContextProvider.js';
import type { HttpRequest } from '@nzyme/rpc/types/HttpRequest.js';
import { assert } from '@nzyme/utils/assert.js';
import { identity } from '@nzyme/utils/functions/identity.js';
import * as z from '@zod/mini';

import { ActionHandlerRegistry } from '@superadmin/core/actions/ActionHandlerRegistry.js';
import { ActionRegistry } from '@superadmin/core/actions/ActionRegistry.js';
import type { ActionDefinition } from '@superadmin/core/actions/defineAction.js';
import { ApplicationError } from '@superadmin/core/ApplicationError.js';
import { FunctionRegistry } from '@superadmin/core/functions/FunctionRegistry.js';
import * as s from '@superadmin/schema';
import { ValidationError } from '@superadmin/validation';

import { VerifyAuthToken } from '../auth/VerifyAuthToken.js';

/**
 *
 */
export const ExecuteAction = defineEndpoint({
    name: 'ExecuteAction',
    input: z.object({
        action: z.string(),
        params: z.unknown(),
    }),
    deps: {
        container: Container,
        httpContextProvider: HttpContextProvider,
        actions: ActionRegistry,
        actionHandlers: ActionHandlerRegistry,
        functions: FunctionRegistry,
        verifyAuthToken: VerifyAuthToken,
        logger: Logger,
    },
    setup({
        container,
        httpContextProvider,
        actions,
        actionHandlers,
        functions,
        verifyAuthToken,
        logger,
    }) {
        const actionSchema = s.action();

        return async input => {
            const request = httpContextProvider.get()?.request;
            assert(request, 'Request not provided');

            try {
                const handler = resolveHandler(input.action);
                if (!handler) {
                    throw new HttpError(404, `Action handler for ${input.action} not found`);
                }

                const actionDef = handler.action;
                const authCtx = await resolveAuthContext(request);

                if (!actionDef.auth.isAuthorized(authCtx)) {
                    throw new HttpError(401, 'Unauthorized');
                }

                const action = s.coerce(actionSchema, {
                    action: actionDef.id,
                    params: input.params,
                });

                await processAction(action);

                const paramsSchema = actionDef.params;
                const params: unknown = s.coerce(paramsSchema, action.params);
                s.validateOrThrow(paramsSchema, params);

                const handlerFn = container.resolve(handler.service);
                const result = await handlerFn(params, {
                    request,
                    result: identity,
                });

                await processResult(handler.action, result);

                return s.serialize(actionDef.result, result);
            } catch (error) {
                if (error instanceof ValidationError) {
                    throw new HttpError(400, {
                        message: 'Validation error',
                        type: 'validation',
                        errors: error.errors,
                        stack: error.stack,
                    });
                }

                if (error instanceof ApplicationError) {
                    throw new HttpError(400, {
                        message: error.message,
                        stack: error.stack,
                    });
                }

                logger.error('Error executing action', { error });

                throw error;
            }
        };

        function resolveHandler(actionName: string) {
            const handler = actionHandlers.resolve(actionName);
            if (handler) {
                return handler;
            }

            const action = actions.resolve(actionName);
            if (action?.handler) {
                return {
                    action,
                    service: action.handler,
                };
            }
        }

        async function resolveAuthContext(request: HttpRequest) {
            const authHeader = request.headers['authorization'];
            if (!authHeader) {
                return null;
            }

            const authToken = parseBearerToken(authHeader);
            if (!authToken) {
                return null;
            }

            const result = await verifyAuthToken(authToken);
            if (!result || result.type !== 'auth') {
                return null;
            }

            return result.auth;
        }

        async function processResult(actionDef: ActionDefinition, result: unknown) {
            if (!s.isSchema(actionDef.result, s.action)) {
                return;
            }

            if (!result) {
                return;
            }

            await processAction(result as s.Action);
        }

        async function processAction(action: s.Action) {
            const actionDef = actions.resolve(action);
            if (!actionDef) {
                return;
            }

            if (actionDef.sst) {
                const func = functions.resolve(actionDef.sst);
                if (!func) {
                    throw new Error(`Function ${actionDef.sst.name} not found`);
                }

                const params: unknown = s.coerce(actionDef.sst.params, action.params);
                s.validateOrThrow(actionDef.sst.params, params);

                action.params = await container.resolve(func.service)(params);
            }

            if (actionDef.visit) {
                const promises: Promise<unknown>[] = [];
                actionDef.visit(action, action => promises.push(processAction(action)));
                await Promise.all(promises);
            }
        }
    },
});
