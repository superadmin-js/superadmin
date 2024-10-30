<script lang="ts" setup>
import { computed } from 'vue';

import { useService } from '@nzyme/vue';
import { provideContext } from '@nzyme/vue-utils';
import { TemplateRegistry, ViewContext, useViewProps } from '@superadmin/client';

const props = defineProps({
    ...useViewProps(),
});

provideContext(
    ViewContext,
    computed(() => props.view),
);

const templateRegistry = useService(TemplateRegistry);
const template = computed(() => {
    return templateRegistry.resolve(props.view);
});
</script>

<template>
    <component
        :is="template"
        v-bind="props"
    />
</template>
