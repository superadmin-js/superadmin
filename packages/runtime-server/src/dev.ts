import { devServerRuntime } from '@nzyme/rollup-utils';

const runtime = devServerRuntime();

await import('./startServer.js').then(m => m.startServer(runtime.port));

runtime.start();
