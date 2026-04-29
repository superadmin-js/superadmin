import path from 'path';

import { createScript } from '@nzyme/project-utils/createScript.js';
import { saveFile } from '@nzyme/project-utils/saveFile.js';
import debounce from 'lodash.debounce';

/** Options for generating the runtime module registry and configuration files. */
export interface GenerateRuntimeOptions<T extends Record<string, string> = Record<string, never>> {
    /** Directory where generated runtime files will be written. */
    outputDir: string;
    /** Root directory used for resolving relative module paths. */
    rootDir: string;
    /** Configuration object to be serialized as the runtime config module. */
    runtimeConfig: object;
    /**
     * Additional files to be added to the runtime.
     */
    additionalFiles?: T;
}

/** Generates runtime module registry and config files, with support for incremental file watching. */
export function generateRuntime<T extends Record<string, string> = Record<string, never>>(
    options: GenerateRuntimeOptions<T>,
) {
    const { outputDir, rootDir, runtimeConfig, additionalFiles } = options;

    type Module = {
        /** Path to the module file. */
        file: string;
        /** Optional explicit module identifier. */
        id?: string;
        /** Sort order for module registration. */
        order: number;
    };
    const modules: Module[] = [];

    const modulesPath = path.join(outputDir, 'modules.ts');
    const configPath = path.join(outputDir, 'config.ts');
    const generate = debounce(generateModules, 200);
    const additionalFilesPaths: Record<string, string> = {};

    for (const filePath of Object.keys(additionalFiles ?? {})) {
        additionalFilesPaths[filePath] = path.join(outputDir, filePath);
    }

    let watching = false;

    return {
        modulesPath,
        configPath,
        outputDir,
        additionalFiles: additionalFilesPaths as Record<keyof T, string>,
        addFile,
        removeFile,
        watch,
        render,
    };

    type AddFileOptions = {
        /** File path of the module to add. */
        path: string;
        /** Optional explicit module identifier. */
        id?: string;
        /** Sort order for module registration. */
        order?: number;
    };

    function addFile(options: AddFileOptions) {
        const { path, id, order = 0 } = options;
        const index = modules.findIndex(file => file.file === path);
        if (index !== -1) {
            return;
        }

        modules.push({ file: path, order, id });
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

        for (const [path, content] of Object.entries(additionalFiles ?? {})) {
            const filePath = additionalFilesPaths[path]!;
            await saveFile(filePath, content);
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
