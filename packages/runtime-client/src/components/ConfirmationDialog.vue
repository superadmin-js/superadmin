<script lang="ts" setup>
import Dialog from 'primevue/dialog';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { skipUndefinedProps } from '@nzyme/utils';
import { useModalProps } from '@nzyme/vue';
import { type ActionButton, noAction, type openConfirmDialog } from '@superadmin/core';
import type * as s from '@superadmin/schema';
import { ActionButton as ActionButtonUI } from '@superadmin/ui';

const props = defineProps({
    ...useModalProps(),
    params: {
        type: Object as PropType<s.SchemaValue<typeof openConfirmDialog.params>>,
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
                @action="modal.close"
            />
            <ActionButtonUI
                :button="yes"
                class="flex-1"
                @action="modal.done"
            />
        </template>
    </Dialog>
</template>
