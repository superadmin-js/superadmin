declare module '@modules' {
    import type { RuntimeModules } from '@superadmin/runtime-common';
    const modules: RuntimeModules;
    export default modules;
}

declare module '@config' {
    import type { RuntimeConfig } from './RuntimeConfig.js';
    const config: RuntimeConfig;
    export default config;
}
