import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';
import type { View, ViewParams } from '../views/defineView.js';

export const goToViewInternal = defineAction({
    name: 'superadmin.goToView',
    params: s.object({
        props: {
            view: s.string(),
            params: s.unknown({ optional: true }),
        },
    }),
});

export function goToView<V extends View<{ params: s.Schema<void> }>>(view: V): s.Action;
export function goToView<V extends View>(view: V, params: ViewParams<V>): s.Action;
export function goToView(view: View, params?: unknown) {
    return goToViewInternal({
        view: view.name,
        params: s.serialize(view.params, params),
    });
}
