<script lang="ts" setup>
import { computed } from 'vue';

import { useService } from '@nzyme/vue-ioc/useService.js';
import { EditorRegistry } from '@superadmin/client/editors/EditorRegistry.js';
import { useEditorProps } from '@superadmin/client/editors/useEditorProps.js';

const props = defineProps({
  ...useEditorProps(),
});

const model = defineModel<unknown>();
const editorRegistry = useService(EditorRegistry);
const editor = computed(() => editorRegistry.resolve(props.schema));
</script>

<template>
  <component
    :is="editor"
    v-model="model"
    :schema="props.schema"
    :errors="props.errors"
    :path="props.path"
  />
</template>
