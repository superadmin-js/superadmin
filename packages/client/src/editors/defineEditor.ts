import { defineSubmodule } from '@superadmin/core/defineSubmodule.js';
import type { Schema, SchemaBase } from '@superadmin/schema';

import type { EditorComponent } from './EditorComponent.js';
import { EditorRegistry } from './EditorRegistry.js';

export interface EditorOptions<S extends Schema> {
    schema: SchemaBase<S> | S;
    component: EditorComponent<S>;
}

export function defineEditor<S extends Schema>(options: EditorOptions<S>) {
    return defineSubmodule({
        install(container) {
            container.resolve(EditorRegistry).register(options.schema, options.component);
        },
        ...options,
    });
}
