<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import { useService } from '@nzyme/vue-ioc';
import { TemplateRegistry } from '@superadmin/client';
import type { View } from '@superadmin/core';
import { coerce } from '@superadmin/schema';

const props = defineProps({
    view: { type: Object as PropType<View>, required: true },
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
        :params="props.params ?? coerce(props.view.params)"
        :view="props.view"
    />
</template>
