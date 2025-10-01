import { ActionDispatcher } from '@superadmin/client';
import { defineActionHandler, runInParalell } from '@superadmin/core';

/**
 *
 */
export const runInParalellHandler = defineActionHandler({
    action: runInParalell,
    deps: {
        actionDispatcher: ActionDispatcher,
    },
    setup({ actionDispatcher }) {
        return async (actions, { event }) => {
            await Promise.all(actions.map(action => actionDispatcher(action, { event })));
        };
    },
});
