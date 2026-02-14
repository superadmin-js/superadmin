import { randomString } from '@nzyme/crypto';
import { computed, reactive } from 'vue';

import type { Schema } from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils/prettifyName.js';

import type { EditorProps } from './useEditorProps.js';

/**
 *
 */
export function useEditor<S extends Schema>(props: EditorProps<S>) {
    const id = `editor-${randomString(10)}`;
    const label = computed(() => {
        if (props.schema.label) {
            return props.schema.label;
        }

        if (props.path) {
            return prettifyName(props.path);
        }

        return null;
    });

    return reactive({
        id,
        label,
    });
}
