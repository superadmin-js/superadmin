import path from 'path';

import { defineService } from '@nzyme/ioc';
import { resolveModulePath } from '@nzyme/project-utils';
import { rollupCompile } from '@nzyme/rollup-utils';
import type { RollupOptions } from '@nzyme/rollup-utils';
import chalk from 'chalk';
import { consola } from 'consola';
import type { UserConfig as ViteConfig } from 'vite';
import { mergeConfig, build as viteBuild } from 'vite';

import { ProjectConfig } from '@superadmin/config';

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
            consola.info(`Building ${chalk.yellow('SuperAdmin client')}...`);

            let assetsPath = config.build.client?.assetsPath || 'assets';
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

            consola.success(`Client build complete!`);
            consola.info(`Output: ${chalk.cyan(clientOutDir)}`);
        }

        async function buildServer() {
            const serverOutDir = path.join(outputDir, 'server');

            consola.info(`Building ${chalk.yellow('SuperAdmin server')}...`);

            const rollupConfigBase = serverRollupConfigProvider();
            const rollupConfigOverrides: RollupOptions = {
                input:
                    config.build.server?.entry ||
                    resolveModulePath('@superadmin/server/entry', import.meta),
                output: {
                    format: 'esm',
                    dir: serverOutDir,
                    sourcemap: true,
                    entryFileNames: `index.js`,
                    chunkFileNames: `[hash].js`,
                    assetFileNames: `[hash].[ext]`,
                },
            };

            const rollupConfig = mergeConfig(
                rollupConfigBase,
                rollupConfigOverrides,
            ) as RollupOptions;

            await rollupCompile(rollupConfig);

            consola.success(`Server build complete!`);
            consola.info(`Output: ${chalk.cyan(serverOutDir)}`);
        }
    },
});
