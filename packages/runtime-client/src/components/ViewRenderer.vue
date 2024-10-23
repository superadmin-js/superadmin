<script lang="ts" setup>
import { computed } from 'vue';

import { useService } from '@nzyme/vue';
import { TemplateRegistry } from '@superadmin/client';

const props = defineProps({
    view: { type: String, required: true },
    params: { type: Object, required: false },
});

const templateRegistry = useService(TemplateRegistry);

const template = computed(() => {
    return templateRegistry.resolve(props.view);
});
</script>

<template>
    <component
        :is="template"
        :params="props.params"
    />
</template>
