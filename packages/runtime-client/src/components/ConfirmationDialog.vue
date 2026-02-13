<script lang="ts" setup>
import { skipUndefinedProps } from '@nzyme/utils/removeUndefinedProps.js';
import { useModalProps } from '@nzyme/vue/modal/useModalProps.js';
import Dialog from 'primevue/dialog';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { noAction } from '@superadmin/core/actions/noAction.js';
import type { openConfirmDialog } from '@superadmin/core/actions/openConfirmDialog.js';
import type * as s from '@superadmin/schema';
import { default as ActionButtonUI } from '@superadmin/ui/ActionButton.vue';

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
    :modal="true"
    :header="title"
    :style="{ width: '25rem' }"
  >
    {{ params.message }}

    <template #footer>
      <ActionButtonUI
        :button="no"
        class="flex-1"
        early-exit
        @action="modal.close()"
      />
      <ActionButtonUI
        :button="yes"
        class="flex-1"
        early-exit
        @action="modal.done()"
      />
    </template>
  </Dialog>
</template>
