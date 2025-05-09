import { ApplicationError, goToView, runInParalell, showToast } from 'superadmin';
import { defineActionHandler } from 'superadmin';
import { eq } from 'drizzle-orm';

import {
    customers,
    deleteCustomer,
    editCustomer,
    newCustomer,
    syncCustomer,
} from './customers.common.js';
import db from '../db/schema.js';
import { Drizzle } from '../drizzle.server.js';

export const newCustomerSubmit = defineActionHandler({
    action: newCustomer.actions.submit,
    deps: {
        drizzle: Drizzle,
    },
    setup({ drizzle }) {
        return async params => {
            const result = await drizzle
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
                goToView(customers.tableView, {}),
            ]);
        };
    },
});

export const editCustomerFetch = defineActionHandler({
    action: editCustomer.actions.fetch,
    deps: {
        drizzle: Drizzle,
    },
    setup({ drizzle }) {
        return async params => {
            const customer = await drizzle.query.customers.findFirst({
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
    action: editCustomer.actions.submit,
    deps: {
        drizzle: Drizzle,
    },
    setup({ drizzle }) {
        return async params => {
            const result = await drizzle
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
                goToView(customers.tableView, {}),
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
    deps: {
        drizzle: Drizzle,
    },
    setup({ drizzle }) {
        return async params => {
            const result = await drizzle
                .delete(db.customers)
                .where(eq(db.customers.id, params.id))
                .returning();

            if (result.length === 0) {
                throw new ApplicationError(`Customer with id ${params.id} not found`);
            }

            const customer = result[0]!;

            return showToast({
                type: 'success',
                title: `Customer deleted`,
                message: `Deleted customer ${customer.firstName} ${customer.lastName}`,
                time: 3000,
            });
        };
    },
});
