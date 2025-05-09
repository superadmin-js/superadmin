import { noop } from '@nzyme/utils';
import { defineActionHandler } from '@superadmin/core';
import { noAction } from '@superadmin/core';

export const noActionHandler = defineActionHandler({
    action: noAction,
    setup: () => {
        return noop;
    },
});
