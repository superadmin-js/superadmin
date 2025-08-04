import path from 'path';

import { defineService } from '@nzyme/ioc';
import { rollupCompile } from '@nzyme/rollup-utils';
import type { RollupOptions } from '@nzyme/rollup-utils';
import chalk from 'chalk';
import type { InputOptions } from 'rollup';
import type { UserConfig as ViteConfig } from 'vite';
import { mergeConfig, build as viteBuild } from 'vite';

import { ProjectConfig } from '@superadmin/config';

import { normalizePath } from '../utils/normalizePath.js';
import { ClientViteConfigProvider } from './ClientViteConfigProvider.js';
import { RuntimeBuilder } from './RuntimeBuilder.js';
import { ServerRollupConfigProvider } from './ServerRollupConfigProvider.js';

/**
 * Service that builds the project for production (client and server).
 */
export const ProjectBuilder = defineService({
    name: 'ProjectBuilder',
    deps: {
        config: ProjectConfig,
        runtime: RuntimeBuilder,
        clientViteConfigProvider: ClientViteConfigProvider,
        serverRollupConfigProvider: ServerRollupConfigProvider,
    },
    setup({ config, runtime, clientViteConfigProvider, serverRollupConfigProvider }) {
        const outputDir = path.join(config.cwd, '.output');

        return { build };

        async function build() {
            await runtime.render();
            await buildClient();
            await buildServer();
        }

        async function buildClient() {
            const clientOutDir = path.join(outputDir, 'client');
            console.info(`Building ${chalk.yellow('SuperAdmin client')}...`);

            let assetsPath = config.client.assetsPath;
            if (assetsPath.startsWith('/')) {
                assetsPath = assetsPath.slice(1);
            }

            const viteConfigBase = clientViteConfigProvider();
            const viteConfigOverrides: ViteConfig = {
                build: {
                    outDir: clientOutDir,
                    emptyOutDir: true,
                    rollupOptions: {
                        output: {
                            entryFileNames: `${assetsPath}/[hash].js`,
                            chunkFileNames: `${assetsPath}/[hash].js`,
                            assetFileNames: `${assetsPath}/[hash].[ext]`,
                        },
                    },
                },
            };

            const viteConfig = mergeConfig(viteConfigBase, viteConfigOverrides);

            await viteBuild(viteConfig);

            console.info(`Client build complete! 🎉`);
            console.info(`Output: ${chalk.cyan(clientOutDir)}`);
        }

        async function buildServer() {
            const serverOutDir = path.join(outputDir, 'server');

            console.info(`Building ${chalk.yellow('SuperAdmin server')}...`);

            const rollupConfigBase = serverRollupConfigProvider();
            const rollupConfigOverrides: RollupOptions = {
                input: normalizePath(config.server.buildEntry),
                output: {
                    format: 'esm',
                    dir: serverOutDir,
                    sourcemap: true,
                    entryFileNames: `index.js`,
                    chunkFileNames: `[name].[hash].mjs`,
                    assetFileNames: `[name].[hash].[ext]`,
                },
            };

            const rollupConfig = mergeRollupConfig(
                rollupConfigBase,
                config.server.rollupOptions,
                rollupConfigOverrides,
            );

            await rollupCompile(rollupConfig);

            console.info(`Server build complete! 🎉`);
            console.info(`Output: ${chalk.cyan(serverOutDir)}`);
        }

        function mergeRollupConfig(...configs: (InputOptions | RollupOptions)[]) {
            return configs.reduce(
                (acc, config) => mergeConfig(acc, config) as RollupOptions,
                {} as RollupOptions,
            ) as RollupOptions;
        }
    },
});
