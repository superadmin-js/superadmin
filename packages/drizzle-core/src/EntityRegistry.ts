import { defineService } from '@nzyme/ioc/Service.js';

import type { Entity } from './defineEntityTableView.js';

export /**
 *
 */
const EntityRegistry = defineService({
    name: 'EntityRegistry',
    setup() {
        const entities: Entity[] = [];

        return {
            register,
            getAll,
        };

        function register(entity: Entity) {
            entities.push(entity);
        }

        function getAll() {
            return entities;
        }
    },
});
