<script lang="ts" setup>
import { computed } from 'vue';

import { useEditorProps } from '@superadmin/client';
import { coerceNonNull } from '@superadmin/schema';
import type { ObjectSchema } from '@superadmin/schema';
import { concatKeys } from '@superadmin/validation';

import Editor from '../Editor.vue';

const props = defineProps({
  ...useEditorProps<ObjectSchema>(),
});

const model = defineModel<Record<string, unknown> | null | undefined>();
const fields = computed(() =>
  Object.entries(props.schema.props).filter(([_, schema]) => !schema.hidden),
);

function setProp(prop: string, value: unknown) {
  if (!model.value) {
    model.value = coerceNonNull(props.schema, {});
  }

  model.value[prop] = value;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Editor
      v-for="[prop, schema] in fields"
      :key="prop"
      :model-value="model?.[prop]"
      :schema="schema"
      :path="concatKeys(props.path, prop)"
      :errors="props.errors"
      @update:model-value="setProp(prop, $event)"
    />
  </div>
</template>
