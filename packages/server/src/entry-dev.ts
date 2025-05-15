import { devServerRuntime } from '@nzyme/rollup-utils';
import chalk from 'chalk';

import { createServer } from './createServer.js';

const runtime = devServerRuntime();
const server = createServer({
    port: runtime.port,
    afterRequest: (req, res) => {
        const method = `[${req.method?.toUpperCase() ?? 'GET'}]`;
        const status = `[${res.statusCode}]`;
        const color =
            res.statusCode >= 500 ? chalk.red : res.statusCode >= 400 ? chalk.yellow : chalk.green;

        console.log(`${chalk.green(method)} ${req.url} ${color(status)}`);
    },
});

await server.start();

runtime.start();
