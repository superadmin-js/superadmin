<script lang="ts" setup>
import { ModalContext } from '@nzyme/vue';
import { injectContext } from '@nzyme/vue-utils';
import Dialog from 'primevue/dialog';

import { ViewContext } from '@superadmin/client';
import type { ViewLayoutSlots } from '@superadmin/client';

defineSlots<ViewLayoutSlots>();
const view = injectContext(ViewContext);
const modal = injectContext(ModalContext);
</script>

<template>
  <Dialog
    v-model:visible="modal.open"
    modal
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
