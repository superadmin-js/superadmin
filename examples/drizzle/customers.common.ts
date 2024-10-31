import {
    defineAction,
    defineFormView,
    defineTableView,
    openMenu,
    openModal,
} from '@superadmin/core';
import * as s from '@superadmin/schema';
import { emailValidator, requiredValidator } from '@superadmin/validation';

export const customersTable = defineTableView({
    name: 'customers',
    path: '/customers',
    schema: s.object({
        props: {
            id: s.bigint(),
            firstName: s.string(),
            lastName: s.string(),
            email: s.string(),
        },
    }),
    headerButtons: () => [
        {
            label: 'New customer',
            icon: 'plus',
            action: openModal(newCustomerForm),
        },
    ],
    rowButtons: c => [
        {
            icon: 'edit',
            label: 'Edit',
            action: openModal(newCustomerForm),
            style: 'outline',
        },
        {
            icon: 'more-vertical',
            style: 'outline',
            action: openMenu([
                {
                    icon: 'refresh-ccw',
                    action: syncCustomer({ id: c.id }),
                },
            ]),
        },
    ],
});

export const syncCustomer = defineAction({
    name: 'syncCustomer',
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
