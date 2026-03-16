import * as s from '@superadmin/schema';

import { ActionButton } from './ActionButton.js';
import { defineAction } from './defineAction.js';

/** Action that opens a confirmation dialog with a message and yes/no buttons. */
export const openConfirmDialog = defineAction({
    params: s.object({
        title: s.string({ optional: true }),
        message: s.string(),
        yes: s.optional(ActionButton),
        no: s.optional(ActionButton),
    }),
});
