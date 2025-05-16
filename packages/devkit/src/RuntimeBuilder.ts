import path from 'path';

import { defineService } from '@nzyme/ioc';
import { createPromise } from '@nzyme/utils';
import { watch } from 'chokidar';
import createDebug from 'debug';

import { ProjectConfig } from '@superadmin/config';
import type { RuntimeConfig } from '@superadmin/core';

import { generateRuntime } from './runtime/generateModules.js';

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

        return {
            start,
            client,
            server,
        };

        async function start() {
            const promise = createPromise();

            const watcher = watch('.', {
                cwd: projectConfig.cwd,
                ignored: ['node_modules', '.superadmin'],
            });

            watcher.on('add', onAddFile);
            watcher.on('unlink', onDeleteFile);
            watcher.on('ready', promise.resolve);

            await promise.promise;

            await Promise.all([client.start(), server.start()]);
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
