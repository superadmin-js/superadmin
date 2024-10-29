import { ActionDispatcher } from '@superadmin/client';
import { defineActionHandler, runInParalell } from '@superadmin/core';

export const runInParalellHandler = defineActionHandler({
    action: runInParalell,
    setup: ({ inject }) => {
        const actionDispatcher = inject(ActionDispatcher);

        return async actions => {
            await Promise.all(actions.map(actionDispatcher));
        };
    },
});
