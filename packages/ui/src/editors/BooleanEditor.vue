<script lang="ts" setup>
import Checkbox from 'primevue/checkbox';

import { useEditor, useEditorProps } from '@superadmin/client';
import type { BooleanSchema } from '@superadmin/schema';

const props = defineProps({
  ...useEditorProps<BooleanSchema>(),
});

const model = defineModel<boolean | null | undefined>();
const editor = useEditor(props);
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <Checkbox
        :id="editor.id"
        v-model="model"
        :binary="true"
        class="p-checkbox p-component"
        :class="{ 'p-invalid': !!errors?.[path] }"
        :pt:root:name="path"
      />
      <label :for="editor.id"> {{ editor.label }} </label>
    </div>
    <small
      v-if="schema.help"
      class="text-gray-600"
    >
      {{ schema.help }}
    </small>

    <small
      v-for="error in errors?.[path]"
      class="text-red-600"
    >
      {{ error }}
    </small>
  </div>
</template>
