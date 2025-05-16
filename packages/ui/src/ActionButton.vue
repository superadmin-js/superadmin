<script lang="ts" setup>
import { randomString } from '@nzyme/crypto-utils';
import { useService } from '@nzyme/vue-ioc';
import { useEmitAsync } from '@nzyme/vue-utils';
import Button from 'primevue/button';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { ActionDispatcher, AuthStore } from '@superadmin/client';
import { ActionRegistry } from '@superadmin/core';
import type { ActionButton } from '@superadmin/core';

import Icon from './Icon.vue';

const props = defineProps({
  button: {
    type: Object as PropType<ActionButton>,
    required: true,
  },
  size: {
    type: String as PropType<'large' | 'small'>,
  },
});

type Events = {
  action: [event: Event];
  click: [event: Event];
};

defineEmits<Events>();
const emitAsync = useEmitAsync<Events>();

const authStore = useService(AuthStore);
const actionRegistry = useService(ActionRegistry);
const actionDispatcher = useService(ActionDispatcher);

const id = `button-${randomString(12)}`;

const actionDef = computed(
  () => props.button.action && actionRegistry.resolve(props.button.action),
);

const isAuthorized = computed(() => {
  if (!actionDef.value) {
    return true;
  }

  return actionDef.value.auth.isAuthorized(authStore.auth);
});

const label = computed(() => {
  if (props.button.label) {
    return props.button.label;
  }

  if (props.button.icon) {
    return undefined;
  }

  if (actionDef.value) {
    return actionDef.value.title;
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
    v-if="isAuthorized"
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
