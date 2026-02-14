<script lang="ts" setup>
import { injectContext } from '@nzyme/vue-utils/context.js';
import { ModalContext } from '@nzyme/vue/modal/ModalContext.js';
import Dialog from 'primevue/dialog';

import { ViewContext } from '@superadmin/client/views/ViewContext.js';
import type { ViewLayoutSlots } from '@superadmin/client/views/ViewLayout.js';

defineSlots<ViewLayoutSlots>();
const view = injectContext(ViewContext);
const modal = injectContext(ModalContext);
</script>

<template>
  <Dialog
    v-model:visible="modal.open"
    :modal="true"
    :header="view.title"
    :style="{ width: '25rem' }"
    dismissable-mask
  >
    <slot name="body" />

    <template #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>
