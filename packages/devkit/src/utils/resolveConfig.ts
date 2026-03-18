import path from 'path';

import type { ProjectConfig } from '@superadmin/config/ProjectConfig.js';

/**
 * Options for resolving the Superadmin config.
 */
export interface ResolveConfigOptions {
    /**
     * The current working directory.
     */
    cwd?: string;

    /**
     * The path to the Superadmin config file.
     */
    configFile?: string;
}

/**
 * Resolve the Superadmin config.
 *
 * Uses the config file's directory as the project root so that builds,
 * output paths and asset resolution work correctly even when the CLI
 * is invoked from a different directory (e.g. a monorepo root).
 */
export async function resolveConfig(options: ResolveConfigOptions) {
    const { cwd = process.cwd(), configFile = 'superadmin.config.ts' } = options;
    const configPath = path.resolve(cwd, configFile);
    const config = (await import(configPath)) as { default: ProjectConfig };

    const projectRoot = path.dirname(configPath);

    return {
        ...config.default,
        cwd: projectRoot,
        runtimePath: path.join(projectRoot, '.superadmin'),
    };
}
