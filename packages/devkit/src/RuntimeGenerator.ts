import { defineService } from '@nzyme/ioc';
import { ProjectConfig } from '@superadmin/core';
import { watch } from 'chokidar';
import { createRuntime } from './utils/createRuntime.js';
import path from 'path';
import { createPromise } from '@nzyme/utils';

import createDebug from 'debug';

export const RuntimeGenerator = defineService({
    name: 'RuntimeGenerator',
    setup({ inject }) {
        const config = inject(ProjectConfig);
        const debug = createDebug('superadmin:runtime');

        const clientRuntimePath = path.join(config.runtimePath, 'client.ts');
        const serverRuntimePath = path.join(config.runtimePath, 'server.ts');

        const clientRuntime = createRuntime({
            moduleRegex: /\.(client|module)\.tsx?$/,
            outputPath: clientRuntimePath,
            script: ({ script, modules }) => {
                const startApp = script.addImport({
                    from: '@superadmin/runtime-client',
                    import: 'startApp',
                });

                script.addStatement(`${startApp}({ modules: ${modules} });`);
            },
        });

        const serverRuntime = createRuntime({
            moduleRegex: /\.(server|module)\.ts$/,
            outputPath: serverRuntimePath,
            script: ({ script, modules }) => {},
        });

        return {
            start,
            clientRuntimePath,
            serverRuntimePath,
        };

        async function start() {
            const promise = createPromise();

            const watcher = watch('.', {
                cwd: config.rootPath,
                ignored: ['node_modules', '.superadmin'],
            });

            watcher.on('add', onAddFile);
            watcher.on('unlink', onDeleteFile);
            watcher.on('ready', promise.resolve);

            await promise.promise;

            await Promise.all([clientRuntime.start(), serverRuntime.start()]);
        }

        function onAddFile(path: string) {
            let added = false;

            added = clientRuntime.addFile(path) || added;
            added = serverRuntime.addFile(path) || added;

            if (added) {
                debug('Added module file: %s', path);
            }
        }

        function onDeleteFile(path: string) {
            const removed = clientRuntime.removeFile(path) || serverRuntime.removeFile(path);

            if (removed) {
                debug('Removed module file: %s', path);
            }
        }
    },
});
