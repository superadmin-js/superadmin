import { Router } from '@superadmin/client';
import { ViewRegistry, defineActionHandler } from '@superadmin/core';
import { goToViewInternal } from '@superadmin/core/internal';

export const goToViewHandler = defineActionHandler({
    action: goToViewInternal,
    setup: ({ inject }) => {
        const router = inject(Router);
        const viewRegistry = inject(ViewRegistry);

        return async params => {
            const view = viewRegistry.getByName(params.view);
            if (!view) {
                throw new Error(`View ${params.view} not found`);
            }

            await router.push({
                path: view.path,
                query: {
                    p: JSON.stringify(params.params),
                },
            });
        };
    },
});
