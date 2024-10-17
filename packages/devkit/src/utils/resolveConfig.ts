import { ProjectConfig } from '@superadmin/core';
import path from 'path';

export async function resolveConfig(cwd: string) {
    const configPath = path.join(cwd, 'superadmin.config.ts');
    const config = await import(configPath);

    return config.default as ProjectConfig;
}
