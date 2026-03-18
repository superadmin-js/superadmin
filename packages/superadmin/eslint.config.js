import { common, packageJson, typescript, jsdoc } from '@nzyme/eslint';
import { globalIgnores } from 'eslint/config';

export default [
    //
    globalIgnores(['./bin/**/*']),
    ...common(),
    ...typescript({
        rootDir: import.meta.dirname,
        target: 'node',
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
];
