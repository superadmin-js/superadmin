import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

export const showToast = defineAction({
    params: s.object({
        props: {
            title: s.string({ optional: true, nullable: true }),
            message: s.string({ optional: true, nullable: true }),
            type: s.enum({
                values: ['info', 'success', 'warn', 'error', 'secondary', 'contrast'],
                optional: true,
                nullable: true,
            }),
            time: s.number({ optional: true, nullable: true }),
        },
    }),
});
