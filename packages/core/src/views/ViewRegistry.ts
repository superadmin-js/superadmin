import { defineService } from '@nzyme/ioc';

import type { View } from './defineView.js';

export const ViewRegistry = defineService({
    name: 'ViewRegistry',
    setup() {
        const viewsByName = new Map<string, View>();

        return {
            register,
            getByName,
            getAll,
        };

        function register(view: View) {
            if (viewsByName.has(view.name)) {
                throw new Error(`View ${view.name} already registered`);
            }

            viewsByName.set(view.name, view);
        }

        function getByName(name: string) {
            return viewsByName.get(name);
        }

        function getAll() {
            return viewsByName.values();
        }
    },
});
