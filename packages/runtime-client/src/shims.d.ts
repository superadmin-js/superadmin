declare module '@modules' {
    export default [];
}

declare module '@theme' {
    export default {};
}

declare module '@config' {
    import type { RuntimeConfig } from '@superadmin/core';
    const config: RuntimeConfig;
    export default config;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}
