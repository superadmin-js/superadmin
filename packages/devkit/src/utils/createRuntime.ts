import path from 'path';

import fs from 'fs-extra';
import debounce from 'lodash.debounce';
import { format, resolveConfig } from 'prettier';

import type { ScriptBuilder } from '@nzyme/project-utils';
import { createScript } from '@nzyme/project-utils';
import type { RuntimeConfig } from '@superadmin/core';

export interface RuntimeOptions {
    moduleRegex: RegExp;
    outputDir: string;
    config: RuntimeConfig;
}

export function createModulesRuntime(options: RuntimeOptions) {
    const { moduleRegex, outputDir } = options;

    const moduleFiles = new Set<string>();

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

    function addFile(path: string) {
        if (!moduleRegex.test(path)) {
            return false;
        }

        moduleFiles.add(path);

        if (started) {
            void generate();
        }

        return true;
    }

    function removeFile(path: string) {
        if (!moduleRegex.test(path)) {
            return false;
        }

        moduleFiles.delete(path);

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

        const modulesSorted = Array.from(moduleFiles).sort();
        const modules: string[] = [];

        for (const file of modulesSorted) {
            const module = script.addImport({
                from: path.relative(outputDir, file),
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
