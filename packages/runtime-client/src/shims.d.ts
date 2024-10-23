declare module '@modules' {
    export default [];
}

declare module '@theme' {
    export default {};
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}
