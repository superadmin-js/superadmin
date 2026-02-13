import { Router } from '@superadmin/client/services/Router.js';
import { getViewRoute } from '@superadmin/client/views/getViewRoute.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { ViewRegistry } from '@superadmin/core/views/ViewRegistry.js';
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

            const route = getViewRoute(view, params.params);
            await router.push(route);
        };
    },
});
