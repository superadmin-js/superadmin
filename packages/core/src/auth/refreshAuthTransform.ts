import * as s from '@superadmin/schema';

import { defineFunction } from '../functions/defineFunction.js';

export const refreshAuthTransform = defineFunction({
    name: 'superadmin.refreshAuthTransform',
    params: s.string(),
    result: s.unknown(),
});
