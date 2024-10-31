import { ActionDispatcher, defineActionHandler } from '@superadmin/client';
import { runInParalell } from '@superadmin/core';

export const runInParalellHandler = defineActionHandler({
    action: runInParalell,
    setup: ({ inject }) => {
        const actionDispatcher = inject(ActionDispatcher);

        return async (actions, event) => {
            await Promise.all(actions.map(action => actionDispatcher(action, event)));
        };
    },
});
