import { join as pathJoin } from 'path';

import { defineInterface } from '@nzyme/ioc';
import type { Module } from '@nzyme/ioc';

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
     * Build configuration.
     */
    build?: ProjectBuildConfig;
}

/**
 * Project build configuration.
 */
export interface ProjectBuildConfig {
    /**
     * Server build configuration.
     */
    server?: ProjectBuildServerConfig;

    /**
     * Client build configuration.
     */
    client?: ProjectBuildClientConfig;
}

/**
 * Project build server configuration.
 */
export interface ProjectBuildServerConfig {
    /**
     * Path to the server entry file.
     * @example './server/entry.ts'
     * @default '@superadmin/server/entry'
     */
    entry?: string;
}

/**
 * Project build client configuration.
 */
export interface ProjectBuildClientConfig {
    /**
     * Path to the client entry file.
     * @example 'custom/path'
     * @default 'assets'
     */
    assetsPath?: string;
}

/**
 *
 */
export interface ProjectConfig {
    /**
     * Port to run the server on.
     */
    port: number;
    /**
     * Path to the theme file.
     */
    theme: string;
    /**
     * Path to the current working directory.
     */
    cwd: string;
    /**
     * Path to the runtime.
     */
    runtimePath: string;
    /**
     * Application base path.
     */
    basePath: string;
    /**
     * Path to the logo file.
     */
    logo: string;
    /**
     * List of plugins to use.
     */
    plugins: Module[];
    /**
     * Watch for changes in the following files.
     */
    watch: (string | RegExp)[];
    /**
     * Build configuration.
     */
    build: ProjectBuildConfig;
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
    const runtimePath = pathJoin(cwd, '.superadmin');
    const basePath = config.basePath || '/';

    return {
        port: config.port || 3000,
        theme: config.theme || '@superadmin/ui/theme',
        logo: config.logo || '@superadmin/ui/logo.svg',
        cwd,
        runtimePath,
        basePath,
        plugins: config.plugins || [],
        watch: config.watch || [],
        build: config.build || {},
    };
}
