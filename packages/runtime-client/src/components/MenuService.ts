import { defineService } from '@nzyme/ioc';
import { createEventEmitter } from '@nzyme/utils';

import type { MenuItem } from '@superadmin/core';

export const MenuService = defineService({
    name: 'MenuService',
    setup: () => {
        const onOpen = createEventEmitter<{
            event: Event;
            items: MenuItem[];
        }>();

        return {
            open: onOpen.emit,
            onOpen: onOpen.event,
        };
    },
});
