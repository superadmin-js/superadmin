import { defineSubmodule } from '@superadmin/core/defineSubmodule.js';
import type { Schema, SchemaBase } from '@superadmin/schema';

import type { EditorComponent } from './EditorComponent.js';
import { EditorRegistry } from './EditorRegistry.js';

/** Options for defining an editor component for a schema type. */
export interface EditorOptions<S extends Schema> {
    /** Schema or schema base type this editor handles. */
    schema: S | SchemaBase<S>;
    /** Vue component that provides the editing UI. */
    component: EditorComponent<S>;
}

/** Creates a submodule that registers an editor component for a schema type. */
export function defineEditor<S extends Schema>(options: EditorOptions<S>) {
    return defineSubmodule({
        install(container) {
            container.resolve(EditorRegistry).register(options.schema, options.component);
        },
        ...options,
    });
}
