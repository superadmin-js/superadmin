import modules from '@modules';
import { toNodeListener } from 'h3';
import { listen } from 'listhen';

import { devServerRuntime } from '@nzyme/rollup-utils';

import { setupApp } from './setupApp.js';

const app = setupApp({
    modules,
});

const handler = toNodeListener(app);
const runtime = devServerRuntime();

await listen(handler, {
    port: runtime.port,
});

runtime.start();
