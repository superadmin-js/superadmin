import config from '@config';
import modules from '@modules';
import theme from '@theme';
import type { PrimeVueConfiguration } from 'primevue/config';
import PrimeVue from 'primevue/config';
import PrimeVueToastService from 'primevue/toastservice';
import { type Plugin, createApp } from 'vue';

import { CommonPlugin } from '@nzyme/vue';
import { createContainer } from '@nzyme/vue-ioc';
import { App, Router, ToastService } from '@superadmin/client';
import { RuntimeConfig } from '@superadmin/core';
import { installModules } from '@superadmin/runtime-common';

import AppComponent from './App.vue';
import { setupRouter } from './setupRouter.js';

const container = createContainer();

container.set(RuntimeConfig, config);

installModules(container, modules);

const app = createApp(AppComponent);
const router = setupRouter(container);

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

app.mount('#root');
