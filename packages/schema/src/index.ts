export * from './action.js';
export * from './icon.js';
export * from './password.js';
export * from '@nzyme/zchema';

declare module '@nzyme/zchema' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface SchemaProps<V> {
        label?: string;
        help?: string;
        hidden?: boolean;
    }
}
