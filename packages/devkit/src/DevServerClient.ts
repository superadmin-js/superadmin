import alias from '@rollup/plugin-alias';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { createServer } from 'vite';
import { checker } from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

import { unwrapCjsDefaultImport } from '@nzyme/esm';
import { defineService } from '@nzyme/ioc';
import { resolveProjectPath } from '@nzyme/project-utils';
import { ProjectConfig } from '@superadmin/core';

import { RuntimeGenerator } from './RuntimeGenerator.js';

export const DevServerClient = defineService({
    name: 'DevServerClient',
    setup({ inject }) {
        const config = inject(ProjectConfig);
        const runtime = inject(RuntimeGenerator);

        const runtimeRoot = resolveProjectPath('@superadmin/runtime-client', import.meta);

        return createServer({
            configFile: false,
            plugins: [
                vue(),
                vueJsx(),
                tsconfigPaths(),
                checker({
                    root: config.rootPath,
                    typescript: true,
                    vueTsc: true,
                }),
                unwrapCjsDefaultImport(alias)({
                    entries: {
                        '@modules': runtime.clientModulesPath,
                        '@theme': config.theme,
                    },
                }),
            ],
            root: runtimeRoot,
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
                                `${runtimeRoot}/src/**/*.vue`,
                                `${runtimeRoot}/src/**/*.tsx`,
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
    },
});
