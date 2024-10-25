declare module '@modules' {
    export default [];
}

declare module '@config' {
    import type { RuntimeConfig } from '@superadmin/core';
    const config: RuntimeConfig;
    export default config;
}
