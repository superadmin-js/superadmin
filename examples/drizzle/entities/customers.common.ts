import {
    defineAction,
    defineFormView,
    openConfirmDialog,
    openMenu,
    openModal,
} from '@superadmin/core';
import { defineEntity } from '@superadmin/drizzle';
import * as s from '@superadmin/schema';
import { emailValidator, requiredValidator } from '@superadmin/validation';

import db from '../db/schema.js';

export const customers = defineEntity({
    schema: db,
    table: 'customers',
    tableView: {
        path: '/customers',
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
        },
        pageSizes: [10, 25, 50, 100],
        headerButtons: () => [
            {
                label: 'New customer',
                icon: 'plus',
                action: openModal(newCustomer),
            },
        ],
        rowButtons: c => [
            {
                icon: 'edit',
                label: 'Edit',
                action: openModal(editCustomer, { id: c.id }),
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
                    {
                        label: 'Delete customer',
                        icon: 'trash',
                        color: 'danger',
                        action: openConfirmDialog({
                            message: `Are you sure you want to delete customer ${c.firstName} ${c.lastName}?`,
                            yes: {
                                action: deleteCustomer({ id: c.id }),
                                color: 'danger',
                            },
                        }),
                    },
                ]),
            },
        ],
    },
});

export const newCustomer = defineFormView({
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

export const editCustomer = defineFormView({
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
    params: s.object({
        props: {
            id: s.integer(),
        },
    }),
    result: s.action({ optional: true }),
});

export const deleteCustomer = defineAction({
    params: s.object({
        props: {
            id: s.integer(),
        },
    }),
    result: s.action({ optional: true }),
});
