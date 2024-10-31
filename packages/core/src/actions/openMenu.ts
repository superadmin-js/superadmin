import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

export type MenuItem = s.SchemaValue<typeof MenuItem>;
export const MenuItem = s.object({
    props: {
        action: s.action(),
        label: s.string({ optional: true }),
        icon: s.string({ optional: true }),
    },
});

export const openMenuInternal = defineAction({
    name: 'superadmin.openMenu',
    params: s.object({
        props: {
            items: s.array(MenuItem),
        },
    }),
});

export function openMenu(items: MenuItem[]) {
    return openMenuInternal({
        items,
    });
}
