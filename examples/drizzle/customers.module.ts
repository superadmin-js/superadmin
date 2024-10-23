import { defineAction, tableView } from '@superadmin/core';

import * as z from '@nzyme/zchema';

export const customersTable = tableView({
    name: 'customers',
    path: '/customers',
    data: z.object({
        props: {
            id: z.bigint(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
        },
    }),
});

export const syncCustomer = defineAction({
    name: 'syncCustomer',
    input: z.object({
        props: {
            id: z.bigint(),
        },
    }),
    output: z.void(),
});
