import { AuthStore } from '@superadmin/client';
import { defineActionHandler } from '@superadmin/core';
import { authenticateAction } from '@superadmin/core/module';

export const authenticateHandler = defineActionHandler({
    action: authenticateAction,
    deps: {
        authStore: AuthStore,
    },
    setup: ({ authStore }) => {
        return data => {
            authStore.setAuth(data);
        };
    },
});
