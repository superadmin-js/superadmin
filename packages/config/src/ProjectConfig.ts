import { join as pathJoin } from 'path';

import { defineInterface } from '@nzyme/ioc';
import type { Module } from '@nzyme/ioc';
import type { InputOptions } from 'rollup';

/**
 *
 */
export interface ProjectConfigInit {
    /**
     * Port to run the server on.
     * @example 3000
     * @default 3000
     */
    port?: number;

    /**
     * Path to the theme file.
     * @example '@superadmin/ui/theme'
     * @default '@superadmin/ui/theme'
     */
    theme?: string;

    /**
     * Application base path.
     * @example '/admin'
     * @default '/'
     */
    basePath?: string;

    /**
     * Path to the logo file.
     * @example './logo.svg'
     * @default '@superadmin/ui/logo.svg'
     */
    logo?: string;

    /**
     * List of plugins to use.
     */
    plugins?: Module[];

    /**
     * Watch for changes in the following files.
     */
    watch?: (string | RegExp)[];

    /**
     * Client configuration.
     */
    client?: ProjectClientConfig;

    /**
     * Server build configuration.
     */
    server?: ProjectServerConfig;
}

/**
 * Project client configuration.
 */
export interface ProjectClientConfig {
    /**
     * Prefix to use for storage keys.
     * @example 'superadmin'
     * @default 'admin'
     */
    storagePrefix?: string;

    /**
     * Path to the client entry file.
     * @example 'custom/path'
     * @default 'assets'
     */
    assetsPath?: string;
}

/**
 * Project server configuration.
 */
export interface ProjectServerConfig {
    /**
     * Path to the server entry file.
     * @example './server/entry.ts'
     * @default '@superadmin/server/entry'
     */
    buildEntry?: string;

    /**
     * Path to the server entry file for development.
     * @example './server/entry-dev.ts'
     * @default '@superadmin/server/entry-dev'
     */
    devEntry?: string;

    /**
     * Rollup options.
     */
    rollupOptions?: InputOptions;
}

/**
 *
 */
export interface ProjectConfig extends Required<ProjectConfigInit> {
    /**
     * Path to the current working directory.
     */
    cwd: string;

    /**
     * Path to the runtime.
     */
    runtimePath: string;

    /**
     * Client configuration.
     */
    client: Required<ProjectClientConfig>;

    /**
     * Server configuration.
     */
    server: Required<ProjectServerConfig>;
}

/**
 *
 */
export const ProjectConfig = defineInterface<ProjectConfig>({
    name: 'ProjectConfig',
});

/**
 *
 */
export function defineConfig(config: ProjectConfigInit): ProjectConfig {
    const cwd = process.cwd();

    return {
        port: config.port || 3000,
        theme: config.theme || '@superadmin/ui/theme',
        logo: config.logo || '@superadmin/ui/logo.svg',
        cwd,
        runtimePath: pathJoin(cwd, '.superadmin'),
        plugins: config.plugins || [],
        watch: config.watch || [],
        basePath: config.basePath || '/',
        client: {
            storagePrefix: config.client?.storagePrefix || 'superadmin',
            assetsPath: config.client?.assetsPath || 'assets',
        },
        server: {
            buildEntry: config.server?.buildEntry || '@superadmin/server/entry',
            devEntry: config.server?.devEntry || '@superadmin/server/entry-dev',
            rollupOptions: config.server?.rollupOptions || {},
        },
    };
}
