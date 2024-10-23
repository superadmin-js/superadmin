import type { PrimeVueConfiguration } from 'primevue/config';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import type { Plugin } from 'vue';

import { CommonPlugin, VueContainer } from '@nzyme/vue';
import { ViewRegistry, isModule } from '@superadmin/core';

import { App } from './App.js';
import { Router } from './Router.js';
import ViewRenderer from './components/ViewRenderer.vue';
import * as defaultModules from './modules.js';

import './index.scss';

export interface StartAppOptions {
    modules: unknown[];
    theme: unknown;
}

export async function startApp(options: StartAppOptions) {
    const container = new VueContainer();

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

    for (const module of Object.values(defaultModules)) {
        if (isModule(module)) {
            await module.install(container);
        }
    }

    for (const module of options.modules) {
        if (isModule(module)) {
            await module.install(container);
        }
    }

    for (const view of container.resolve(ViewRegistry).getAll()) {
        if (!view.path) {
            continue;
        }

        router.addRoute({
            path: view.path,
            component: ViewRenderer,
            props: {
                view: view.name,
            },
        });
    }

    app.mount('#root');
}
