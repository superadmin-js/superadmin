import { createError, defineEventHandler, readBody } from 'h3';

import type { Container } from '@nzyme/ioc';
import { assertValue } from '@nzyme/utils';
import type { ActionDefinition } from '@superadmin/core';
import { ActionRegistry, isAction } from '@superadmin/core';
import { authenticateAction } from '@superadmin/core/internal';
import * as s from '@superadmin/schema';
import { ActionHandlerRegistry, Router } from '@superadmin/server';
import { ValidationError } from '@superadmin/validation';

import { signAuthentication } from './auth/signAuthentication.js';

export function setupActionHandler(container: Container) {
    const router = container.resolve(Router);

    const actions = container.resolve(ActionRegistry);
    const handlers = container.resolve(ActionHandlerRegistry);

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

            const action = handler.action;
            const body: unknown = await readBody(event);
            const paramsSchema = action.params;
            const params: unknown = s.coerce(paramsSchema, body);

            s.validateOrThrow(paramsSchema, params);

            const result = await container.resolve(handler.service)(params);

            await processResult(handler.action, result);

            return s.serialize(action.result, result);
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

    async function processResult(actionDef: ActionDefinition, result: unknown) {
        if (!s.isSchema(actionDef.result, s.action)) {
            return;
        }

        const action = result as s.Action;
        const promises: Promise<unknown>[] = [];

        processAction(action, promises);
        await Promise.all(promises);
    }

    function processAction(action: s.Action, promises: Promise<unknown>[]) {
        if (isAction(authenticateAction, action)) {
            promises.push(signAuthentication(action));
        }

        const actionDef = actions.resolve(action);
        actionDef?.visit?.(action, action => processAction(action, promises));
    }
}
