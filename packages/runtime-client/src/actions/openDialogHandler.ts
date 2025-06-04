import { ModalService } from '@nzyme/vue';

import { defineActionHandler } from '@superadmin/core';
import { openDialog } from '@superadmin/core';

export const openDialogHandler = defineActionHandler({
    action: openDialog,
    deps: {
        modalService: ModalService,
    },
    setup({ modalService }) {
        return async params => {
            const { default: Dialog } = await import('../components/Dialog.vue');
            return await modalService.open({
                modal: Dialog,
                props: { params },
            });
        };
    },
});
