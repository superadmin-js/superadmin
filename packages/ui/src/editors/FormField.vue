<script lang="ts" setup>
import IftaLabel from 'primevue/iftalabel';

import { useEditor, useEditorProps } from '@superadmin/client';

const props = defineProps({
    ...useEditorProps(),
});

const editor = useEditor(props);
</script>

<template>
    <IftaLabel>
        <slot />
        <label
            v-if="editor.label"
            :for="editor.id"
        >
            {{ editor.label }}
        </label>

        <small
            v-for="error in errors?.[path]"
            class="text-red-600"
        >
            {{ error }}
        </small>
    </IftaLabel>
</template>
