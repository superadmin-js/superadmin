import type { Dependencies, Service, ServiceSetup } from '@nzyme/ioc/Service.js';
import { defineService } from '@nzyme/ioc/Service.js';

import type { Submodule } from '@superadmin/core/defineSubmodule.js';
import { defineSubmodule } from '@superadmin/core/defineSubmodule.js';

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
