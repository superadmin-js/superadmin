import path from 'path';

import { defineInjectable } from '@nzyme/ioc';

export interface ProjectConfigInit {
    port?: number;
    theme?: string;
}

export interface ProjectConfig {
    port: number;
    theme: string;
    rootPath: string;
    runtimePath: string;
}

export const ProjectConfig = defineInjectable<ProjectConfig>({
    name: 'ProjectConfig',
});

export function defineConfig(config: ProjectConfigInit): ProjectConfig {
    const rootPath = process.cwd();
    const runtimePath = path.join(rootPath, '.superadmin');

    return {
        port: config.port || 3000,
        theme: config.theme || '@primevue/themes/aura',
        rootPath,
        runtimePath,
    };
}
