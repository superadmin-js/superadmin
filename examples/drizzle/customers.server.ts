import { ApplicationError, goToView, runInParalell, showToast } from '@superadmin/core';
import { defineActionHandler } from '@superadmin/server';
import { eq } from 'drizzle-orm';

import {
    customersTable,
    deleteCustomer,
    editCustomerForm,
    newCustomerForm,
    syncCustomer,
} from './customers.common.js';
import { DatabaseClient } from './db/client.js';
import * as db from './db/schema.js';

export const customersFetch = defineActionHandler({
    action: customersTable.actions.fetch,
    setup({ inject }) {
        const dbClient = inject(DatabaseClient);

        return async () => {
            const customers = await dbClient.query.customers.findMany();

            return customers;
        };
    },
});

export const newCustomerSubmit = defineActionHandler({
    action: newCustomerForm.actions.submit,
    setup({ inject }) {
        const dbClient = inject(DatabaseClient);

        return async params => {
            const result = await dbClient
                .insert(db.customers)
                .values({
                    id: undefined,
                    firstName: params.firstName,
                    lastName: params.lastName,
                    email: params.email,
                })
                .onConflictDoNothing()
                .returning({ id: db.customers.id });

            if (result.length === 0) {
                throw new ApplicationError(`Customer with email ${params.email} already exists`);
            }

            return runInParalell([
                showToast({
                    type: 'success',
                    title: `Customer created`,
                    message: `Created customer ${params.firstName} ${params.lastName}`,
                    time: 3000,
                }),
                goToView(customersTable),
            ]);
        };
    },
});

export const editCustomerFetch = defineActionHandler({
    action: editCustomerForm.actions.fetch,
    setup({ inject }) {
        const dbClient = inject(DatabaseClient);

        return async params => {
            const customer = await dbClient.query.customers.findFirst({
                where: eq(db.customers.id, params.id),
            });

            if (!customer) {
                throw new ApplicationError(`Customer with id ${params.id} not found`);
            }

            return {
                id: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
            };
        };
    },
});

export const editCustomerSubmit = defineActionHandler({
    action: editCustomerForm.actions.submit,
    setup({ inject }) {
        const dbClient = inject(DatabaseClient);

        return async params => {
            const result = await dbClient
                .update(db.customers)
                .set({
                    firstName: params.firstName,
                    lastName: params.lastName,
                    email: params.email,
                })
                .where(eq(db.customers.id, params.id))
                .returning({ id: db.customers.id });

            if (result.length === 0) {
                throw new ApplicationError(`Customer with email ${params.email} already exists`);
            }

            return runInParalell([
                showToast({
                    type: 'success',
                    title: `Customer updated`,
                    message: `Updated customer ${params.firstName} ${params.lastName}`,
                    time: 3000,
                }),
                goToView(customersTable),
            ]);
        };
    },
});

export const syncCustomerHandler = defineActionHandler({
    action: syncCustomer,
    setup: () => {
        return params => {
            if (params.id === 1) {
                return showToast({
                    type: 'error',
                    title: `Customer sync failed`,
                    message: `Customer ${params.id} not found`,
                    time: 3000,
                });
            }

            return showToast({
                type: 'success',
                title: `Customer synced`,
                message: `Synced customer ${params.id}`,
                time: 3000,
            });
        };
    },
});

export const deleteCustomerHandler = defineActionHandler({
    action: deleteCustomer,
    setup({ inject }) {
        const dbClient = inject(DatabaseClient);

        return async params => {
            const result = await dbClient
                .delete(db.customers)
                .where(eq(db.customers.id, params.id))
                .returning();

            if (result.length === 0) {
                throw new ApplicationError(`Customer with id ${params.id} not found`);
            }

            const customer = result[0];

            return showToast({
                type: 'success',
                title: `Customer deleted`,
                message: `Deleted customer ${customer.firstName} ${customer.lastName}`,
                time: 3000,
            });
        };
    },
});
