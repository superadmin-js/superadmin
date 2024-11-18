import path from 'path';

import fs from 'fs-extra';
import debounce from 'lodash.debounce';
import { format, resolveConfig } from 'prettier';

import type { ScriptBuilder } from '@nzyme/project-utils';
import { createScript } from '@nzyme/project-utils';
import type { RuntimeConfig } from '@superadmin/core';

export interface RuntimeOptions {
    outputDir: string;
    config: RuntimeConfig;
}

export function createModulesRuntime(options: RuntimeOptions) {
    const { outputDir } = options;

    const moduleFiles: { file: string; order: number }[] = [];

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

    function addFile(path: string, options?: { order?: number }) {
        const index = moduleFiles.findIndex(file => file.file === path);
        if (index !== -1) {
            return;
        }

        moduleFiles.push({ file: path, order: options?.order ?? 0 });
        moduleFiles.sort((a, b) => {
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
        const index = moduleFiles.findIndex(file => file.file === path);

        if (index === -1) {
            return false;
        }

        moduleFiles.splice(index, 1);

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

        const modules: string[] = [];

        for (const mod of moduleFiles) {
            const module = script.addImport({
                from: path.isAbsolute(mod.file) ? path.relative(outputDir, mod.file) : mod.file,
                import: '*',
                name: 'module',
            });

            modules.push(module);
        }

        const modulesDestructured = modules.map(module => `...Object.values(${module})`).join(', ');
        script.addStatement(`export default [${modulesDestructured}];`);

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
}
