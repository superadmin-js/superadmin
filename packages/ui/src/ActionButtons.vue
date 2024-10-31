<script lang="ts" setup>
import type { PropType } from 'vue';

import type { ActionButton } from '@superadmin/core';

import Button from './ActionButton.vue';

defineProps({
    buttons: {
        type: Array as PropType<ActionButton[]>,
    },
    size: {
        type: String as PropType<'small' | 'large'>,
    },
});
</script>

<template>
    <Button
        v-for="(button, index) in buttons"
        :key="index"
        :button="button"
        :size="size"
    />
</template>
