<script lang="ts" setup>
import { useService } from '@nzyme/vue-ioc/useService.js';
import { provideContext } from '@nzyme/vue-utils/context.js';
import { computed } from 'vue';

import { useViewProps } from '@superadmin/client/actions/useViewProps.js';
import { ComponentRegistry } from '@superadmin/client/components/ComponentRegistry.js';
import { ViewContext } from '@superadmin/client/views/ViewContext.js';

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
