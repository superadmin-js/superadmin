import { vueLibConfig } from '@nzyme/rollup-utils/vueLibConfig.js';

export default vueLibConfig({
    entry: ['./src/index.ts', './src/module.ts'],
});
