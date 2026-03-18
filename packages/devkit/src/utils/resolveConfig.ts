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
 */
export async function resolveConfig(options: ResolveConfigOptions) {
    const { cwd = process.cwd(), configFile = 'superadmin.config.ts' } = options;
    const configPath = path.join(cwd, configFile);
    const config = (await import(configPath)) as { default: ProjectConfig };

    return config.default;
}
