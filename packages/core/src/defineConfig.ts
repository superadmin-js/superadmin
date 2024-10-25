import path from 'path';

import { defineInjectable } from '@nzyme/ioc';

export interface ProjectConfigInit {
    port?: number;
    theme?: string;
    basePath?: string;
}

export interface ProjectConfig {
    port: number;
    theme: string;
    cwd: string;
    runtimePath: string;
    basePath: string;
}

export const ProjectConfig = defineInjectable<ProjectConfig>({
    name: 'ProjectConfig',
});

export function defineConfig(config: ProjectConfigInit): ProjectConfig {
    const cwd = process.cwd();
    const runtimePath = path.join(cwd, '.superadmin');
    const basePath = config.basePath || '/';

    return {
        port: config.port || 3000,
        theme: config.theme || '@primevue/themes/aura',
        cwd,
        runtimePath,
        basePath,
    };
}
