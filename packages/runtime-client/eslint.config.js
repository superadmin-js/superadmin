import { common, packageJson, typescript, jsdoc, vue } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        target: 'browser',
        project: ['./tsconfig.json', './tsconfig.tests.json', './tsconfig.node.json'],
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...vue(),
];
