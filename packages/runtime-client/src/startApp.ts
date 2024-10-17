import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Aura from '@primevue/themes/aura';

import { CommonPlugin, VueContainer } from '@nzyme/vue';

import AdminApp from './App.vue';

import './index.scss';
import { isModule } from '@superadmin/core';

export interface StartAppOptions {
    modules: unknown[];
}

export function startApp(options: StartAppOptions) {
    const container = new VueContainer();

    const app = createApp(AdminApp);
    const router = createRouter({
        routes: [],
        history: createWebHistory(),
    });

    app.use(router);
    app.use(CommonPlugin, { container });
    app.use(PrimeVue.default, {
        theme: {
            preset: Aura,
        },
    });

    app.use(ToastService.default);

    for (const module of options.modules) {
        if (isModule(module)) {
            module(container);
        }
    }

    app.mount('#root');
}
