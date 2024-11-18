import path from 'path';

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import autoprefixer from 'autoprefixer';
import chalk from 'chalk';
import consola from 'consola';
import sourcemaps from 'rollup-plugin-sourcemaps';
import tailwindcss from 'tailwindcss';
import { createServer } from 'vite';
import { checker } from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

import { unwrapCjsDefaultImport } from '@nzyme/esm';
import { defineService } from '@nzyme/ioc';
import { resolveModulePath, resolveProjectPath } from '@nzyme/project-utils';
import { devServerMiddleware } from '@nzyme/rollup-utils';
import { ProjectConfig } from '@superadmin/core';

import { RuntimeBuilder } from './RuntimeBuilder.js';
import { getViteServerUrl } from './utils/getViteServerUrl.js';

export const DevServer = defineService({
    name: 'DevServer',
    async setup({ inject, container }) {
        const config = inject(ProjectConfig);
        const runtime = inject(RuntimeBuilder);

        const vite = await createViteServer();
        const api = createApiServer();

        vite.middlewares.stack.unshift({
            route: '/api',
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
            plugin.install(container);
        }

        return {
            start,
        };

        async function start() {
            await runtime.start();
            await vite.listen();
        }

        function createViteServer() {
            const clientRoot = resolveProjectPath('@superadmin/runtime-client', import.meta);
            const uiRoot = resolveProjectPath('@superadmin/ui', import.meta);

            return createServer({
                configFile: false,
                plugins: [
                    vue(),
                    vueJsx(),
                    tsconfigPaths(),
                    checker({
                        root: config.cwd,
                        typescript: true,
                        vueTsc: true,
                    }),
                    unwrapCjsDefaultImport(alias)({
                        entries: {
                            '@config': runtime.client.configPath,
                            '@modules': runtime.client.modulesPath,
                            '@theme': config.theme,
                            '@logo': config.logo,
                        },
                    }),
                ],
                root: clientRoot,
                server: {
                    port: config.port,
                },
                css: {
                    postcss: {
                        plugins: [
                            tailwindcss({
                                content: [
                                    './**/*.vue',
                                    './**/*.tsx',
                                    `${clientRoot}/**/*.html`,
                                    `${clientRoot}/src/**/*.vue`,
                                    `${clientRoot}/src/**/*.tsx`,
                                    `${uiRoot}/**/*.vue`,
                                    `${uiRoot}/**/*.tsx`,
                                ],
                            }),
                            autoprefixer(),
                        ],
                    },
                    preprocessorOptions: {
                        scss: {
                            //    additionalData: `@import 'primeflex/primeflex.scss';`,
                        },
                    },
                },
            });
        }

        function createApiServer() {
            return devServerMiddleware({
                input: resolveModulePath('@superadmin/runtime-server/dev', import.meta),
                output: {
                    format: 'esm',
                    dir: path.join(config.runtimePath, 'server'),
                    sourcemap: true,
                },
                plugins: [
                    nodeResolve({
                        preferBuiltins: true,
                        extensions: ['.js', '.mjs', '.ts', '.tsx', '.json'],
                        exportConditions: ['node', 'module', 'import', 'require'],
                    }),
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
                    if (/^node:/.test(source) || /^[\w_-]+$/.test(source)) {
                        // Node built-in modules and third party modules
                        return true;
                    }

                    if (/node_modules/.test(source)) {
                        return true;
                    }

                    return false;
                },
            });
        }
    },
});
