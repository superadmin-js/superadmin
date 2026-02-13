<script lang="ts" setup>
import { computed } from 'vue';

import { useService } from '@nzyme/vue-ioc/useService.js';
import { provideContext } from '@nzyme/vue-utils/context.js';
import { ComponentRegistry } from '@superadmin/client/components/ComponentRegistry.js';
import { ViewContext } from '@superadmin/client/views/ViewContext.js';
import { useViewProps } from '@superadmin/client/actions/useViewProps.js';

const props = defineProps({
  ...useViewProps(),
});

provideContext(
  ViewContext,
  computed(() => props.view),
);

const componentRegistry = useService(ComponentRegistry);
const template = computed(() => {
  return componentRegistry.resolve(props.view.component);
});
</script>

<template>
  <component
    :is="template"
    v-bind="props"
  />
</template>
