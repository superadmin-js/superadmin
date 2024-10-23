import { createApp, createRouter, defineEventHandler } from 'h3';

import { Container } from '@nzyme/ioc';
import { assertValue } from '@nzyme/utils';
import type { Module } from '@superadmin/core';
import { Modules, isModule } from '@superadmin/core';

export interface SetupAppOptions {
    modules: unknown[];
}

export function setupApp(options: SetupAppOptions) {
    const container = new Container();
    const modules: Module[] = [];

    for (const module of options.modules) {
        if (isModule(module)) {
            modules.push(module);
        }
    }

    container.set(Modules, modules);

    const app = createApp();
    const router = createRouter();

    const actionHandler = defineEventHandler(event => {
        const action = assertValue(event.context.params?.action);

        return {
            message: `Hello ${action}!`,
        };
    });

    router.post('/action/:action', actionHandler);

    for (const module of modules) {
        module.install(container);
    }

    app.use(router);

    return app;
}
