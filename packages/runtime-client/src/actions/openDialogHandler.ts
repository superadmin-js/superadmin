import { ModalService } from '@nzyme/vue/modal/ModalService.js';

import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { openDialog } from '@superadmin/core/actions/openDialog.js';

export const openDialogHandler = defineActionHandler({
    action: openDialog,
    deps: {
        modalService: ModalService,
    },
    setup({ modalService }) {
        return async params => {
            const { default: Dialog } = await import('../components/Dialog.vue');
            return await modalService.open(Dialog, { params });
        };
    },
});
