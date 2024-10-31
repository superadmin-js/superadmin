import { defineActionHandler } from '@superadmin/client';
import { openMenuInternal } from '@superadmin/core/internal';

import { MenuService } from '../components/MenuService.js';

export const openMenuHandler = defineActionHandler({
    action: openMenuInternal,
    setup: ({ inject }) => {
        const menuService = inject(MenuService);

        return async (params, event) => {
            if (!event) {
                console.warn('Opening menu requires user interaction event.');
                return;
            }

            await menuService.emitAsync('open', {
                event,
                items: params.items,
            });
        };
    },
});
