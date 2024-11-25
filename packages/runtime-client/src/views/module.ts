import { defineAsyncComponent } from 'vue';

import { defineTemplate } from '@superadmin/client';
import { formComponent, loginComponent, tableComponent } from '@superadmin/core/internal';

export const formView = defineTemplate(formComponent, {
    component: defineAsyncComponent(() => import('./FormView.vue')),
});

export const tableView = defineTemplate(tableComponent, {
    component: defineAsyncComponent(() => import('./TableView.vue')),
});

export const loginView = defineTemplate(loginComponent, {
    component: defineAsyncComponent(() => import('./LoginView.vue')),
});
