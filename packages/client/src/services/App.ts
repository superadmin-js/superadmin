import type { App as VueApp } from 'vue';

import { defineInterface } from '@nzyme/ioc';

export type App = VueApp<HTMLElement>;
export const App = defineInterface<App>({ name: 'App' });
