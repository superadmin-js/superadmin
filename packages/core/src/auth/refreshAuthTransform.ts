import * as s from '@superadmin/schema';

import { defineFunction } from '../functions/defineFunction.js';

/** Server-side transform that refreshes authentication from a refresh token string. */
export const refreshAuthTransform = defineFunction({
    name: 'superadmin.refreshAuthTransform',
    params: s.string(),
    result: s.unknown(),
});
