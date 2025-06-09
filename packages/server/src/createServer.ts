import type { CreateMiddlewareOptions } from '@nzyme/rpc';
import { createMiddleware } from '@nzyme/rpc';
import type { OmitProps } from '@nzyme/types';
import connect from 'connect';

import { createRouter } from './createRouter.js';

/**
 * Options for the {@link createServer} function.
 */
export interface CreateServerOptions extends OmitProps<CreateMiddlewareOptions, 'router'> {
    /**
     * The path to start the server on.
     * @default '/{basePath}/api'
     */
    path?: string;

    /**
     * The port to start the server on.
     */
    port: number;
}

/**
 * Creates a SuperAdmin api server.
 */
export function createServer(options: CreateServerOptions) {
    const router = createRouter();
    const middleware = createMiddleware({
        ...options,
        router,
    });

    const app = connect();
    if (options.path) {
        app.use(options.path, middleware);
    } else {
        app.use(middleware);
    }

    return {
        app,
        start() {
            return new Promise(resolve => {
                app.listen(options.port, resolve);
            });
        },
    };
}
