import * as s from '@superadmin/schema';

import { ActionButton } from './ActionButton.js';
import { defineAction } from './defineAction.js';

/** Action that opens a dialog with a message and configurable buttons. */
export const openDialog = defineAction({
    params: s.object({
        title: s.string({ optional: true }),
        message: s.string(),
        buttons: s.array({ of: ActionButton, optional: true }),
    }),
});
