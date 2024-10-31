import { ActionDispatcher, defineActionHandler } from '@superadmin/client';
import { runInSequence } from '@superadmin/core';

export const runInSequenceHandler = defineActionHandler({
    action: runInSequence,
    setup: ({ inject }) => {
        const actionDispatcher = inject(ActionDispatcher);

        return async (actions, event) => {
            for (const action of actions) {
                await actionDispatcher(action, event);
            }
        };
    },
});
