import { defineTemplate } from '@superadmin/client';
import { tableGenericView } from '@superadmin/core/internal';

import TableView from './tableView.vue';

export const tableView = defineTemplate({
    view: tableGenericView,
    component: TableView,
});
