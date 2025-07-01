import { defineService } from '@nzyme/ioc';
import { resolveProjectPath } from '@nzyme/project-utils';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import autoprefixer from 'autoprefixer';
import type { InlineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

import { ProjectConfig } from '@superadmin/config';

import { RuntimeBuilder } from './RuntimeBuilder.js';

/**
 * Service that provides the base Vite config for the Superadmin client build.
 */
export const ClientViteConfigProvider = defineService({
    name: 'ClientViteConfigProvider',
    deps: {
        config: ProjectConfig,
        runtime: RuntimeBuilder,
    },
    setup({ config, runtime }) {
        /**
         * Returns the base Vite config for the client (no port, no build outDir).
         */
        return (): InlineConfig => {
            return {
                configFile: false,
                plugins: [
                    vue(),
                    vueJsx(),
                    tsconfigPaths(),
                    checker({
                        root: config.cwd,
                        typescript: false,
                        vueTsc: {
                            tsconfigPath: runtime.client.tsConfigPath,
                        },
                    }),
                    tailwindcss(),
                    nodePolyfills({
                        globals: { Buffer: true },
                    }),
                ],
                logLevel: 'warn',
                resolve: {
                    alias: {
                        '@config': runtime.client.configPath,
                        '@modules': runtime.client.modulesPath,
                        '@theme': config.theme,
                        '@logo': config.logo,
                    },
                },
                base: config.basePath,
                clearScreen: false,
                root: resolveProjectPath('@superadmin/runtime-client', import.meta),
                css: {
                    postcss: {
                        plugins: [autoprefixer()],
                    },
                    preprocessorOptions: {
                        scss: {},
                    },
                },
            };
        };
    },
});
