import { defineService } from '@nzyme/ioc';
import { resolveProjectPath } from '@nzyme/project-utils';
import { ProjectConfig } from '@superadmin/core';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createServer, Plugin } from 'vite';
import { checker } from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import alias from '@rollup/plugin-alias';

import { RuntimeGenerator } from './RuntimeGenerator.js';
import { unwrapCjsDefaultImport } from '@nzyme/esm';

export const DevServerClient = defineService({
    name: 'DevServerClient',
    setup({ inject }) {
        const config = inject(ProjectConfig);
        const runtime = inject(RuntimeGenerator);

        const root = resolveProjectPath('@superadmin/runtime-client', import.meta);

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
                        '@runtime': runtime.clientRuntimePath,
                    },
                }),
            ],
            root,
            server: {
                port: config.port,
            },
            css: {
                preprocessorOptions: {
                    scss: {
                        //    additionalData: `@import 'primeflex/primeflex.scss';`,
                    },
                },
            },
        });
    },
});
