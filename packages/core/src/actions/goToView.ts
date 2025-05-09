import * as s from '@superadmin/schema';

import type { View } from '../views/defineView.js';
import { defineAction } from './defineAction.js';

/**
 *
 */
export const goToViewAction = defineAction({
    params: s.object({
        view: s.string(),
        params: s.unknown({ optional: true }),
    }),
});

/**
 *
 */
export function goToView<V extends View<s.Schema<void>>>(view: V): s.Action;
/**
 *
 */
export function goToView<V extends View>(view: V, params: s.Infer<V['params']>): s.Action;
/**
 *
 */
export function goToView(view: View, params?: unknown) {
    return goToViewAction({
        view: view.id,
        params: s.serialize(view.params, params),
    });
}
