import path from 'path';

import type { ProjectConfig } from '@superadmin/config/ProjectConfig.js';

/** Dynamically imports and returns the project configuration from the superadmin.config.ts file. */
export async function resolveConfig(cwd: string) {
    const configPath = path.join(cwd, 'superadmin.config.ts');
    const config = (await import(configPath)) as { default: ProjectConfig };

    return config.default;
}
