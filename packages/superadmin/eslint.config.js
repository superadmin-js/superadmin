import { common, packageJson, typescript, jsdoc } from '@nzyme/eslint';
import { globalIgnores } from 'eslint/config';

export default [
    //
    globalIgnores(['./bin/**/*']),
    ...common(),
    ...typescript({
        target: 'node',
        project: ['./tsconfig.json'],
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
];
