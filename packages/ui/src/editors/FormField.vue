<script lang="ts" setup>
import IftaLabel from 'primevue/iftalabel';

import { useEditor, useEditorProps } from '@superadmin/client';

const props = defineProps({
  ...useEditorProps(),
  /**
   * The label variant to use
   * - 'floating': Uses IftaLabel for floating labels (default for inputs)
   * - 'static': Uses regular label above the field (better for selects)
   */
  labelVariant: {
    type: String as () => 'floating' | 'static',
    default: 'floating',
  },
});

const editor = useEditor(props);
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Static label variant -->
    <template v-if="labelVariant === 'static'">
      <label
        v-if="editor.label"
        :for="editor.id"
        class="text-sm font-medium text-gray-700"
      >
        {{ editor.label }}
      </label>
      <slot />
    </template>

    <!-- Floating label variant -->
    <IftaLabel v-else>
      <slot />
      <label
        v-if="editor.label"
        :for="editor.id"
      >
        {{ editor.label }}
      </label>
    </IftaLabel>

    <!-- Help text -->
    <small
      v-if="schema.help"
      class="text-gray-600 text-xs"
    >
      {{ schema.help }}
    </small>

    <!-- Error messages -->
    <div
      v-if="errors?.[path]?.length"
      class="flex flex-col gap-1"
    >
      <small
        v-for="error in errors[path]"
        :key="error"
        class="text-red-600 text-xs block"
      >
        {{ error }}
      </small>
    </div>
  </div>
</template>
