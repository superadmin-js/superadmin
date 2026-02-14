import * as s from '@superadmin/schema';

import { defineAction } from './defineAction.js';

export /**
 *
 */
const runInParalell = defineAction({
    params: s.array(s.action()),
    visit(action, visitor) {
        for (const innerAction of action.params) {
            visitor(innerAction);
        }
    },
});
