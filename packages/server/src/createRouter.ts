import modules from '@modules';
import { ApiRouter } from '@nzyme/api-server';
import type { Container } from '@nzyme/ioc';
import { createContainer } from '@nzyme/ioc';

import { installModules } from '@superadmin/runtime-common';

import { ActionEndpointHandler } from './endpoints/ActionEndpointHandler.js';

/**
 *
 */
export interface CreateRouterOptions {
    /**
     * The ioc container to use for the router.
     * If not provided, a new container will be created.
     */
    container?: Container;
}

/**
 *
 */
export function createRouter(options: CreateRouterOptions = {}) {
    const container = options.container ?? createContainer();
    installModules(container, modules);

    const router = container.resolve(ApiRouter);

    router.addEndpoint(ActionEndpointHandler);

    return router;
}
