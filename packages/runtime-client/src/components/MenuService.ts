import { defineService } from '@nzyme/ioc';
import { createEventEmitter } from '@nzyme/utils';

import type { MenuItem } from '@superadmin/core';

export const MenuService = defineService({
    name: 'MenuService',
    setup: () => {
        type MenuEvents = {
            open: {
                event: Event;
                items: MenuItem[];
            };
        };

        const events = createEventEmitter<MenuEvents>();

        return events;
    },
});
