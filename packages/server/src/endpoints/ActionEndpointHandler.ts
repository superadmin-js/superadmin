import { HttpError } from '@nzyme/api-core';
import type { HttpRequest } from '@nzyme/api-server';
import { defineEndpointHandler } from '@nzyme/api-server';
import { parseBearerToken } from '@nzyme/crypto-utils';
import { Container } from '@nzyme/ioc';

import type { ActionDefinition } from '@superadmin/core';
import { ActionHandlerRegistry, ActionRegistry, FunctionRegistry } from '@superadmin/core';
import { ApplicationError } from '@superadmin/core';
import { ActionEndpoint } from '@superadmin/runtime-common';
import * as s from '@superadmin/schema';
import { ValidationError } from '@superadmin/validation';

import { VerifyAuthToken } from '../auth/VerifyAuthToken.js';

/**
 *
 */
export const ActionEndpointHandler = defineEndpointHandler({
    endpoint: ActionEndpoint,
    deps: {
        container: Container,
        actions: ActionRegistry,
        actionHandlers: ActionHandlerRegistry,
        functions: FunctionRegistry,
        verifyAuthToken: VerifyAuthToken,
    },
    setup: ({ container, actions, actionHandlers, functions, verifyAuthToken }) => {
        const actionSchema = s.action();

        return async (input, request) => {
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

                const result = await container.resolve(handler.service)(params);

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
