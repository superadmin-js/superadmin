<script lang="ts" setup>
import { skipUndefinedProps } from '@nzyme/utils';
import { useModalProps } from '@nzyme/vue';
import Dialog from 'primevue/dialog';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { noAction } from '@superadmin/core';
import type { ActionButton, openConfirmDialog } from '@superadmin/core';
import type * as s from '@superadmin/schema';
import { ActionButton as ActionButtonUI } from '@superadmin/ui';

const props = defineProps({
  ...useModalProps(),
  params: {
    type: Object as PropType<s.Infer<typeof openConfirmDialog.params>>,
    required: true,
  },
});

const title = computed(() => props.params.title ?? 'Confirmation needed');

const no = computed<ActionButton>(() => ({
  label: 'No',
  color: 'secondary',
  action: noAction(),
  ...skipUndefinedProps(props.params.no ?? {}),
}));

const yes = computed<ActionButton>(() => ({
  label: 'Yes',
  color: 'primary',
  ...skipUndefinedProps(props.params.yes ?? {}),
}));
</script>

<template>
  <Dialog
    v-model:visible="modal.open"
    modal
    :header="title"
    :style="{ width: '25rem' }"
  >
    {{ params.message }}

    <template #footer>
      <ActionButtonUI
        :button="no"
        class="flex-1"
        early-exit
        @action="modal.close"
      />
      <ActionButtonUI
        :button="yes"
        class="flex-1"
        early-exit
        @action="modal.done"
      />
    </template>
  </Dialog>
</template>
