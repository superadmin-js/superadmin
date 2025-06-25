import { defineInterface } from '@nzyme/ioc';
import type { App as VueApp } from 'vue';

/**
 *
 */
export type App = VueApp<HTMLElement>;
/**
 *
 */
export const App = defineInterface<App>({ name: 'App' });
