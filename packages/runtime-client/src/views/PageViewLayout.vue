<script lang="ts" setup>
import { injectContext } from '@nzyme/vue-utils/context.js';

import { ViewContext } from '@superadmin/client/views/ViewContext.js';
import type { ViewLayoutSlots } from '@superadmin/client/views/ViewLayout.js';
defineSlots<ViewLayoutSlots>();

const view = injectContext(ViewContext);
</script>

<template>
  <div class="flex h-full flex-col gap-6 p-6">
    <header class="flex items-center gap-6">
      <h1 class="text-3xl font-bold">{{ view.title }}</h1>
      <div class="ml-auto">
        <slot name="header" />
      </div>
    </header>
    <slot name="body" />
    <slot name="footer" />
  </div>
</template>
