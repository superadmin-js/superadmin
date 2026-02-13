import type { ToastServiceMethods } from 'primevue/toastservice';

import { defineInterface } from '@nzyme/ioc/Interface.js';

export type ToastService = ToastServiceMethods;
export const ToastService = defineInterface<ToastService>({
    name: 'ToastService',
});
