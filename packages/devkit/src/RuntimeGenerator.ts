import path from 'path';

import { watch } from 'chokidar';
import createDebug from 'debug';

import { defineService } from '@nzyme/ioc';
import { createPromise } from '@nzyme/utils';
import type { RuntimeConfig } from '@superadmin/core';
import { ProjectConfig } from '@superadmin/core';

import { createModulesRuntime } from './utils/createRuntime.js';

export const RuntimeGenerator = defineService({
    name: 'RuntimeGenerator',
    setup({ inject }) {
        const projectConfig = inject(ProjectConfig);
        const runtimeConfig: RuntimeConfig = {
            basePath: projectConfig.basePath,
        };

        const debug = createDebug('superadmin:runtime');

        const client = createModulesRuntime({
            moduleRegex: /\.(client|module)\.tsx?$/,
            outputDir: path.join(projectConfig.runtimePath, 'client'),
            config: runtimeConfig,
        });

        const server = createModulesRuntime({
            moduleRegex: /\.(server|module)\.ts$/,
            outputDir: path.join(projectConfig.runtimePath, 'server'),
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

        function onAddFile(path: string) {
            let added = false;

            added = client.addFile(path) || added;
            added = server.addFile(path) || added;

            if (added) {
                debug('Added module file: %s', path);
            }
        }

        function onDeleteFile(path: string) {
            const removed = client.removeFile(path) || server.removeFile(path);

            if (removed) {
                debug('Removed module file: %s', path);
            }
        }
    },
});
