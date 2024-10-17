import { defineService } from '@nzyme/ioc';
import { DevServerClient } from './DevServerClient.js';
import chalk from 'chalk';
import consola from 'consola';
import { ViteDevServer } from 'vite';
import { RuntimeGenerator } from './RuntimeGenerator.js';

import { getViteServerUrl } from './utils/getViteServerUrl.js';

export const DevServer = defineService({
    name: 'DevServer',
    async setup({ inject }) {
        const runtimeGenerator = inject(RuntimeGenerator);
        const client = await inject(DevServerClient);

        client.httpServer?.addListener('listening', () => {
            const serverUrl = getViteServerUrl(client);
            if (!serverUrl) {
                return;
            }

            consola.success(`Started ${chalk.yellow('Superadmin')} on ${chalk.cyan(serverUrl)}`);
        });

        return {
            start,
        };

        async function start() {
            await runtimeGenerator.start();
            await client.listen();
        }
    },
});
