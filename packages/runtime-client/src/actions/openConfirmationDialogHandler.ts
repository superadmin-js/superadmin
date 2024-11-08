import { ModalService } from '@nzyme/vue';
import { defineActionHandler } from '@superadmin/client';
import { openConfirmDialog } from '@superadmin/core';

export const openConfirmationDialogHandler = defineActionHandler({
    action: openConfirmDialog,
    setup: ({ inject }) => {
        const modalService = inject(ModalService);

        return async params => {
            const { default: ConfirmationDialog } = await import(
                '../components/ConfirmationDialog.vue'
            );

            return await modalService.open({
                modal: ConfirmationDialog,
                props: {
                    params,
                },
            });
        };
    },
});
