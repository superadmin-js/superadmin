import { joinURL } from 'ufo';

import { fetchJson } from '@nzyme/fetch-utils';
import { type InjectableOf, defineService } from '@nzyme/ioc';
import { type Action, ActionRegistry, RuntimeConfig } from '@superadmin/core';
import {
    type SchemaAny,
    type SchemaValue,
    coerce,
    serialize,
    validateOrThrow,
} from '@superadmin/schema';

export type ActionDispatcher = InjectableOf<typeof ActionDispatcher>;

export const ActionDispatcher = defineService({
    name: 'ActionDispatcher',
    setup({ inject }) {
        const config = inject(RuntimeConfig);
        const actionRegistry = inject(ActionRegistry);

        return async <P extends SchemaAny, R extends SchemaAny>(action: Action<P, R>) => {
            validateOrThrow(action.action.params, action.params);

            const handler = actionRegistry.resolveHandler(action.action.name);
            if (handler) {
                const handlerFn = inject(handler.service);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return (await handlerFn(action.params)) as SchemaValue<R>;
            }

            const result = await fetchJson({
                method: 'POST',
                url: joinURL(config.basePath, 'api/action', action.action.name),
                data: serialize(action.action.params, action.params),
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return coerce(action.action.result, result);
        };
    },
});
