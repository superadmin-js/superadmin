import path from 'path';
import fs from 'fs-extra';
import { createScript, ScriptBuilder } from '@nzyme/project-utils';
import debounce from 'lodash.debounce';
import prettier from 'prettier';

export interface RuntimeOptions {
    moduleRegex: RegExp;
    outputPath: string;
    script: (params: { script: ScriptBuilder; modules: string }) => void;
}

export function createRuntime(options: RuntimeOptions) {
    const { moduleRegex, outputPath } = options;

    const moduleFiles = new Set<string>();
    const outputDir = path.dirname(outputPath);
    const generate = debounce(generateScript, 200);
    let started = false;

    return {
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
        await generateScript();
    }

    async function generateScript() {
        await fs.ensureDir(outputDir);

        const script = createScript();
        const modulesVar = script.addVariable('modules');

        const modules: string[] = [];

        for (const file of moduleFiles) {
            const module = script.addImport({
                from: path.relative(outputDir, file),
                import: '*',
                name: 'module',
            });

            modules.push(module);
        }

        const modulesDestructured = modules.map(module => `...Object.values(${module})`).join(', ');
        script.addStatement(`const ${modulesVar} = [${modulesDestructured}];`);

        options.script({ script, modules: modulesVar });

        const prettierConfig = await prettier.resolveConfig(outputPath);
        const formatted = await prettier.format(script.getCode(), {
            ...prettierConfig,
            parser: 'typescript',
        });

        await fs.writeFile(outputPath, formatted);
    }
}
