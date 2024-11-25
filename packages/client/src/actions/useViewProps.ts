import type { ExtractPropTypes } from 'vue';

import { defineProp } from '@nzyme/vue-utils';
import type { View } from '@superadmin/core';
import type { SchemaValue } from '@superadmin/schema';

import type { ViewLayout } from '../views/ViewLayout.js';

export type ViewProps<TView extends View = View> = ExtractPropTypes<
    ReturnType<typeof useViewProps<TView>>
>;

export function useViewProps<TView extends View = View>() {
    return {
        view: defineProp<TView>({ type: Object, required: true }),
        params: defineProp<SchemaValue<TView['params']>>({ required: true }),
        layout: defineProp<ViewLayout>({ type: Object, required: true }),
    };
}
