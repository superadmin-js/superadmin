import path from 'path';

import { unwrapCjsDefaultImport } from '@nzyme/esm';
import { Container, defineService } from '@nzyme/ioc';
import { resolveModulePath, resolveProjectPath } from '@nzyme/project-utils';
import { devServerMiddleware, normalizeBuiltinsPlugin } from '@nzyme/rollup-utils';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import autoprefixer from 'autoprefixer';
import chalk from 'chalk';
import consola from 'consola';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { joinURL } from 'ufo';
import { createServer } from 'vite';
import { checker } from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

import { ProjectConfig } from '@superadmin/config';

import { RuntimeBuilder } from './RuntimeBuilder.js';
import { getViteServerUrl } from './utils/getViteServerUrl.js';

/**
 *
 */
export const DevServer = defineService({
    name: 'DevServer',
    deps: {
        config: ProjectConfig,
        runtime: RuntimeBuilder,
        container: Container,
    },
    async setup({ config, runtime, container }) {
        const clientRoot = resolveProjectPath('@superadmin/runtime-client', import.meta);

        runtime.client.addFile('@superadmin/core/module', {
            id: '@superadmin/core',
            order: -1,
        });

        runtime.client.addFile('@superadmin/runtime-client/module', {
            id: '@superadmin/client',
            order: -1,
        });

        runtime.server.addFile('@superadmin/core/module', {
            id: '@superadmin/core',
            order: -1,
        });

        runtime.server.addFile('@superadmin/server/module', {
            id: '@superadmin/server',
            order: -1,
        });

        await runtime.start();

        const vite = await createViteServer();
        const api = createApiServer();

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

        for (const plugin of config.plugins) {
            plugin(container);
        }

        return {
            start,
        };

        async function start() {
            await vite.listen();
        }

        function createViteServer() {
            return createServer({
                configFile: false,
                plugins: [
                    vue(),
                    vueJsx(),
                    tsconfigPaths(),
                    checker({
                        root: config.cwd,
                        typescript: false,
                        vueTsc: true,
                    }),
                    tailwindcss(),
                    nodePolyfills({
                        globals: {
                            Buffer: true,
                        },
                    }),
                ],
                resolve: {
                    alias: {
                        '@config': runtime.client.configPath,
                        '@modules': runtime.client.modulesPath,
                        '@theme': config.theme,
                        '@logo': config.logo,
                    },
                },
                base: config.basePath,
                root: clientRoot,
                server: {
                    port: config.port,
                },
                css: {
                    postcss: {
                        plugins: [autoprefixer()],
                    },
                    preprocessorOptions: {
                        scss: {},
                    },
                },
            });
        }

        function createApiServer() {
            return devServerMiddleware({
                input: resolveModulePath('@superadmin/server/entry-dev', import.meta),
                output: {
                    format: 'esm',
                    dir: path.join(config.runtimePath, 'server'),
                    sourcemap: true,
                    entryFileNames: `[name].js`,
                    chunkFileNames: `[name].js`,
                    assetFileNames: chunkInfo => {
                        if (chunkInfo.name?.endsWith('.css')) {
                            return `[name].css`;
                        }

                        return `[name].[hash].[ext]`;
                    },
                },
                preserveSymlinks: true,
                plugins: [
                    normalizeBuiltinsPlugin(),
                    nodeResolve({
                        preferBuiltins: true,
                        extensions: ['.js', '.mjs', '.ts', '.tsx', '.json'],
                        exportConditions: ['node', 'module', 'import', 'require'],
                    }),
                    {
                        name: 'watch-files',
                        transform(_code, id) {
                            if (shouldWatch(id)) {
                                this.addWatchFile(id);
                            }
                        },
                    },
                    unwrapCjsDefaultImport(commonjs)(),
                    unwrapCjsDefaultImport(json)(),
                    unwrapCjsDefaultImport(typescript)(),
                    unwrapCjsDefaultImport(alias)({
                        entries: {
                            '@config': runtime.server.configPath,
                            '@modules': runtime.server.modulesPath,
                        },
                    }),
                    sourcemaps({
                        // Sentry has some broken sourcemaps
                        exclude: /@sentry/,
                    }),
                ],
                external: source => {
                    if (source.startsWith('./') || source.startsWith('../')) {
                        return false;
                    }

                    if (shouldWatch(source)) {
                        return false;
                    }

                    if (/^node:/.test(source) || /^[\w_-]+$/.test(source)) {
                        // Node built-in modules and third party modules
                        return true;
                    }

                    if (source.includes('/node_modules/')) {
                        return true;
                    }

                    return false;
                },
            });
        }

        function shouldWatch(source: string) {
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
        }
    },
});
