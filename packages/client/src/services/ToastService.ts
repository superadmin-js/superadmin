import type { ToastServiceMethods } from 'primevue/toastservice';

import { defineInjectable } from '@nzyme/ioc';

export type ToastService = ToastServiceMethods;
export const ToastService = defineInjectable<ToastService>({
    name: 'ToastService',
});
