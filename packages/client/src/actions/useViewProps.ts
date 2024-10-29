import { defineProp } from '@nzyme/vue-utils';
import type { View, ViewParams } from '@superadmin/core';

export function useViewProps<TView extends View>() {
    return {
        view: defineProp<TView>({ type: Object, required: true }),
        params: defineProp<ViewParams<TView>>({ required: true }),
    };
}
