import type { App as H3App } from 'h3';

import { defineInterface } from '@nzyme/ioc';

export type App = H3App;
export const App = defineInterface<App>({
    name: 'App',
});
