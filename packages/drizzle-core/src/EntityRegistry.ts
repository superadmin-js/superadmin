import { defineService } from '@nzyme/ioc';

import type { Entity } from './defineEntity.js';

export const EntityRegistry = defineService({
    name: 'EntityRegistry',
    setup() {
        const entitiesByName = new Map<string, Entity>();

        return {
            register,
            getByName,
            getAll,
        };

        function register(entity: Entity) {
            if (entitiesByName.has(entity.name)) {
                throw new Error(`Entity ${entity.name} already registered`);
            }

            entitiesByName.set(entity.name, entity);
        }

        function getByName(name: string) {
            return entitiesByName.get(name);
        }

        function getAll() {
            return entitiesByName.values();
        }
    },
});
