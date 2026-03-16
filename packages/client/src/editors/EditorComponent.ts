import type { Component } from '@nzyme/vue-utils/component.js';

import type { Infer, Schema } from '@superadmin/schema';

import type { EditorProps } from './useEditorProps.js';

/** Vue component type for editing values of a given schema type with v-model support. */
export type EditorComponent<S extends Schema = Schema> = Component<
    EditorProps<S> & {
        modelValue?: Infer<S> | null | undefined;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    {
        /** Emitted when the editor value changes. */
        'update:modelValue': (value: Infer<S>) => void;
    }
>;
