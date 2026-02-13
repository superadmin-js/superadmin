import { AuthStore } from '@superadmin/client/auth/AuthStore.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
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
