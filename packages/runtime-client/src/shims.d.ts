declare module '@modules' {
    import type { RuntimeModules } from '@superadmin/runtime-common';
    const modules: RuntimeModules;
    export default modules;
}

declare module '@theme' {
    export default {};
}

declare module '@config' {
    import type { RuntimeConfig } from '@superadmin/core';
    const config: RuntimeConfig;
    export default config;
}

declare module '@logo' {
    const logo: string;
    export default logo;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}
