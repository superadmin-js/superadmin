export * from '@nzyme/zchema';

declare module '@nzyme/zchema' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface SchemaOptions<V> {
        label?: string;
        help?: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface SchemaProps<V, O> {
        label?: string;
        help?: string;
    }
}
