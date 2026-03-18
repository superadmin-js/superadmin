import { common, packageJson, typescript, jsdoc } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        rootDir: import.meta.dirname,
        target: 'browser',
        internalImports: ['@superadmin/*'],
    }),
    ...packageJson(),
    ...jsdoc(),
];
