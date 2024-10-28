import type { App as VueApp } from 'vue';

import { defineInjectable } from '@nzyme/ioc';

export type App = VueApp<HTMLElement>;
export const App = defineInjectable<App>({
    name: 'App',
});
