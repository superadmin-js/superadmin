import { ToastService } from '@superadmin/client/services/ToastService.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import { showToast } from '@superadmin/core/actions/showToast.js';

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
