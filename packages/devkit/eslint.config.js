import { common, packageJson, typescript, jsdoc } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        rootDir: import.meta.dirname,
        target: 'node',
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
];
