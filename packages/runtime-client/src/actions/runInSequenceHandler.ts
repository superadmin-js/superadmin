import { ActionDispatcher } from '@superadmin/client/actions/ActionDispatcher.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { runInSequence } from '@superadmin/core/actions/runInSequence.js';

export const runInSequenceHandler = defineActionHandler({
    action: runInSequence,
    deps: {
        actionDispatcher: ActionDispatcher,
    },
    setup({ actionDispatcher }) {
        return async (actions, { event }) => {
            for (const action of actions) {
                await actionDispatcher(action, { event });
            }
        };
    },
});
