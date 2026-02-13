<script lang="ts" setup>
import { useModalProps } from '@nzyme/vue/modal/useModalProps.js';
import Dialog from 'primevue/dialog';
import type { PropType } from 'vue';

import type { openDialog } from '@superadmin/core/actions/openDialog.js';
import type * as s from '@superadmin/schema';
import { ActionButton } from '@superadmin/ui';

defineProps({
  ...useModalProps(),
  params: {
    type: Object as PropType<s.Infer<typeof openDialog.params>>,
    required: true,
  },
});
</script>

<template>
  <Dialog
    v-model:visible="modal.open"
    :modal="true"
    :header="params.title"
    :style="{ width: '25rem' }"
  >
    <div class="whitespace-pre-wrap">{{ params.message }}</div>
    <template #footer>
      <ActionButton
        v-for="(button, index) in params.buttons"
        :key="index"
        :button="button"
        class="flex-1"
        early-exit
        @action="modal.close"
      />
    </template>
  </Dialog>
</template>
