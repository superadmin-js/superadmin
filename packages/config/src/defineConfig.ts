import { join as pathJoin } from 'path';

import { defineInterface } from '@nzyme/ioc';
import type { Module } from '@nzyme/ioc';

/**
 *
 */
export interface ProjectConfigInit {
    /**
     *
     */
    port?: number;
    /**
     *
     */
    theme?: string;
    /**
     *
     */
    basePath?: string;
    /**
     *
     */
    logo?: string;
    /**
     *
     */
    plugins?: Module[];
}

/**
 *
 */
export interface ProjectConfig {
    /**
     *
     */
    port: number;
    /**
     *
     */
    theme: string;
    /**
     *
     */
    cwd: string;
    /**
     *
     */
    runtimePath: string;
    /**
     *
     */
    basePath: string;
    /**
     *
     */
    logo: string;
    /**
     *
     */
    plugins: Module[];
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
    };
}
