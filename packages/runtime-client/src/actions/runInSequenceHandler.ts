import { ActionDispatcher } from '@superadmin/client';
import { defineActionHandler, runInSequence } from '@superadmin/core';

export const runInSequenceHandler = defineActionHandler({
    action: runInSequence,
    setup: ({ inject }) => {
        const actionDispatcher = inject(ActionDispatcher);

        return async actions => {
            for (const action of actions) {
                await actionDispatcher(action);
            }
        };
    },
});
