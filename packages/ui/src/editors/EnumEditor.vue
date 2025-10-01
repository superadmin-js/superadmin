<script lang="ts" setup>
import type { Primitive } from '@nzyme/types';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import { computed } from 'vue';

import { useEditor, useEditorProps } from '@superadmin/client';
import type { EnumSchema } from '@superadmin/schema';

import FormField from './FormField.vue';

const props = defineProps({
  ...useEditorProps<EnumSchema>(),
});

const model = defineModel<Primitive | null | undefined>();
const editor = useEditor(props);

const options = computed(() => {
  return props.schema.values.map(value => ({
    label: String(value),
    value: value,
  }));
});

const useSelectButton = computed(() => {
  return props.schema.values.length <= 3;
});
</script>

<template>
  <FormField
    :path="path"
    :schema="schema"
    :errors="errors"
    label-variant="static"
  >
    <SelectButton
      v-if="useSelectButton"
      :id="editor.id"
      v-model="model"
      :options="options"
      option-label="label"
      option-value="value"
      class="p-selectbutton p-component w-full"
      :class="{ 'p-invalid': !!errors?.[path] }"
      :pt:root:name="path"
    />
    <Select
      v-else
      :id="editor.id"
      v-model="model"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="`Select ${editor.label || 'option'}...`"
      class="p-select p-component w-full"
      :class="{ 'p-invalid': !!errors?.[path] }"
      :pt:root:name="path"
    />
  </FormField>
</template>
