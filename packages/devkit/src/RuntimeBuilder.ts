import path from 'path';

import { defineService } from '@nzyme/ioc';
import { createPromise } from '@nzyme/utils';
import { watch } from 'chokidar';
import createDebug from 'debug';

import { ProjectConfig } from '@superadmin/config';
import type { RuntimeConfig } from '@superadmin/core';

import { createModulesRuntime } from './utils/createRuntime.js';

/**
 *
 */
export const RuntimeBuilder = defineService({
    name: 'RuntimeBuilder',
    deps: {
        projectConfig: ProjectConfig,
    },
    setup({ projectConfig }) {
        const runtimeConfig: RuntimeConfig = {
            basePath: projectConfig.basePath,
        };

        const debug = createDebug('superadmin:runtime');
        const serverRegex = /\.(server|common)\.ts$/;
        const clientRegex = /\.(client|common)\.tsx?$/;

        const client = createModulesRuntime({
            outputDir: path.join(projectConfig.runtimePath, 'client'),
            rootDir: projectConfig.cwd,
            config: runtimeConfig,
        });

        const server = createModulesRuntime({
            outputDir: path.join(projectConfig.runtimePath, 'server'),
            rootDir: projectConfig.cwd,
            config: runtimeConfig,
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
