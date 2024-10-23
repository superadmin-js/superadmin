import { createApp } from 'vue';

import type { InjectableOf } from '@nzyme/ioc';
import { defineService } from '@nzyme/ioc';

import AppComponent from './App.vue';

export type App = InjectableOf<typeof App>;

export const App = defineService({
    name: 'App',
    setup() {
        return createApp(AppComponent);
    },
});
