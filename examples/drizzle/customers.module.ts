import { defineAction, tableView } from '@superadmin/core';
import * as s from '@superadmin/schema';

export const Customer = s.object({
    props: {
        id: s.bigint(),
        firstName: s.string(),
        lastName: s.string(),
        email: s.string(),
    },
});

export type Customer = s.SchemaValue<typeof Customer>;

export const customersTable = tableView({
    name: 'customers',
    path: '/customers',
    data: Customer,
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
