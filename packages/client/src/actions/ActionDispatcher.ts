import { joinURL } from 'ufo';

import { fetchJson } from '@nzyme/fetch-utils';
import { type InjectableOf, defineService } from '@nzyme/ioc';
import type { ActionDefinition } from '@superadmin/core';
import { ActionRegistry, RuntimeConfig } from '@superadmin/core';
import * as s from '@superadmin/schema';

export type ActionDispatcher = InjectableOf<typeof ActionDispatcher>;

export const ActionDispatcher = defineService({
    name: 'ActionDispatcher',
    setup({ inject }) {
        const config = inject(RuntimeConfig);
        const actionRegistry = inject(ActionRegistry);

        return dispatch;

        async function dispatch<P extends s.Schema>(
            action: s.Action<P, s.ActionSchema>,
        ): Promise<void>;
        async function dispatch<P extends s.Schema, R extends s.Schema>(
            action: s.Action<P, R>,
        ): Promise<s.SchemaValue<R>>;
        async function dispatch(action: s.Action) {
            do {
                const actionDefinition = actionRegistry.resolveAction(action.action);
                if (!actionDefinition) {
                    throw new Error(`Action ${action.action} not found`);
                }

                s.validateOrThrow(actionDefinition.params, action.params);

                const result = await execute(action, actionDefinition);

                if (s.isSchema(actionDefinition.result, s.action)) {
                    action = result as s.Action;
                    continue;
                }

                return result;
            } while (action);
        }

        async function execute(action: s.Action, actionDefinition: ActionDefinition) {
            const handler = actionRegistry.resolveHandler(action.action);
            if (handler) {
                const handlerFn = inject(handler.service);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return await handlerFn(action.params);
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
