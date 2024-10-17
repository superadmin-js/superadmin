import { defineInjectable } from '@nzyme/ioc';
import path from 'path';

export interface ProjectConfigInit {
    port?: number;
}

export interface ProjectConfig {
    port: number;
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
        port: config.port ?? 3000,
        rootPath,
        runtimePath,
    };
}
