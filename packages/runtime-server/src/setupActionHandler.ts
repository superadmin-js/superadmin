import type { H3Event } from 'h3';
import { createError, defineEventHandler, readBody } from 'h3';

import { parseBearerToken } from '@nzyme/crypto-utils';
import type { Container } from '@nzyme/ioc';
import { assertValue } from '@nzyme/utils';
import type { ActionDefinition } from '@superadmin/core';
import { ActionRegistry, FunctionRegistry } from '@superadmin/core';
import * as s from '@superadmin/schema';
import { ActionHandlerRegistry, Router } from '@superadmin/server';
import { ValidationError } from '@superadmin/validation';

import { VerifyAuthToken } from './auth/VerifyAuthToken.js';

export function setupActionHandler(container: Container) {
    const router = container.resolve(Router);

    const actions = container.resolve(ActionRegistry);
    const handlers = container.resolve(ActionHandlerRegistry);
    const functions = container.resolve(FunctionRegistry);
    const verifyAuthToken = container.resolve(VerifyAuthToken);

    const actionSchema = s.action();

    const actionHandler = defineEventHandler(async event => {
        try {
            const actionName = assertValue(event.context.params?.action);
            const handler = resolveHandler(actionName);

            if (!handler) {
                return createError({
                    status: 404,
                    message: `Action handler for ${actionName} not found`,
                });
            }

            const actionDef = handler.action;
            const authCtx = await resolveAuthContext(event);

            if (!actionDef.auth.isAuthorized(authCtx)) {
                return createError({
                    status: 401,
                    message: 'Unauthorized',
                });
            }

            const body: unknown = await readBody(event);

            const action = s.coerce(actionSchema, {
                action: actionDef.name,
                params: body,
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
                return createError({
                    status: 400,
                    statusMessage: error.name,
                    message: error.message,
                    stack: error.stack,
                    data: error.errors,
                });
            }

            throw error;
        }
    });

    router.post('/action/:action', actionHandler);

    function resolveHandler(actionName: string) {
        const handler = handlers.resolve(actionName);
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

    async function resolveAuthContext(event: H3Event) {
        const authHeader = event.headers.get('authorization');
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
}
