<script lang="ts" setup>
import feather from 'feather-icons/dist/feather-sprite.svg';

defineProps({
    icon: { type: String, required: true },
});
</script>

<template>
    <svg :class="css.icon">
        <use :href="`${feather}#${icon}`" />
    </svg>
</template>

<style lang="css" module="css">
.icon {
    width: 1em;
    height: 1em;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
}
</style>
