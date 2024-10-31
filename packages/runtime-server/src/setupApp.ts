import { createApp, createRouter } from 'h3';

import { Container } from '@nzyme/ioc';
import type { Module } from '@superadmin/core';
import { Modules, isModule } from '@superadmin/core';
import { App, Router } from '@superadmin/server';

import { setupActionHandler } from './setupActionHandler.js';

export interface SetupAppOptions {
    modules: unknown[];
}

const DEBUG = true;

export function setupApp(options: SetupAppOptions) {
    const container = new Container();
    const modules: Module[] = [];

    for (const module of options.modules) {
        if (isModule(module)) {
            modules.push(module);
        }
    }

    container.set(Modules, modules);

    const app = createApp({ debug: DEBUG });
    const router = createRouter();

    container.set(App, app);
    container.set(Router, router);

    for (const module of modules) {
        module.install(container);
    }

    setupActionHandler(container);

    app.use(router);

    return app;
}
