import { FetchError } from '@nzyme/fetch-utils/FetchError.js';
import { fetchJson } from '@nzyme/fetch-utils/fetchJson.js';
import { Container } from '@nzyme/ioc/Container.js';
import { defineService } from '@nzyme/ioc/Service.js';
import type { Resolved } from '@nzyme/ioc/Injectable.js';
import { Logger } from '@nzyme/logging/Logger.js';
import { identity } from '@nzyme/utils/functions/identity.js';
import { joinURL } from 'ufo';

import type { ActionDefinition } from '@superadmin/core/actions/defineAction.js';
import type { ActionError } from '@superadmin/core/actions/ActionError.js';
import { ActionHandlerRegistry } from '@superadmin/core/actions/ActionHandlerRegistry.js';
import { ActionRegistry } from '@superadmin/core/actions/ActionRegistry.js';
import { ApplicationError } from '@superadmin/core/ApplicationError.js';
import { showToast } from '@superadmin/core/actions/showToast.js';
import * as s from '@superadmin/schema';
import { ValidationError } from '@superadmin/validation';

import { AuthStore } from '../auth/AuthStore.js';
import { RuntimeConfig } from '../RuntimeConfig.js';

/**
 *
 */
export type ActionDispatcher = Resolved<typeof ActionDispatcher>;

/**
 * Options for the action dispatcher.
 */
export interface ActionDispatcherOptions {
    /**
     * Event that triggered the action.
     */
    event?: Event;

    /**
     * If true, the action dispatcher will exit after the first action is dispatched.
     */
    earlyExit?: boolean;

    /**
     * If true, the action dispatcher will handle errors and show a toast.
     * @default true
     */
    handleErrors?: boolean;
}

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
        logger: Logger,
    },
    setup({ runtimeConfig, actionRegistry, actionHandlers, authStore, container, logger }) {
        return dispatch;

        async function dispatch<P extends s.Schema>(
            action: s.Action<P, s.ActionSchema>,
            options?: ActionDispatcherOptions,
        ): Promise<void>;
        async function dispatch<P extends s.Schema, R extends s.Schema>(
            action: s.Action<P, R>,
            options?: ActionDispatcherOptions,
        ): Promise<s.Infer<R>>;
        async function dispatch(action: s.Action, options: ActionDispatcherOptions = {}) {
            do {
                const actionDefinition = actionRegistry.resolve(action.action);
                if (!actionDefinition) {
                    throw new Error(`Action ${action.action} not found`);
                }

                const result = await execute({
                    action,
                    actionDefinition,
                    event: options.event,
                    handleErrors: options.handleErrors ?? true,
                });

                if (s.isSchema(actionDefinition.result, s.action)) {
                    if (options.earlyExit) {
                        void dispatch(result as s.Action, options);
                        return;
                    }

                    action = result as s.Action;
                    continue;
                }

                return result;
            } while (action);
        }

        interface ExecuteOptions {
            action: s.Action;
            actionDefinition: ActionDefinition;
            event: Event | undefined;
            handleErrors: boolean;
        }

        async function execute(options: ExecuteOptions) {
            const { action, actionDefinition, event, handleErrors } = options;
            const handler = actionHandlers.resolve(action.action);
            if (handler) {
                action.params = s.coerce(actionDefinition.params, action.params);
                s.validateOrThrow(actionDefinition.params, action.params);

                const handlerFn = container.resolve(handler.service);

                return await handlerFn(action.params, {
                    event,
                    result: identity,
                });
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
                    url: joinURL(runtimeConfig.basePath, 'api/ExecuteAction'),
                    data: {
                        action: action.action,
                        params: s.serialize(actionDefinition.input, action.params),
                    },
                    headers,
                });

                return s.coerce(actionDefinition.result, result);
            } catch (error) {
                if (error instanceof FetchError) {
                    if (error.status === 401) {
                        if (handleErrors) {
                            return showToast({
                                title: 'Error',
                                message: 'You are not authorized to perform this action',
                                type: 'error',
                            });
                        }

                        throw new ApplicationError('Unauthorized', { cause: error });
                    }

                    if (error.status === 400) {
                        const actionError = (await error.response.json()) as ActionError;

                        if (actionError.type === 'validation') {
                            throw new ValidationError(actionError.errors);
                        }

                        if (handleErrors) {
                            logger.error(`Action ${action.action} failed`, { error });

                            return showToast({
                                title: 'Error',
                                message: actionError.message,
                                type: 'error',
                            });
                        }

                        throw new ApplicationError(actionError.message, {
                            cause: error,
                        });
                    }
                }

                throw error;
            }
        }
    },
});
