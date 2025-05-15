import { defineEndpoint } from '@nzyme/api-core';

import * as s from '@superadmin/schema';

/**
 *
 */
export const ActionEndpoint = defineEndpoint({
    path: '/action/:action',
    method: 'POST',
    input: s.object({
        action: s.string(),
        params: s.unknown(),
    }),
    output: s.unknown(),
});
