declare module '@modules' {
    export default [];
}

declare module '@theme' {
    export default {};
}

declare module '@config' {
    import type { RuntimeConfig } from '@superadmin/client/RuntimeConfig.js';
    const config: RuntimeConfig;
    export default config;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}

declare module 'lucide-static/sprite.svg' {
    const sprite: string;
    export default sprite;
}
