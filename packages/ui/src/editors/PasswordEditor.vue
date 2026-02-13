<script lang="ts" setup>
import InputText from 'primevue/inputtext';

import { useEditor } from '@superadmin/client/editors/useEditor.js';
import { useEditorProps } from '@superadmin/client/editors/useEditorProps.js';
import type { StringSchema } from '@superadmin/schema';

import FormField from './FormField.vue';

const props = defineProps({
  ...useEditorProps<StringSchema>(),
});

const model = defineModel<string | null | undefined>();
const editor = useEditor(props);
</script>

<template>
  <FormField
    :path="path"
    :schema="schema"
    :errors="errors"
  >
    <InputText
      :id="editor.id"
      v-model="model"
      variant="filled"
      class="w-full"
      type="password"
      autocomplete="current-password"
      :name="path"
      :invalid="!!errors?.[path]"
    />
  </FormField>
</template>
