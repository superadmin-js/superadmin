import { defineService } from '@nzyme/ioc/Service.js';

import type { Schema, SchemaBase } from '@superadmin/schema';

import type { EditorComponent } from './EditorComponent.js';

/**
 *
 */
export const EditorRegistry = defineService({
    name: 'EditorRegistry',
    setup() {
        const registry = new Map<Schema | SchemaBase, EditorComponent>();

        return {
            register,
            resolve,
        };

        function register<S extends Schema>(
            schema: S | SchemaBase<S>,
            component: EditorComponent<S>,
        ) {
            registry.set(schema, component as EditorComponent);
        }

        function resolve<S extends Schema>(schema: S) {
            return (
                registry.get(schema) ??
                (registry.get(schema.type) as EditorComponent<S> | undefined)
            );
        }
    },
});
