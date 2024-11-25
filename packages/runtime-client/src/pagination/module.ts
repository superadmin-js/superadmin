import { defineAsyncComponent } from 'vue';

import { defineTemplate } from '@superadmin/client';
import { basicPaginationComponent } from '@superadmin/core/internal';

export const basicPagination = defineTemplate(basicPaginationComponent, {
    component: defineAsyncComponent(() => import('./BasicPagination.vue')),
});
