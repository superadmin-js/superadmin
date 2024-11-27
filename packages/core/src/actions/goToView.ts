import * as s from '@superadmin/schema';
import type { SchemaValue } from '@superadmin/schema';

import { defineAction } from './defineAction.js';
import type { View } from '../views/defineView.js';

export const goToViewInternal = defineAction({
    params: s.object({
        props: {
            view: s.string(),
            params: s.unknown({ optional: true }),
        },
    }),
});

export function goToView<V extends View<s.Schema<void>>>(view: V): s.Action;
export function goToView<V extends View>(view: V, params: SchemaValue<V['params']>): s.Action;
export function goToView(view: View, params?: unknown) {
    return goToViewInternal({
        view: view.id,
        params: s.serialize(view.params, params),
    });
}
