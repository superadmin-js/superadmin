import { defineAction, tableView } from '@superadmin/core';
import * as s from '@superadmin/schema';

export const customersTable = tableView({
    name: 'customers',
    path: '/customers',
    data: s.object({
        props: {
            id: s.bigint(),
            firstName: s.string(),
            lastName: s.string(),
            email: s.string(),
        },
    }),
});

export const syncCustomer = defineAction({
    name: 'syncCustomer',
    input: s.object({
        props: {
            id: s.bigint(),
        },
    }),
    output: s.void(),
});
