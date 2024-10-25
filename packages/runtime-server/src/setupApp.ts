import { createApp, createError, createRouter, defineEventHandler } from 'h3';

import { Container } from '@nzyme/ioc';
import { assertValue } from '@nzyme/utils';
import type { Module } from '@superadmin/core';
import { ActionRegistry, Modules, isModule } from '@superadmin/core';
import { coerce, serialize, validateOrThrow } from '@superadmin/schema';
import { ValidationError } from '@superadmin/validation';

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

    const app = createApp({
        debug: DEBUG,
    });
    const router = createRouter();

    const actionRegistry = container.resolve(ActionRegistry);

    const actionHandler = defineEventHandler(async event => {
        try {
            const actionName = assertValue(event.context.params?.action);
            const handler = actionRegistry.resolveHandler(actionName);

            if (!handler) {
                return createError({
                    status: 404,
                    message: `Action handler for ${actionName} not found`,
                });
            }

            const action = handler.action;
            const paramsSchema = action.params;
            const params = coerce(paramsSchema, event.context.body);

            validateOrThrow(paramsSchema, params);

            const result = await container.resolve(handler.service)(params);

            return serialize(action.result, result);
        } catch (error) {
            if (error instanceof ValidationError) {
                return createError({
                    status: 400,
                    statusMessage: error.name,
                    message: error.message,
                    stack: error.stack,
                    data: error.errors,
                });
            }

            throw error;
        }
    });

    router.post('/action/:action', actionHandler);

    for (const module of modules) {
        module.install(container);
    }

    app.use(router);

    return app;
}
