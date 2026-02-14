import type { PropType } from 'vue';

import type { Schema } from '@superadmin/schema';
import type { ValidationErrors } from '@superadmin/validation';

/**
 *
 */
export type EditorProps<S extends Schema> = {
    /**
     *
     */
    path: string;
    /**
     *
     */
    schema: S;
    /**
     *
     */
    errors?: ValidationErrors | null;
};

/**
 *
 */
export function useEditorProps<S extends Schema = Schema>() {
    return {
        path: { type: String, required: true } as const,
        schema: { type: Object as PropType<S>, required: true } as const,
        errors: { type: Object as PropType<ValidationErrors | null> } as const,
    };
}
