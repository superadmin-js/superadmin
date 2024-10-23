import type { PrimeVueConfiguration } from 'primevue/config';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import type { Plugin } from 'vue';

import { CommonPlugin, VueContainer } from '@nzyme/vue';
import type { Module } from '@superadmin/core';
import { Modules, isModule } from '@superadmin/core';

import { App } from './App.js';
import { Router } from './Router.js';
import * as defaultModules from './modules.js';

export interface StartAppOptions {
    modules: unknown[];
    theme: unknown;
}

export function startApp(options: StartAppOptions) {
    const container = new VueContainer();
    const modules: Module[] = [...Object.values(defaultModules)];

    for (const module of options.modules) {
        if (isModule(module)) {
            modules.push(module);
        }
    }

    container.set(Modules, modules);

    const app = container.resolve(App);
    const router = container.resolve(Router);

    app.use(router);
    app.use(CommonPlugin, { container });

    const primeVueConfig: PrimeVueConfiguration = {
        theme: {
            preset: options.theme,
        },
    };

    app.use(PrimeVue as unknown as Plugin, primeVueConfig);
    app.use(ToastService as unknown as Plugin);

    for (const module of modules) {
        module.install(container);
    }

    app.mount('#root');
}
