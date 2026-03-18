import { common, packageJson, typescript, jsdoc, vue } from '@nzyme/eslint';

export default [
    //
    ...common(),
    ...typescript({
        rootDir: import.meta.dirname,
        target: 'browser',
        internalImports: ['@superadmin/*'],
        allowDefaultProject: ['vite.config.ts'],
    }),
    ...packageJson(),
    ...vue(),
];
