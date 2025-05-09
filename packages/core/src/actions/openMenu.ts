import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

/**
 *
 */
export type MenuItem = s.Infer<typeof MenuItem>;
/**
 *
 */
export const MenuItem = s.object({
    action: s.action(),
    label: s.string({ optional: true }),
    icon: s.icon({ optional: true }),
    color: s.enum({
        values: ['primary', 'success', 'danger'],
        optional: true,
    }),
});

/**
 *
 */
export const openMenuInternal = defineAction({
    params: s.object({
        items: s.array(MenuItem),
    }),
});

/**
 *
 */
export function openMenu(items: MenuItem[]) {
    return openMenuInternal({
        items,
    });
}
