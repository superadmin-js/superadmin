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
            id: s.integer(),
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
            action: openModal(editCustomerForm, { id: c.id }),
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

export const newCustomerForm = defineFormView({
    name: 'newCustomer',
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

export const editCustomerForm = defineFormView({
    name: 'editCustomer',
    params: s.object({
        props: {
            id: s.integer(),
        },
    }),
    schema: s.object({
        props: {
            id: s.integer({
                hidden: true,
            }),
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

export const syncCustomer = defineAction({
    name: 'syncCustomer',
    params: s.object({
        props: {
            id: s.integer(),
        },
    }),
    result: s.action({ optional: true }),
});
