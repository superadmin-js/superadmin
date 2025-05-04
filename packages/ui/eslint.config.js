import { common, packageJson, typescript, jsdoc, vue } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        target: 'browser',
        project: ['./tsconfig.json', './tsconfig.tests.json'],
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
    ...vue(),
];
