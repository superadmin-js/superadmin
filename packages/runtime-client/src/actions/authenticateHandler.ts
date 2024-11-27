import { AuthStore, defineActionHandler } from '@superadmin/client';
import { authenticateAction } from '@superadmin/core/module';

export const authenticateHandler = defineActionHandler({
    action: authenticateAction,
    setup: ({ inject }) => {
        const authStore = inject(AuthStore);

        return data => {
            authStore.setAuth(data);
        };
    },
});
