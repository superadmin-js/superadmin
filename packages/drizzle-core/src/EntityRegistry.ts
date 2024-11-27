import { defineService } from '@nzyme/ioc';

import type { Entity } from './defineEntity.js';

export const EntityRegistry = defineService({
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
