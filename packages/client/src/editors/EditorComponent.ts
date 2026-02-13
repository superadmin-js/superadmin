import type { Component } from '@nzyme/vue-utils/component.js';

import type { Infer, Schema } from '@superadmin/schema';

import type { EditorProps } from './useEditorProps.js';

/**
 *
 */
export type EditorComponent<S extends Schema = Schema> = Component<
    EditorProps<S> & {
        modelValue?: Infer<S> | null | undefined;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    {
        'update:modelValue': (value: Infer<S>) => void;
    }
>;
