import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { App as VueApp } from 'vue';

/** The root Vue application instance. */
export type App = VueApp<HTMLElement>;
/** IoC interface for the root Vue application instance. */
export const App = defineInterface<App>({ name: 'App' });
