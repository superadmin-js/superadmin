import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';
import { ActionButton } from './ActionButton.js';

export const openConfirmDialog = defineAction({
    name: 'superadmin.openConfirmDialog',
    params: s.object({
        props: {
            title: s.string({ optional: true }),
            message: s.string(),
            yes: s.optional(ActionButton),
            no: s.optional(ActionButton),
        },
    }),
});
