import { defineActionHandler } from '@superadmin/core';
import { openMenuInternal } from '@superadmin/core/module';

import { MenuService } from '../components/MenuService.js';

export const openMenuHandler = defineActionHandler({
    action: openMenuInternal,
    deps: {
        menuService: MenuService,
    },
    setup({ menuService }) {
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
