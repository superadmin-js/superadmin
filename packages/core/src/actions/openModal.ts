import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';
import type { View, ViewParams } from '../views/defineView.js';

export const openModalInternal = defineAction({
    name: 'superadmin.openModal',
    params: s.object({
        props: {
            view: s.string(),
            params: s.unknown({ optional: true }),
        },
    }),
});

export function openModal<V extends View<{ params: s.Schema<void> }>>(view: V): s.Action;
export function openModal<V extends View>(view: V, params: ViewParams<V>): s.Action;
export function openModal(view: View, params?: unknown) {
    return openModalInternal({
        view: view.name,
        params: s.serialize(view.params, params),
    });
}
