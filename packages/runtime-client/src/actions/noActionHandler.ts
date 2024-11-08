import { noop } from '@nzyme/utils';
import { defineActionHandler } from '@superadmin/client';
import { noAction } from '@superadmin/core';

export const noActionHandler = defineActionHandler({
    action: noAction,
    setup: () => {
        return noop;
    },
});
