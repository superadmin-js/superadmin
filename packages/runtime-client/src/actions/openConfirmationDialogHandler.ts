import { ModalService } from '@nzyme/vue/modal/ModalService.js';

import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { openConfirmDialog } from '@superadmin/core/actions/openConfirmDialog.js';

export const openConfirmationDialogHandler = defineActionHandler({
    action: openConfirmDialog,
    deps: {
        modalService: ModalService,
    },
    setup({ modalService }) {
        return async params => {
            const { default: ConfirmationDialog } =
                await import('../components/ConfirmationDialog.vue');

            return await modalService.open(ConfirmationDialog, {
                params,
            });
        };
    },
});
