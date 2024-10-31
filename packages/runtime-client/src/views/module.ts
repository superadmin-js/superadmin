import { defineAsyncComponent } from 'vue';

import { defineTemplate } from '@superadmin/client';
import { loginGenericView } from '@superadmin/core';
import { formGenericView, tableGenericView } from '@superadmin/core/internal';

export const formView = defineTemplate({
    view: formGenericView,
    component: defineAsyncComponent(() => import('./FormView.vue')),
});

export const tableView = defineTemplate({
    view: tableGenericView,
    component: defineAsyncComponent(() => import('./TableView.vue')),
});

export const loginView = defineTemplate({
    view: loginGenericView,
    component: defineAsyncComponent(() => import('./LoginView.vue')),
});
