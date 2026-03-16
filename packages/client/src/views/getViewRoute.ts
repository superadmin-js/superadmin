import type { RouteLocationRaw } from 'vue-router';

import type { View } from '@superadmin/core/views/defineView.js';

/** Converts a view definition and its params into a vue-router route location with serialized query params. */
export function getViewRoute(view: View, params: unknown): RouteLocationRaw {
    return {
        path: view.path,
        query: {
            p: JSON.stringify(params),
        },
    };
}
