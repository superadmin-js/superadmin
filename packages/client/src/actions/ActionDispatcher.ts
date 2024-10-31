import { joinURL } from 'ufo';

import { fetchJson } from '@nzyme/fetch-utils';
import { type InjectableOf, defineService } from '@nzyme/ioc';
import type { ActionDefinition } from '@superadmin/core';
import { ActionRegistry, RuntimeConfig } from '@superadmin/core';
import * as s from '@superadmin/schema';

import { ActionHandlerRegistry } from './ActionHandlerRegistry.js';

export type ActionDispatcher = InjectableOf<typeof ActionDispatcher>;

export const ActionDispatcher = defineService({
    name: 'ActionDispatcher',
    setup({ inject }) {
        const config = inject(RuntimeConfig);
        const actions = inject(ActionRegistry);
        const handlers = inject(ActionHandlerRegistry);

        return dispatch;

        async function dispatch<P extends s.Schema>(
            action: s.Action<P, s.ActionSchema>,
            event?: Event,
        ): Promise<void>;
        async function dispatch<P extends s.Schema, R extends s.Schema>(
            action: s.Action<P, R>,
            event?: Event,
        ): Promise<s.SchemaValue<R>>;
        async function dispatch(action: s.Action, event?: Event) {
            do {
                const actionDefinition = actions.resolve(action.action);
                if (!actionDefinition) {
                    throw new Error(`Action ${action.action} not found`);
                }

                action.params = s.coerce(actionDefinition.params, action.params);
                s.validateOrThrow(actionDefinition.params, action.params);

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
            const handler = handlers.resolve(action.action);
            if (handler) {
                const handlerFn = inject(handler.service);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return await handlerFn(action.params, event);
            }

            const result = await fetchJson({
                method: 'POST',
                url: joinURL(config.basePath, 'api/action', action.action),
                data: s.serialize(actionDefinition.params, action.params),
            });

            return s.coerce(actionDefinition.result, result);
        }
    },
});
