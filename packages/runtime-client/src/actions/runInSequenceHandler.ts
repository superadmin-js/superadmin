import { ActionDispatcher } from '@superadmin/client';
import { defineActionHandler, runInSequence } from '@superadmin/core';

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
