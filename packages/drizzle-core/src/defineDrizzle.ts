import type { Service, Dependencies, ServiceSetup } from '@nzyme/ioc';
import { defineService } from '@nzyme/ioc';

import type { Submodule } from '@superadmin/core';
import { defineSubmodule } from '@superadmin/core';

import { DrizzleClient } from './DrizzleClient.js';

/**
 *
 */
export interface DrizzleOptions<TDrizzle extends DrizzleClient, TDeps extends Dependencies> {
    /**
     *
     */
    readonly name?: string;
    /**
     *
     */
    readonly deps?: TDeps;
    /**
     *
     */
    readonly setup: ServiceSetup<TDeps, TDrizzle>;
}

/**
 *
 */
export function defineDrizzle<TDrizzle extends DrizzleClient, TDeps extends Dependencies>(
    options: DrizzleOptions<TDrizzle, TDeps>,
): Service<TDrizzle, TDeps> & Submodule {
    const service = defineService({
        name: options.name || 'DrizzleClient',
        implements: DrizzleClient,
        deps: options.deps,
        setup: options.setup,
    });

    return defineSubmodule({
        ...service,
        install(container) {
            container.set(DrizzleClient, service);
        },
    });
}
