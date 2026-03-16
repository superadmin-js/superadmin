import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

/** Inferred type of the {@link MenuItem} schema. */
export type MenuItem = s.Infer<typeof MenuItem>;
/** Schema for a single menu item with an action, label, icon, and color. */
export const MenuItem = s.object({
    action: s.action(),
    label: s.string({ optional: true }),
    icon: s.string({ optional: true }),
    color: s.enum({
        values: ['primary', 'success', 'danger'],
        optional: true,
    }),
});

/** Internal action definition for rendering a context menu from items. */
export const openMenuInternal = defineAction({
    params: s.object({
        items: s.array(MenuItem),
    }),
});

/** Creates an action that opens a context menu with the given items. */
export function openMenu(items: MenuItem[]) {
    return openMenuInternal({
        items,
    });
}
