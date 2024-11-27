import modules from '@modules';
import { createApp, createRouter } from 'h3';

import { createContainer } from '@nzyme/ioc';
import { installModules } from '@superadmin/runtime-common';
import { App, Router } from '@superadmin/server';

import { setupActionHandler } from './setupActionHandler.js';

const DEBUG = true;

export function setupApp() {
    const container = createContainer();

    const app = createApp({ debug: DEBUG });
    const router = createRouter();

    container.set(App, app);
    container.set(Router, router);

    installModules(container, modules);
    setupActionHandler(container);

    app.use(router);

    return app;
}
