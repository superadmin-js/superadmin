import type { Component } from '@nzyme/vue-utils';
import type { Schema, SchemaValue } from '@superadmin/schema';

import type { EditorProps } from './useEditorProps.js';

export type EditorComponent<S extends Schema = Schema> = Component<
    EditorProps<S> & { modelValue?: SchemaValue<S> | null | undefined },
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    {
        'update:modelValue': (value: SchemaValue<S>) => void;
    }
>;
