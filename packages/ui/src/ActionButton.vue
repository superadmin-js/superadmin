<script lang="ts" setup>
import Button from 'primevue/button';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { useService } from '@nzyme/vue';
import { ActionDispatcher } from '@superadmin/client';
import { type ActionButton, ActionRegistry } from '@superadmin/core';
import { prettifyName } from '@superadmin/utils';

import Icon from './Icon.vue';

const props = defineProps({
    button: {
        type: Object as PropType<ActionButton>,
        required: true,
    },
    size: {
        type: String as PropType<'small' | 'large'>,
    },
});

const actionRegistry = useService(ActionRegistry);
const actionDispatcher = useService(ActionDispatcher);

const actionDef = computed(() => actionRegistry.resolveAction(props.button.action));
const label = computed(
    () => props.button.label || (actionDef.value ? prettifyName(actionDef.value.name) : ''),
);

async function onClick() {
    await actionDispatcher(props.button.action);
}
</script>

<template>
    <Button
        :label="label"
        :size="size"
        :severity="button.style"
        @click="onClick"
    >
        <template
            v-if="button.icon"
            #icon
        >
            <Icon :icon="button.icon" />
        </template>
    </Button>
</template>
