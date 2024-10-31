import { goToView, runInParalell, showToast } from '@superadmin/core';
import { defineActionHandler } from '@superadmin/server';

import { customersTable, newCustomerForm, syncCustomer } from './customers.common.js';

export const customersFetch = defineActionHandler({
    action: customersTable.actions.fetch,
    setup() {
        return () => {
            return [
                {
                    id: 1n,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                },
                {
                    id: 2n,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane.doe@example.com',
                },
            ];
        };
    },
});

export const newCustomerSubmit = defineActionHandler({
    action: newCustomerForm.actions.submit,
    setup: () => {
        return params => {
            console.log(params);

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

export const syncCustomerHandler = defineActionHandler({
    action: syncCustomer,
    setup: () => {
        return params => {
            if (params.id === 1n) {
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
