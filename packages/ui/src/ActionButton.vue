<script lang="ts" setup>
import Button from 'primevue/button';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { randomString } from '@nzyme/crypto-utils';
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

const id = `button-${randomString(12)}`;

const actionDef = computed(() => actionRegistry.resolve(props.button.action));
const label = computed(() => {
    if (props.button.label) {
        return props.button.label;
    }

    if (props.button.icon) {
        return undefined;
    }

    if (actionDef.value) {
        return prettifyName(actionDef.value.name);
    }

    return undefined;
});

async function onClick(e: Event) {
    await actionDispatcher(props.button.action, e);
}
</script>

<template>
    <Button
        :id="id"
        :label="label"
        :size="size"
        :color="button.color"
        :outlined="button.style === 'outline'"
        :link="button.style === 'link'"
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
