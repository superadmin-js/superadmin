import * as s from '@superadmin/schema';
import type { Infer } from '@superadmin/schema';

import type { View } from '../views/defineView.js';
import { defineAction } from './defineAction.js';

export /**
 *
 */
const openModalInternal = defineAction({
    params: s.object({
        view: s.string(),
        params: s.unknown({ optional: true }),
    }),
});

export /**
 *
 */
function openModal<V extends View<s.Schema<void>>>(view: V): s.Action;
export /**
 *
 */
function openModal<V extends View>(view: V, params: Infer<V['params']>): s.Action;
/**
 *
 */
export function openModal(view: View, params?: unknown) {
    return openModalInternal({
        view: view.id,
        params: s.serialize(view.params, params),
    });
}
