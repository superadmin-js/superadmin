import type { ToastServiceMethods } from 'primevue/toastservice';

import { defineInterface } from '@nzyme/ioc';

export type ToastService = ToastServiceMethods;
export const ToastService = defineInterface<ToastService>({
    name: 'ToastService',
});
