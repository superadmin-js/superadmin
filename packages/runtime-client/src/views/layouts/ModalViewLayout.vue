<script lang="ts" setup>
import Dialog from 'primevue/dialog';

import { ModalContext, useModalProps } from '@nzyme/vue';
import { injectContext } from '@nzyme/vue-utils';
import { ViewContext, type ViewLayoutSlots } from '@superadmin/client';

defineProps({
    ...useModalProps(),
});
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
