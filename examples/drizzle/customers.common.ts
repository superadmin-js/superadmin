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
    rowSchema: Customer,
    rowActions: c => [syncCustomer({ id: c.id })],
});

export const syncCustomer = defineAction({
    name: 'syncCustomer',
    icon: 'refresh-ccw',
    params: s.object({
        props: {
            id: s.bigint(),
        },
    }),
    result: s.void(),
});
