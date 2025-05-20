import path from 'path';

import { defineService } from '@nzyme/ioc';
import { resolveModulePath } from '@nzyme/project-utils';
import { devServerMiddleware } from '@nzyme/rollup-utils';
import chalk from 'chalk';
import consola from 'consola';
import type { RollupOptions, Plugin as RollupPlugin } from 'rollup';
import { joinURL } from 'ufo';
import type { UserConfig as ViteConfig } from 'vite';
import { createServer, mergeConfig } from 'vite';

import { ProjectConfig } from '@superadmin/config';

import { getViteServerUrl } from '../utils/getViteServerUrl.js';
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
        const api = createApiMiddleware();

        vite.middlewares.stack.unshift({
            route: joinURL(config.basePath, '/api'),
            handle: api,
        });

        vite.httpServer?.addListener('listening', () => {
            const serverUrl = getViteServerUrl(vite);
            if (!serverUrl) {
                return;
            }

            consola.success(`Started ${chalk.yellow('Superadmin')} on ${chalk.cyan(serverUrl)}`);
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
            const shouldWatch = (source: string): boolean => {
                for (const watch of config.watch) {
                    if (typeof watch === 'string') {
                        if (watch === source) {
                            return true;
                        }
                    } else {
                        if (watch.test(source)) {
                            return true;
                        }
                    }
                }

                return false;
            };

            const watchFilesPlugin: RollupPlugin = {
                name: 'watch-files',
                transform(_code, id) {
                    if (shouldWatch(id)) {
                        this.addWatchFile(id);
                    }
                },
            };

            const rollupConfigBase = serverRollupConfigProvider();
            const rollupConfigOverrides: RollupOptions = {
                input: resolveModulePath('@superadmin/server/entry-dev', import.meta),
                output: {
                    format: 'esm',
                    dir: path.join(config.runtimePath, 'server'),
                    sourcemap: true,
                    entryFileNames: `[name].js`,
                    chunkFileNames: `[name].js`,
                    assetFileNames: `[name].[hash].[ext]`,
                },
                plugins: [watchFilesPlugin],
                external: (source: string) => {
                    if (source.startsWith('./') || source.startsWith('../')) {
                        return false;
                    }

                    if (shouldWatch(source)) {
                        return false;
                    }

                    if (/^node:/.test(source) || /^[\w_-]+$/.test(source)) {
                        return true;
                    }

                    if (source.includes('/node_modules/')) {
                        return true;
                    }

                    return false;
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
