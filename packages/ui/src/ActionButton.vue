<script lang="ts" setup>
import Button from 'primevue/button';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { randomString } from '@nzyme/crypto-utils';
import { useService } from '@nzyme/vue';
import { useEmitAsync } from '@nzyme/vue-utils';
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

type Events = {
    click: [event: Event];
    action: [event: Event];
};

defineEmits<Events>();
const emitAsync = useEmitAsync<Events>();

const actionRegistry = useService(ActionRegistry);
const actionDispatcher = useService(ActionDispatcher);

const id = `button-${randomString(12)}`;

const actionDef = computed(
    () => props.button.action && actionRegistry.resolve(props.button.action),
);
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
    await emitAsync('click', e);

    if (!props.button.action) {
        return;
    }

    await actionDispatcher(props.button.action, e);
    await emitAsync('action', e);
}
</script>

<template>
    <Button
        :id="id"
        :label="label"
        :size="size"
        :severity="button.color"
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
