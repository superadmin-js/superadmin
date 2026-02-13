import { noop } from '@nzyme/utils/functions/noop.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { noAction } from '@superadmin/core/actions/noAction.js';

export const noActionHandler = defineActionHandler({
    action: noAction,
    setup: () => {
        return noop;
    },
});
