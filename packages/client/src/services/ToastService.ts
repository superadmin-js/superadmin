import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { ToastServiceMethods } from 'primevue/toastservice';

/** PrimeVue toast service methods for showing notifications. */
export type ToastService = ToastServiceMethods;
/** IoC interface for the PrimeVue toast service. */
export const ToastService = defineInterface<ToastService>({
    name: 'ToastService',
});
