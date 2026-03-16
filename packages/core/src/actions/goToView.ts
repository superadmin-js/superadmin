import * as s from '@superadmin/schema';

import type { View } from '../views/defineView.js';
import { defineAction } from './defineAction.js';

/** Action definition for navigating to a view by its ID with optional params. */
export const goToViewAction = defineAction({
    params: s.object({
        view: s.string(),
        params: s.unknown({ optional: true }),
    }),
});

/** Creates a navigation action to a view that takes no params. */
export function goToView<V extends View<s.Schema<void>>>(view: V): s.Action;
/** Creates a navigation action to a view with the required params. */
export function goToView<V extends View>(view: V, params: s.Infer<V['params']>): s.Action;
/** Creates an action payload that navigates to the given view with optional params. */
export function goToView(view: View, params?: unknown) {
    return goToViewAction({
        get view() {
            // Lazy resolution of view id
            return view.id;
        },
        params: s.serialize(view.params, params),
    });
}
