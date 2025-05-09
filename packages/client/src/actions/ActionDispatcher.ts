import { FetchError, fetchJson } from '@nzyme/fetch-utils';
import { Container, defineService } from '@nzyme/ioc';
import type { Injected } from '@nzyme/ioc';
import { joinURL } from 'ufo';

import type { ActionDefinition, ActionError } from '@superadmin/core';
import {
    ActionHandlerRegistry,
    ActionRegistry,
    ApplicationError,
    RuntimeConfig,
} from '@superadmin/core';
import * as s from '@superadmin/schema';
import { ValidationError } from '@superadmin/validation';

import { AuthStore } from '../auth/AuthStore.js';

/**
 *
 */
export type ActionDispatcher = Injected<typeof ActionDispatcher>;

/**
 *
 */
export const ActionDispatcher = defineService({
    name: 'ActionDispatcher',
    deps: {
        runtimeConfig: RuntimeConfig,
        actionRegistry: ActionRegistry,
        actionHandlers: ActionHandlerRegistry,
        authStore: AuthStore,
        container: Container,
    },
    setup({ runtimeConfig, actionRegistry, actionHandlers, authStore, container }) {
        return dispatch;

        async function dispatch<P extends s.Schema>(
            action: s.Action<P, s.ActionSchema>,
            event?: Event,
        ): Promise<void>;
        async function dispatch<P extends s.Schema, R extends s.Schema>(
            action: s.Action<P, R>,
            event?: Event,
        ): Promise<s.Infer<R>>;
        async function dispatch(action: s.Action, event?: Event) {
            do {
                const actionDefinition = actionRegistry.resolve(action.action);
                if (!actionDefinition) {
                    throw new Error(`Action ${action.action} not found`);
                }

                const result = await execute(action, actionDefinition, event);

                if (s.isSchema(actionDefinition.result, s.action)) {
                    action = result as s.Action;
                    continue;
                }

                return result;
            } while (action);
        }

        async function execute(
            action: s.Action,
            actionDefinition: ActionDefinition,
            event?: Event,
        ) {
            const handler = actionHandlers.resolve(action.action);
            if (handler) {
                action.params = s.coerce(actionDefinition.params, action.params);
                s.validateOrThrow(actionDefinition.params, action.params);

                const handlerFn = container.resolve(handler.service);

                return await handlerFn(action.params, event);
            }

            action.params = s.coerce(actionDefinition.input, action.params);
            s.validateOrThrow(actionDefinition.input, action.params);

            const headers: Record<string, string> = {};
            const authToken = authStore.authToken;
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`;
            }

            try {
                const result = await fetchJson({
                    method: 'POST',
                    url: joinURL(runtimeConfig.basePath, 'api/action', action.action),
                    data: s.serialize(actionDefinition.input, action.params),
                    headers,
                });

                return s.coerce(actionDefinition.result, result);
            } catch (error) {
                if (error instanceof FetchError && error.status === 400) {
                    const actionError = (await error.response.json()) as ActionError;

                    if (actionError.type === 'validation') {
                        throw new ValidationError(actionError.errors);
                    }

                    throw new ApplicationError(actionError.message, {
                        cause: error,
                    });
                }

                throw error;
            }
        }
    },
});
