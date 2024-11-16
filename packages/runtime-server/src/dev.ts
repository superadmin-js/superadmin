import sourceMapSupport from 'source-map-support';

import { devServerRuntime } from '@nzyme/rollup-utils';

sourceMapSupport.install();
const runtime = devServerRuntime();

await import('./startServer.js').then(m => m.startServer(runtime.port));

runtime.start();
