import type { ExtractPropTypes } from 'vue';

import { defineProp } from '@nzyme/vue-utils';
import type { View, ViewParams } from '@superadmin/core';

import type { ViewLayout } from '../views/ViewLayout.js';

export type ViewProps<TView extends View = View> = ExtractPropTypes<
    ReturnType<typeof useViewProps<TView>>
>;

export function useViewProps<TView extends View = View>() {
    return {
        view: defineProp<TView>({ type: Object, required: true }),
        params: defineProp<ViewParams<TView>>({ required: true }),
        layout: defineProp<ViewLayout>({ type: Object, required: true }),
    };
}
