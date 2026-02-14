import config from '@config';
import modules from '@modules';
import { createContainer } from '@nzyme/vue-ioc/createContainer.js';
import { IocPlugin } from '@nzyme/vue-ioc/IocPlugin.js';
import { CommonPlugin } from '@nzyme/vue/CommonPlugin.js';
import theme from '@theme';
import type { PrimeVueConfiguration } from 'primevue/config';
import PrimeVue from 'primevue/config';
import PrimeVueToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import type { Plugin } from 'vue';

import { RuntimeConfig } from '@superadmin/client/RuntimeConfig.js';
import { App } from '@superadmin/client/services/App.js';
import { Router } from '@superadmin/client/services/Router.js';
import { ToastService } from '@superadmin/client/services/ToastService.js';
import { installModules } from '@superadmin/runtime-common/installModules.js';

import AppComponent from './App.vue';
import { setupRouter } from './setupRouter.js';

import '@tailwind';

import './index.css';

const container = createContainer();

container.set(RuntimeConfig, config);

installModules(container, modules);

const app = createApp(AppComponent);
const router = setupRouter(container);

container.set(App, app);
container.set(Router, router);

app.use(router);
app.use(CommonPlugin);
app.use(IocPlugin, { container });

const primeVueConfig: PrimeVueConfiguration = {
    theme: {
        preset: theme,
    },
};

app.use(PrimeVue as unknown as Plugin, primeVueConfig);
app.use(PrimeVueToastService as unknown as Plugin);

container.set(ToastService, app.config.globalProperties.$toast);

app.mount('#root');
