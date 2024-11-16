import { defineEntity } from '@superadmin/drizzle';

import db from '../db/schema.js';

export const customers = defineEntity({
    schema: db,
    table: 'customers',
    listView: {
        path: '/customers',
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    },
});
