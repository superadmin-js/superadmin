<script lang="ts" setup>
import { useService } from '@nzyme/vue-ioc';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { ComponentRegistry } from '@superadmin/client';
import type { View } from '@superadmin/core';
import { coerce } from '@superadmin/schema';

const props = defineProps({
  view: { type: Object as PropType<View>, required: true },
  params: { type: Object, required: false },
});

const componentRegistry = useService(ComponentRegistry);

const template = computed(() => {
  return componentRegistry.resolve(props.view.component);
});
</script>

<template>
  <component
    :is="template"
    :params="props.params ?? coerce(props.view.params)"
    :view="props.view"
  />
</template>
