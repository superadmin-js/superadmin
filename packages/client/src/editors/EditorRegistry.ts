import { defineService } from '@nzyme/ioc';
import { type Schema, type SchemaBase, getBase } from '@superadmin/schema';

import type { EditorComponent } from './EditorComponent.js';

export const EditorRegistry = defineService({
    name: 'EditorRegistry',
    setup() {
        const registry = new Map<SchemaBase | Schema, EditorComponent>();

        return {
            register,
            resolve,
        };

        function register<S extends Schema>(
            schema: SchemaBase<S> | S,
            component: EditorComponent<S>,
        ) {
            registry.set(schema, component as EditorComponent);
        }

        function resolve<S extends Schema>(schema: S) {
            return (
                registry.get(schema) ??
                (registry.get(getBase(schema)) as EditorComponent<S> | undefined)
            );
        }
    },
});
