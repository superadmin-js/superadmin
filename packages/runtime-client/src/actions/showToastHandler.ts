import { ToastService } from '@superadmin/client';
import { defineActionHandler, showToast } from '@superadmin/core';

export const showToastHandler = defineActionHandler({
    action: showToast,
    deps: {
        toastService: ToastService,
    },
    setup({ toastService }) {
        return params => {
            toastService.add({
                summary: params.title ?? undefined,
                detail: params.message,
                life: params.time ?? undefined,
                severity: params.type ?? undefined,
            });
        };
    },
});
