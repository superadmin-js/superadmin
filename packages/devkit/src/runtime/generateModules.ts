import path from 'path';

import { createScript, saveFile } from '@nzyme/project-utils';
import debounce from 'lodash.debounce';
import type { TsConfigJson } from 'type-fest';

import type { RuntimeConfig } from '@superadmin/core';
import { saveTsConfig } from './saveTsConfig.js';

/**
 *
 */
export interface GenerateRuntimeOptions {
    /**
     *
     */
    outputDir: string;
    /**
     *
     */
    rootDir: string;
    /**
     *
     */
    runtimeConfig: RuntimeConfig;
    /**
     *
     */
    tsConfig?: TsConfigJson;
}

/**
 *
 */
export function generateRuntime(options: GenerateRuntimeOptions) {
    const { outputDir, rootDir, runtimeConfig, tsConfig } = options;

    /**
     *
     */
    type Module = {
        /**
         *
         */
        file: string /**
         *
         */;
        id?: string /**
         *
         */;
        order: number;
    };
    const modules: Module[] = [];

    const modulesPath = path.join(outputDir, 'modules.ts');
    const configPath = path.join(outputDir, 'config.ts');
    const tsConfigPath = options.tsConfig ? path.join(outputDir, 'tsconfig.json') : undefined;

    const generate = debounce(generateModules, 200);
    let watching = false;

    return {
        modulesPath,
        configPath,
        tsConfigPath,
        addFile,
        removeFile,
        watch,
        render,
    };

    type AddFileOptions = {
        /**
         *
         */
        id?: string;
        /**
         *
         */
        order?: number;
    };

    function addFile(path: string, options?: AddFileOptions) {
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

        if (watching) {
            void generate();
        }
    }

    function removeFile(path: string) {
        const index = modules.findIndex(file => file.file === path);

        if (index === -1) {
            return false;
        }

        modules.splice(index, 1);

        if (watching) {
            void generate();
        }

        return true;
    }

    async function watch() {
        if (watching) {
            return;
        }

        watching = true;
        await render();
    }

    async function render() {
        await generateConfig();
        if (tsConfigPath && tsConfig) {
            await saveTsConfig(tsConfigPath, tsConfig);
        }
        await generateModules();
    }

    async function generateConfig() {
        const configContent = `export default ${JSON.stringify(runtimeConfig)};`;
        await saveFile(configPath, configContent);
    }

    async function generateModules() {
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

        await saveFile(modulesPath, script.getCode());
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
