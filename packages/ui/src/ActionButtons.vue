<script lang="ts" setup>
import { classProp } from '@nzyme/vue-utils/classProp.js';
import { useEmitAsync } from '@nzyme/vue-utils/useEmitAsync.js';
import type { PropType } from 'vue';

import type { ActionButton } from '@superadmin/core/actions/ActionButton.js';

import Button from './ActionButton.vue';

const props = defineProps({
  buttons: {
    type: Array as PropType<ActionButton[]>,
  },
  size: {
    type: String as PropType<'large' | 'small'>,
  },
  class: classProp,
});

type Events = {
  action: [event: Event];
};

defineEmits<Events>();
const emitAsync = useEmitAsync<Events>();
</script>

<template>
  <Button
    v-for="(button, index) in buttons"
    :key="index"
    :class="props.class"
    :button="button"
    :size="size"
    @action="emitAsync('action', $event)"
  />
</template>
