import modules from '@modules';
import type { Container } from '@nzyme/ioc/Container.js';
import { createContainer } from '@nzyme/ioc/Container.js';
import { createRouter as createRpcRouter } from '@nzyme/rpc/createRouter.js';

import { installModules } from '@superadmin/runtime-common/installModules.js';

import { ExecuteActionEndpointHandler } from './endpoints/ExecuteActionEndpointHandler.js';

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

    return createRpcRouter({
        container,
        handlers: [ExecuteActionEndpointHandler],
    });
}
