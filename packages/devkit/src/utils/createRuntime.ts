import path from 'path';

import fs from 'fs-extra';
import debounce from 'lodash.debounce';
import { format, resolveConfig } from 'prettier';

import type { ScriptBuilder } from '@nzyme/project-utils';
import { createScript } from '@nzyme/project-utils';
import type { RuntimeConfig } from '@superadmin/core';

export interface RuntimeOptions {
    outputDir: string;
    rootDir: string;
    config: RuntimeConfig;
}

export function createModulesRuntime(options: RuntimeOptions) {
    const { outputDir, rootDir } = options;

    type Module = { file: string; order: number; id?: string };
    const modules: Module[] = [];

    const configPath = path.join(outputDir, 'config.ts');
    const modulesPath = path.join(outputDir, 'modules.ts');

    const generate = debounce(generateModules, 200);
    let started = false;

    return {
        configPath,
        modulesPath,
        addFile,
        removeFile,
        start,
    };

    function addFile(path: string, options?: { order?: number; id?: string }) {
        const index = modules.findIndex(file => file.file === path);
        if (index !== -1) {
            return;
        }

        modules.push({ file: path, order: options?.order ?? 0, id: options?.id });
        modules.sort((a, b) => {
            if (a.order === b.order) {
                return a.file.localeCompare(b.file);
            }

            return a.order - b.order;
        });

        if (started) {
            void generate();
        }
    }

    function removeFile(path: string) {
        const index = modules.findIndex(file => file.file === path);

        if (index === -1) {
            return false;
        }

        modules.splice(index, 1);

        if (started) {
            void generate();
        }

        return true;
    }

    async function start() {
        if (started) {
            return;
        }

        started = true;
        await generateConfig();
        await generateModules();
    }

    async function generateConfig() {
        await fs.ensureDir(outputDir);

        const script = createScript();
        script.addStatement(`export default ${JSON.stringify(options.config)};`);

        await saveScript(configPath, script);
    }

    async function generateModules() {
        await fs.ensureDir(outputDir);

        const script = createScript();

        const modulesMap: Record<string, string> = {};

        for (const module of modules) {
            const modulePath = path.isAbsolute(module.file)
                ? path.relative(outputDir, module.file)
                : module.file;

            const moduleId = getModuleId(module);

            modulesMap[moduleId] = script.addImport({
                from: modulePath,
                import: '*',
                name: 'module',
            });
        }

        const modulesDestructured = Object.entries(modulesMap)
            .map(([path, module]) => `'${path}': ${module}`)
            .join(', ');

        script.addStatement(`export default {${modulesDestructured}};`);

        await saveScript(modulesPath, script);
    }

    async function saveScript(filePath: string, script: ScriptBuilder) {
        const prettierConfig = await resolveConfig(filePath);
        const formatted = await format(script.getCode(), {
            ...prettierConfig,
            parser: 'typescript',
        });

        await fs.writeFile(filePath, formatted);
    }

    function getModuleId(module: Module) {
        if (module.id) {
            return module.id;
        }

        const modulePath = module.file.replace(/\.[^.]+$/, '').replace(/\.common$/, '');

        if (path.isAbsolute(modulePath)) {
            return path.relative(rootDir, modulePath);
        }

        return modulePath;
    }
}
