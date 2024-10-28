import type { View, ViewParams } from '@superadmin/core';
import { defineAction } from '@superadmin/core';
import * as s from '@superadmin/schema';

const goToViewAction = defineAction({
    name: 'superadmin:goToView',
    params: s.object({
        props: {
            view: s.unknown<View>(),
            params: s.unknown(),
        },
    }),
});

export function goToView<V extends View>(view: V, params: ViewParams<V>) {
    return goToViewAction({
        view,
        params,
    });
}
