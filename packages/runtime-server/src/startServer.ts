import { toNodeListener } from 'h3';
import { listen } from 'listhen';

import { setupApp } from './setupApp.js';

export async function startServer(port: number) {
    const app = setupApp();

    const handler = toNodeListener(app);

    await listen(handler, {
        port,
        showURL: false,
    });
}
