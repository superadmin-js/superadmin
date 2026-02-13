import { unwrapCjsDefaultImport } from '@nzyme/esm/unwrapCjsDefaultImport.js';
import { defineService } from '@nzyme/ioc/Service.js';
import { normalizeBuiltinsPlugin } from '@nzyme/rollup-utils/plugins/normalizeBuiltinsPlugin.js';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type { InputOptions } from 'rollup';
import sourcemaps from 'rollup-plugin-sourcemaps';

import { RuntimeBuilder } from './RuntimeBuilder.js';

/**
 * Service that provides the base Rollup config for the Superadmin server build.
 */
export const ServerRollupConfigProvider = defineService({
    name: 'ServerRollupConfigProvider',
    deps: {
        runtime: RuntimeBuilder,
    },
    setup({ runtime }) {
        return (): InputOptions => {
            return {
                plugins: [
                    normalizeBuiltinsPlugin(),
                    nodeResolve({
                        preferBuiltins: true,
                        extensions: ['.js', '.mjs', '.ts', '.tsx', '.json'],
                        exportConditions: ['node', 'module', 'import', 'require'],
                    }),
                    unwrapCjsDefaultImport(commonjs)(),
                    unwrapCjsDefaultImport(json)(),
                    unwrapCjsDefaultImport(typescript)(),
                    unwrapCjsDefaultImport(alias)({
                        entries: {
                            '@config': runtime.server.configPath,
                            '@modules': runtime.server.modulesPath,
                        },
                    }),
                    sourcemaps({
                        exclude: /@sentry/,
                    }),
                ],
            };
        };
    },
});
