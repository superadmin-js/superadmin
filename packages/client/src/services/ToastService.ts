import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { ToastServiceMethods } from 'primevue/toastservice';

/**
 *
 */
export type ToastService = ToastServiceMethods;
/**
 *
 */
export const ToastService = defineInterface<ToastService>({
    name: 'ToastService',
});
