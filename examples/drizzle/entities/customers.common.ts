import {
    defineAction,
    defineFormView,
    defineNavigation,
    goToView,
    openConfirmDialog,
    openMenu,
    openModal,
} from 'superadmin';
import { defineEntity } from '@superadmin/drizzle';
import * as s from 'superadmin/schema';
import * as v from 'superadmin/validation';

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
                icon: 'pencil',
                label: 'Edit',
                action: openModal(editCustomer, { id: c.id }),
                style: 'outline',
            },
            {
                icon: 'ellipsis-vertical',
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
        firstName: s.string({
            validate: [v.required()],
        }),
        lastName: s.string({
            validate: [v.required()],
        }),
        email: s.string({
            validate: [v.required(), v.email()],
        }),
    }),
});

export const editCustomer = defineFormView({
    params: s.object({
        id: s.integer(),
    }),
    schema: s.object({
        id: s.integer({
            hidden: true,
        }),
        firstName: s.string({
            validate: [v.required()],
        }),
        lastName: s.string({
            validate: [v.required()],
        }),
        email: s.string({
            validate: [v.required(), v.email()],
        }),
    }),
});

export const syncCustomer = defineAction({
    params: s.object({
        id: s.integer(),
    }),
    result: s.action({ optional: true }),
});

export const deleteCustomer = defineAction({
    params: s.object({
        id: s.integer(),
    }),
    result: s.action({ optional: true }),
});

export const navigation = defineNavigation({
    title: 'Customers',
    items: [
        {
            title: 'Customers',
            icon: 'users',
            action: goToView(customers.tableView, {}),
        },
    ],
});
