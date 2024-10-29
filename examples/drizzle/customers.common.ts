import { defineAction, defineFormView, defineTableView } from '@superadmin/core';
import * as s from '@superadmin/schema';
import { emailValidator, requiredValidator } from '@superadmin/validation';

export const customersTable = defineTableView({
    name: 'customers',
    path: '/customers',
    rowSchema: s.object({
        props: {
            id: s.bigint(),
            firstName: s.string(),
            lastName: s.string(),
            email: s.string(),
        },
    }),
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
    result: s.action({ optional: true }),
});

export const newCustomerForm = defineFormView({
    name: 'newCustomer',
    path: '/customers/new',
    schema: s.object({
        props: {
            firstName: s.string({
                validators: [requiredValidator()],
            }),
            lastName: s.string({
                validators: [requiredValidator()],
            }),
            email: s.string({
                validators: [requiredValidator(), emailValidator()],
            }),
        },
    }),
});
