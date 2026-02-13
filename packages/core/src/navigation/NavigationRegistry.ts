import { defineService } from '@nzyme/ioc/Service.js';

import type { Navigation } from './defineNavigation.js';

/**
 *
 */
export const NavigationRegistry = defineService({
    name: 'NavigationRegistry',
    setup() {
        const navigationsByName = new Map<string, Navigation>();

        return {
            register,
            getById,
            getAll,
        };

        function register(navigation: Navigation) {
            if (navigationsByName.has(navigation.id)) {
                throw new Error(`Navigation ${navigation.id} already registered`);
            }

            navigationsByName.set(navigation.id, navigation);
        }

        function getById(id: string) {
            return navigationsByName.get(id);
        }

        function getAll() {
            return navigationsByName.values();
        }
    },
});
