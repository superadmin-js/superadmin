import { common, packageJson, typescript, jsdoc } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        project: ['./tsconfig.json'],
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
];
