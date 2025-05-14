import type { RouteLocationRaw } from 'vue-router';

import type { View } from '@superadmin/core';

/**
 *
 */
export function getViewRoute(view: View, params: unknown): RouteLocationRaw {
    return {
        path: view.path,
        query: {
            p: JSON.stringify(params),
        },
    };
}
