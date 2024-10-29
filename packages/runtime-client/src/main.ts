import config from '@config';
import modulesImport from '@modules';
import theme from '@theme';
import type { PrimeVueConfiguration } from 'primevue/config';
import PrimeVue from 'primevue/config';
import PrimeVueToastService from 'primevue/toastservice';
import { type Plugin, createApp } from 'vue';

import { CommonPlugin, VueContainer } from '@nzyme/vue';
import { App, Router, ToastService } from '@superadmin/client';
import type { Module } from '@superadmin/core';
import { Modules, RuntimeConfig, isModule } from '@superadmin/core';

import AppComponent from './App.vue';
import * as defaultModules from './modules.js';
import { setupRouter } from './setupRouter.js';

const container = new VueContainer();
const modules: Module[] = [];

for (const module of Object.values(defaultModules)) {
    if (isModule(module)) {
        modules.push(module);
    }
}

for (const module of modulesImport) {
    if (isModule(module)) {
        modules.push(module);
    }
}

container.set(Modules, modules);
container.set(RuntimeConfig, config);

const app = createApp(AppComponent);
const router = setupRouter(modules);

container.set(App, app);
container.set(Router, router);

app.use(router);
app.use(CommonPlugin, { container });

const primeVueConfig: PrimeVueConfiguration = {
    theme: {
        preset: theme,
    },
};

app.use(PrimeVue as unknown as Plugin, primeVueConfig);

app.use(PrimeVueToastService as unknown as Plugin);
container.set(ToastService, app.config.globalProperties.$toast);

for (const module of modules) {
    module.install(container);
}

app.mount('#root');
