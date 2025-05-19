import path from 'path';

import { defineService } from '@nzyme/ioc';
import { createPromise } from '@nzyme/utils';
import { watch } from 'chokidar';
import createDebug from 'debug';
import fastGlob from 'fast-glob';

import { ProjectConfig } from '@superadmin/config';
import type { RuntimeConfig } from '@superadmin/core';

import { generateRuntime } from '../runtime/generateModules.js';

/**
 *
 */
export const RuntimeBuilder = defineService({
    name: 'RuntimeBuilder',
    deps: {
        projectConfig: ProjectConfig,
    },
    setup({ projectConfig }) {
        const debug = createDebug('superadmin:runtime');
        const serverRegex = /\.(server|common)\.ts$/;
        const clientRegex = /\.(client|common)\.tsx?$/;
        const ignored = ['node_modules', '.superadmin'];

        const clientDir = path.join(projectConfig.runtimePath, 'client');
        const serverDir = path.join(projectConfig.runtimePath, 'server');

        const runtimeConfig: RuntimeConfig = {
            basePath: projectConfig.basePath,
        };

        const client = generateRuntime({
            outputDir: clientDir,
            rootDir: projectConfig.cwd,
            runtimeConfig,
            tsConfig: {
                extends: '@superadmin/tsconfig/vue.json',
                compilerOptions: {
                    moduleResolution: 'Bundler',
                    module: 'ESNext',
                },
                include: ['../../**/*.ts', '../../**/*.tsx', '../../**/*.vue', '../../**/*.json'],
            },
        });

        const server = generateRuntime({
            outputDir: serverDir,
            rootDir: projectConfig.cwd,
            runtimeConfig,
        });

        client.addFile('@superadmin/core/module', {
            id: '@superadmin/core',
            order: -1,
        });

        client.addFile('@superadmin/runtime-client/module', {
            id: '@superadmin/client',
            order: -1,
        });

        server.addFile('@superadmin/core/module', {
            id: '@superadmin/core',
            order: -1,
        });

        server.addFile('@superadmin/server/module', {
            id: '@superadmin/server',
            order: -1,
        });

        return {
            start,
            render,
            client,
            server,
        };

        async function start() {
            const promise = createPromise();

            const watcher = watch('.', {
                cwd: projectConfig.cwd,
                ignored,
            });

            watcher.on('add', onAddFile);
            watcher.on('unlink', onDeleteFile);
            watcher.on('ready', promise.resolve);

            await promise.promise;
            await Promise.all([client.watch(), server.watch()]);
        }

        /**
         * Renders the runtime once by discovering all relevant files and generating the runtime output without watching for changes.
         */
        async function render() {
            // Find all files matching the client and server regex patterns
            const patterns = ['**/*.ts', '**/*.tsx'];
            const files = await fastGlob(patterns, {
                cwd: projectConfig.cwd,
                ignore: ignored.map(pattern => `${pattern}/**`),
            });

            for (const file of files) {
                onAddFile(file);
            }

            await Promise.all([client.render(), server.render()]);
        }

        function onAddFile(file: string) {
            let added = false;
            const absolutePath = toAbsolute(file);

            if (clientRegex.test(absolutePath)) {
                client.addFile(absolutePath);
                added = true;
            }

            if (serverRegex.test(absolutePath)) {
                server.addFile(absolutePath);
                added = true;
            }

            if (added) {
                debug('Added module file: %s', file);
            }
        }

        function onDeleteFile(file: string) {
            const absolutePath = toAbsolute(file);
            const removed = client.removeFile(absolutePath) || server.removeFile(absolutePath);

            if (removed) {
                debug('Removed module file: %s', file);
            }
        }

        function toAbsolute(file: string) {
            return path.isAbsolute(file) ? file : path.join(projectConfig.cwd, file);
        }
    },
});
