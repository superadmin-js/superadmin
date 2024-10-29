import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

export const runInSequence = defineAction({
    name: 'superadmin.runInSequence',
    params: s.array(s.action()),
});
