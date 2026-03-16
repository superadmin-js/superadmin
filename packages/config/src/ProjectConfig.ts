import { join as pathJoin } from 'path';

import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { Module } from '@nzyme/ioc/Module.js';
import type { InputOptions } from 'rollup';

/** Initial configuration options for a superadmin project, with sensible defaults. */
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

    /**
     * Define variables for the client to pass to vite.
     *
     */
    define?: Record<string, unknown>;
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

/** Fully resolved project configuration with all defaults applied and computed paths. */
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

/** IoC interface for the resolved project configuration. */
export const ProjectConfig = defineInterface<ProjectConfig>({
    name: 'ProjectConfig',
});

/** Creates a fully resolved project configuration by applying defaults to the provided init options. */
export function defineConfig(config: ProjectConfigInit): ProjectConfig {
    const cwd = process.cwd();

    return {
        port: config.port || 3000,
        theme: config.theme || '@superadmin/ui/theme',
        logo: config.logo || '@superadmin/ui/logo.svg',
        cwd,
        runtimePath: pathJoin(cwd, '.superadmin'),
        plugins: config.plugins || [],
        basePath: config.basePath || '/',
        client: {
            storagePrefix: config.client?.storagePrefix || 'superadmin',
            assetsPath: config.client?.assetsPath || 'assets',
            define: config.client?.define || {},
        },
        server: {
            buildEntry: config.server?.buildEntry || '@superadmin/server/entry',
            devEntry: config.server?.devEntry || '@superadmin/server/entry-dev',
            rollupOptions: config.server?.rollupOptions || {},
        },
    };
}
