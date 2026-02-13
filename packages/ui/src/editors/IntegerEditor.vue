<script lang="ts" setup>
import InputNumber from 'primevue/inputnumber';

import { useEditor } from '@superadmin/client/editors/useEditor.js';
import { useEditorProps } from '@superadmin/client/editors/useEditorProps.js';
import type { IntegerSchema } from '@superadmin/schema';

import FormField from './FormField.vue';

const props = defineProps({
  ...useEditorProps<IntegerSchema>(),
});

const model = defineModel<number | null | undefined>();
const editor = useEditor(props);
</script>

<template>
  <FormField
    :path="path"
    :schema="schema"
    :errors="errors"
  >
    <InputNumber
      :id="editor.id"
      v-model="model"
      variant="filled"
      class="w-full"
      :name="path"
      :invalid="!!errors?.[path]"
    />
  </FormField>
</template>
