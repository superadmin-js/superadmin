import { Router } from '@superadmin/client';
import { defineActionHandler, ViewRegistry } from '@superadmin/core';
import { goToViewAction } from '@superadmin/core/internal';

export const goToViewHandler = defineActionHandler({
    action: goToViewAction,
    deps: {
        router: Router,
        viewRegistry: ViewRegistry,
    },
    setup({ router, viewRegistry }) {
        return async params => {
            const view = viewRegistry.getById(params.view);
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
