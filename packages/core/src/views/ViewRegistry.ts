import { defineService } from '@nzyme/ioc/Service.js';

import type { View } from './defineView.js';

export /**
 *
 */
const ViewRegistry = defineService({
    name: 'ViewRegistry',
    setup() {
        const viewsByName = new Map<string, View>();

        return {
            register,
            getById,
            getAll,
        };

        function register(view: View) {
            if (viewsByName.has(view.id)) {
                throw new Error(`View ${view.id} already registered`);
            }

            viewsByName.set(view.id, view);
        }

        function getById(id: string) {
            return viewsByName.get(id);
        }

        function getAll() {
            return viewsByName.values();
        }
    },
});
