import { ToastService, defineActionHandler } from '@superadmin/client';
import { showToast } from '@superadmin/core';

export const showToastHandler = defineActionHandler({
    action: showToast,
    setup: ({ inject }) => {
        const toastService = inject(ToastService);

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
