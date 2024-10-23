import { defineActionHandler } from '@superadmin/core';

import { customersTable } from './customers.module.js';

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
