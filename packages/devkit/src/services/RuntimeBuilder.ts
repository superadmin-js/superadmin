import path from 'path';
import { fileURLToPath } from 'url';

import { defineService } from '@nzyme/ioc/Service.js';
import { isFileIgnored } from '@nzyme/project-utils/isFileIgnored.js';
import { resolveModulePath } from '@nzyme/project-utils/resolveModulePath.js';
import { resolveProjectPath } from '@nzyme/project-utils/resolveProjectPath.js';
import { createPromise } from '@nzyme/utils/createPromise.js';
import { joinLines } from '@nzyme/utils/string/joinLines.js';
import { watch } from 'chokidar';
import createDebug from 'debug';
import fastGlob from 'fast-glob';
import { ResolverFactory } from 'oxc-resolver';
import type { TsConfigJson } from 'type-fest';

import type { RuntimeConfig as ClientRuntimeConfig } from '@superadmin/client/RuntimeConfig.js';
import { ProjectConfig } from '@superadmin/config/ProjectConfig.js';
import type { RuntimeConfig as ServerRuntimeConfig } from '@superadmin/server/RuntimeConfig.js';

import { generateRuntime } from '../runtime/createRuntime.js';
import { normalizePath } from '../utils/normalizePath.js';

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
        const ignored = ['node_modules', '.output'];

        const clientDir = path.join(projectConfig.runtimePath, 'client');
        const serverDir = path.join(projectConfig.runtimePath, 'server');

        const currentFile = fileURLToPath(import.meta.url);

        const typesResolver = new ResolverFactory({
            conditionNames: ['types'],
            mainFields: ['types'],
        });

        const styleResolver = new ResolverFactory({
            conditionNames: ['style'],
            mainFields: ['style'],
        });

        const clientRuntimeConfig: ClientRuntimeConfig = {
            basePath: projectConfig.basePath,
            storagePrefix: projectConfig.client.storagePrefix,
        };

        const clientTsConfig: TsConfigJson = {
            extends: resolveModulePath('@superadmin/tsconfig/base.json', import.meta),
            compilerOptions: {
                moduleResolution: 'Bundler',
                module: 'ESNext',
                useDefineForClassFields: true,
                lib: ['ESNext', 'dom', 'dom.iterable', 'webworker'],
                allowJs: false,
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                allowArbitraryExtensions: true,
                jsx: 'react',
                jsxFactory: 'h',
                jsxFragmentFactory: 'h',
                types: [],
            },
            include: ['../../**/*.ts', '../../**/*.tsx', '../../**/*.vue', '../../**/*.json'],
        };

        const viteClientTypes = typesResolver.resolveFileSync(currentFile, 'vite/client');
        const vueJsxTypes = typesResolver.resolveFileSync(currentFile, 'vue/jsx');
        const tailwindStyles = styleResolver.resolveFileSync(currentFile, 'tailwindcss');
        const tailwindPrimeuiStyles = styleResolver.resolveFileSync(
            currentFile,
            'tailwindcss-primeui',
        );

        const shims = `
/// <reference types="${viteClientTypes?.path}" />
/// <reference types="${vueJsxTypes?.path}" />
export {}`;

        const client = generateRuntime({
            outputDir: clientDir,
            rootDir: projectConfig.cwd,
            runtimeConfig: clientRuntimeConfig,
            additionalFiles: {
                'tsconfig.json': JSON.stringify(clientTsConfig, null, 2),
                'shims.d.ts': shims,
                'tailwind.css': joinLines([
                    `@import '${tailwindStyles?.path}';`,
                    `@import '${tailwindPrimeuiStyles?.path}';`,
                    `@source '${normalizePath('.', projectConfig.cwd)}';`,
                    `@source '${resolveProjectPath('@superadmin/ui', import.meta)}';`,
                ]),
            },
        });

        const serverRuntimeConfig: ServerRuntimeConfig = {
            basePath: projectConfig.basePath,
        };

        const server = generateRuntime({
            outputDir: serverDir,
            rootDir: projectConfig.cwd,
            runtimeConfig: serverRuntimeConfig,
        });

        client.addFile({
            path: resolveModulePath('@superadmin/core/module', import.meta),
            id: '@superadmin/core',
            order: -1,
        });

        client.addFile({
            path: resolveModulePath('@superadmin/runtime-client/module', import.meta),
            id: '@superadmin/client',
            order: -1,
        });

        server.addFile({
            path: resolveModulePath('@superadmin/core/module', import.meta),
            id: '@superadmin/core',
            order: -1,
        });

        server.addFile({
            path: resolveModulePath('@superadmin/server/module', import.meta),
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

            const ignoredPatterns = ignored.map(pattern => `/${pattern}`);
            console.log('Watching ' + projectConfig.cwd);
            const watcher = watch('.', {
                cwd: projectConfig.cwd,
                ignored: file => {
                    return (
                        ignoredPatterns.some(pattern => file.endsWith(pattern)) ||
                        !!isFileIgnored(file)
                    );
                },
                persistent: true,
                ignoreInitial: true,
            });

            watcher.on('add', onAddFile);
            watcher.on('unlink', onDeleteFile);
            watcher.on('ready', promise.resolve);

            await render();
            await promise.promise;
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
                client.addFile({ path: absolutePath });
                added = true;
            }

            if (serverRegex.test(absolutePath)) {
                server.addFile({ path: absolutePath });
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
