import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

export const runInParalell = defineAction({
    name: 'superadmin.runInParalell',
    params: s.array(s.action()),
});
