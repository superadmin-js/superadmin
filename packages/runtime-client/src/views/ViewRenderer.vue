<script lang="ts" setup>
import { computed } from 'vue';

import { useService } from '@nzyme/vue-ioc';
import { provideContext } from '@nzyme/vue-utils';
import { ComponentRegistry, ViewContext, useViewProps } from '@superadmin/client';

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
