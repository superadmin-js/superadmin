import { vueLibConfig } from '@nzyme/rollup-utils';

export default vueLibConfig({
    entry: ['./src/index.ts', './src/module.ts'],
});
