import { ModalService } from '@nzyme/vue';

import { defineActionHandler } from '@superadmin/core';
import { openConfirmDialog } from '@superadmin/core';

export const openConfirmationDialogHandler = defineActionHandler({
    action: openConfirmDialog,
    deps: {
        modalService: ModalService,
    },
    setup({ modalService }) {
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
