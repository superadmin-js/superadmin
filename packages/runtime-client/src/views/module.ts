import { defineAsyncComponent } from 'vue';

import { defineTemplate } from '@superadmin/client';
import { formGenericView, tableGenericView } from '@superadmin/core/internal';

export const formView = defineTemplate({
    view: formGenericView,
    component: defineAsyncComponent(() => import('./FormView.vue')),
});

export const tableView = defineTemplate({
    view: tableGenericView,
    component: defineAsyncComponent(() => import('./TableView.vue')),
});
