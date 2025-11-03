import path from 'path';

import { defineService } from '@nzyme/ioc';
import { devServerMiddleware, isFileExternal, watchFilesPlugin } from '@nzyme/rollup-utils';
import chalk from 'chalk';
import type { RollupOptions } from 'rollup';
import { joinURL } from 'ufo';
import type { UserConfig as ViteConfig } from 'vite';
import { createServer, mergeConfig } from 'vite';

import { ProjectConfig } from '@superadmin/config';

import { getViteServerUrl } from '../utils/getViteServerUrl.js';
import { normalizePath } from '../utils/normalizePath.js';
import { ClientViteConfigProvider } from './ClientViteConfigProvider.js';
import { RuntimeBuilder } from './RuntimeBuilder.js';
import { ServerRollupConfigProvider } from './ServerRollupConfigProvider.js';

/**
 *
 */
export const DevServer = defineService({
    name: 'DevServer',
    deps: {
        config: ProjectConfig,
        runtime: RuntimeBuilder,
        clientViteConfigProvider: ClientViteConfigProvider,
        serverRollupConfigProvider: ServerRollupConfigProvider,
    },
    async setup({ config, runtime, clientViteConfigProvider, serverRollupConfigProvider }) {
        await runtime.start();

        const vite = await createVite();
        const { middleware } = createApiMiddleware();

        vite.middlewares.stack.unshift({
            route: joinURL(config.basePath, '/api'),
            handle: middleware,
        });

        vite.httpServer?.addListener('listening', () => {
            const serverUrl = getViteServerUrl(vite);
            if (!serverUrl) {
                return;
            }

            console.info(`Started ${chalk.yellow('Superadmin')} on ${chalk.cyan(serverUrl)}`);
        });

        return {
            start,
        };

        async function createVite() {
            const viteConfigBase = clientViteConfigProvider();
            const viteConfigOverrides: ViteConfig = {
                server: { port: config.port },
                build: {
                    sourcemap: true,
                },
            };

            const viteConfig: ViteConfig = mergeConfig(viteConfigBase, viteConfigOverrides);

            return await createServer(viteConfig);
        }

        function createApiMiddleware() {
            const rollupConfigBase = serverRollupConfigProvider();
            const rollupConfigOverrides: RollupOptions = {
                input: normalizePath(config.server.devEntry, config.cwd),
                output: {
                    format: 'esm',
                    dir: path.join(config.runtimePath, 'server'),
                    sourcemap: true,
                    entryFileNames: `[name].js`,
                    chunkFileNames: `[name].js`,
                    assetFileNames: `[name].[hash].[ext]`,
                },
                plugins: [watchFilesPlugin()],
                external: (source: string) => {
                    return isFileExternal(source);
                },
            };

            const rollupConfig: RollupOptions = mergeConfig(
                rollupConfigBase,
                rollupConfigOverrides,
            );
            const api = devServerMiddleware(rollupConfig);

            return api;
        }

        async function start() {
            await vite.listen();
        }
    },
});
