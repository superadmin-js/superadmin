<script lang="ts" setup>
import { useService } from '@nzyme/vue-ioc';

import { NavigationRegistry } from '@superadmin/core';

import Navigation from './Navigation.vue';

const navigationRegistry = useService(NavigationRegistry);
const navigationGroups = [...navigationRegistry.getAll()].sort((a, b) => a.order - b.order);
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <Navigation
      v-for="group in navigationGroups"
      :key="group.id"
      :navigation="group"
    />
  </div>
</template>
