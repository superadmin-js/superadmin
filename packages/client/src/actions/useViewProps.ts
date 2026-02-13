import { defineProp } from '@nzyme/vue-utils/defineProp.js';
import type { ExtractPropTypes } from 'vue';

import type { View } from '@superadmin/core/views/defineView.js';
import type { Infer } from '@superadmin/schema';

import type { ViewLayout } from '../views/ViewLayout.js';

/**
 *
 */
export type ViewProps<TView extends View = View> = ExtractPropTypes<
    ReturnType<typeof useViewProps<TView>>
>;

/**
 *
 */
export function useViewProps<TView extends View = View>() {
    return {
        view: defineProp<TView>({ type: Object, required: true }),
        params: defineProp<Infer<TView['params']>>({ required: true }),
        layout: defineProp<ViewLayout>({ type: Object, required: true }),
    };
}
