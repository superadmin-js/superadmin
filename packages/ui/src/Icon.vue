<script lang="ts" setup>
import sprite from 'lucide-static/sprite.svg';

defineProps({
  icon: { type: String, required: true },
});
</script>

<template>
  <svg
    :class="css.icon"
    viewBox="0 0 24 24"
  >
    <use :href="`${sprite}#${icon}`" />
  </svg>
</template>

<style lang="css" module="css">
.icon {
  font-size: 1.25em;
  width: 1em;
  height: 1em;
  flex: 0 0 1em;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
</style>
