import type { PropType } from 'vue';

import type { Schema } from '@superadmin/schema';
import type { ValidationErrors } from '@superadmin/validation';

/** Props passed to editor components. */
export type EditorProps<S extends Schema> = {
    /** Dot-separated path identifying this field within the form data. */
    path: string;
    /** Schema definition for the value being edited. */
    schema: S;
    /** Validation errors associated with this field. */
    errors?: ValidationErrors | null;
};

/** Creates Vue prop definitions for editor components (path, schema, errors). */
export function useEditorProps<S extends Schema = Schema>() {
    return {
        path: { type: String, required: true } as const,
        schema: { type: Object as PropType<S>, required: true } as const,
        errors: { type: Object as PropType<ValidationErrors | null> } as const,
    };
}
