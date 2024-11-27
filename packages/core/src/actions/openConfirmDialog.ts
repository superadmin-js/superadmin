import * as s from '@superadmin/schema';

import { ActionButton } from './ActionButton.js';
import { defineAction } from './defineAction.js';

export const openConfirmDialog = defineAction({
    params: s.object({
        props: {
            title: s.string({ optional: true }),
            message: s.string(),
            yes: s.optional(ActionButton),
            no: s.optional(ActionButton),
        },
    }),
});
