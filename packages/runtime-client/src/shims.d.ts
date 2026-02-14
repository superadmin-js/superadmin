declare module '@modules' {
    import type { RuntimeModules } from '@superadmin/runtime-common/RuntimeModules.js';

    const modules: RuntimeModules;
    export default modules;
}

declare module '@theme' {
    export default {};
}

declare module '@config' {
    import type { RuntimeConfig } from '@superadmin/client/RuntimeConfig.js';

    const config: RuntimeConfig;
    export default config;
}

declare module '@logo' {
    const logo: string;
    export default logo;
}

declare module '@tailwind' {
    const tailwind: string;
    export default tailwind;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module 'lucide-static/sprite.svg' {
    const sprite: string;
    export default sprite;
}
