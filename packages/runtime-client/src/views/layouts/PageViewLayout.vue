<script lang="ts" setup>
import { injectContext } from '@nzyme/vue-utils';
import { ViewContext, type ViewLayoutSlots } from '@superadmin/client';
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
