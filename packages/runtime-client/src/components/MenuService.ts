import { defineService } from '@nzyme/ioc/Service.js';
import { createEventEmitter } from '@nzyme/utils/createEventEmitter.js';

import type { MenuItem } from '@superadmin/core/actions/openMenu.js';

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
