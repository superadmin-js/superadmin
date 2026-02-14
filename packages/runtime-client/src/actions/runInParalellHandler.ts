import { ActionDispatcher } from '@superadmin/client/actions/ActionDispatcher.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { runInParalell } from '@superadmin/core/actions/runInParalell.js';

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
