<script lang="ts" setup>
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';

import { useEditor, useEditorProps } from '@superadmin/client';
import type { StringSchema } from '@superadmin/schema';

const props = defineProps({
    ...useEditorProps<StringSchema>(),
});

const model = defineModel<string | null | undefined>();
const editor = useEditor(props);
</script>

<template>
    <IftaLabel>
        <InputText
            :id="editor.id"
            v-model="model"
            variant="filled"
            class="w-full"
            :name="path"
            :invalid="!!errors?.[path]"
        />
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
