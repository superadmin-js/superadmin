import * as s from '@superadmin/schema';

import { ActionButton } from './ActionButton.js';
import { defineAction } from './defineAction.js';

/**
 *
 */
export const openDialog = defineAction({
    params: s.object({
        title: s.string({ optional: true }),
        message: s.string(),
        buttons: s.array({ of: ActionButton, optional: true }),
    }),
});
