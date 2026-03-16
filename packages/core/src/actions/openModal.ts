import * as s from '@superadmin/schema';
import type { Infer } from '@superadmin/schema';

import type { View } from '../views/defineView.js';
import { defineAction } from './defineAction.js';

/** Internal action definition for opening a modal with a view reference and params. */
export const openModalInternal = defineAction({
    params: s.object({
        view: s.string(),
        params: s.unknown({ optional: true }),
    }),
});

/** Creates a modal action for a view that takes no params. */
export function openModal<V extends View<s.Schema<void>>>(view: V): s.Action;
/** Creates a modal action for a view with the required params. */
export function openModal<V extends View>(view: V, params: Infer<V['params']>): s.Action;
/** Creates an action payload that opens the given view in a modal. */
export function openModal(view: View, params?: unknown) {
    return openModalInternal({
        view: view.id,
        params: s.serialize(view.params, params),
    });
}
