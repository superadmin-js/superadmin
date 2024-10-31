import { defineService } from '@nzyme/ioc';
import { createEventEmitter } from '@nzyme/utils';
import type { MenuItem } from '@superadmin/core';

export const MenuService = defineService({
    name: 'MenuService',
    setup: () => {
        type MenuEvents = {
            open: {
                items: MenuItem[];
                event: Event;
            };
        };

        const events = createEventEmitter<MenuEvents>();

        return events;
    },
});
