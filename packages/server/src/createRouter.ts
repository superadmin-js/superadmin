import modules from '@modules';
import type { Container } from '@nzyme/ioc';
import { createContainer } from '@nzyme/ioc';
import { createRouter as createRpcRouter, defaultSerializer } from '@nzyme/rpc';

import { installModules } from '@superadmin/runtime-common';

import { ExecuteAction } from './endpoints/ExecuteAction.js';

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
        endpoints: [ExecuteAction],
        serializer: defaultSerializer,
    });
}
