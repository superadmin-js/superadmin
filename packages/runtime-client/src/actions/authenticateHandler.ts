import { AuthStore, defineActionHandler } from '@superadmin/client';
import { authenticateAction } from '@superadmin/core/internal';

export const authenticateHandler = defineActionHandler({
    action: authenticateAction,
    setup: ({ inject }) => {
        const authStore = inject(AuthStore);

        return data => {
            authStore.authenticate(data);
        };
    },
});
