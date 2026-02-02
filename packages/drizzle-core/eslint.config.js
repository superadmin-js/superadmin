import { common, packageJson, typescript, jsdoc } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        project: ['./tsconfig.json', './tsconfig.check.json'],
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
];
