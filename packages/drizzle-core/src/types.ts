import type { Table } from 'drizzle-orm';

import type { IfLiteral } from '@nzyme/types';

export type DrizzleSchema = Record<string, unknown>;

export type TablesOf<TSchema extends DrizzleSchema> = {
    [K in keyof TSchema as TSchema[K] extends Table
        ? K & string
        : IfLiteral<K, never, K & string>]: TSchema[K] extends Table
        ? TSchema[K]
        : IfLiteral<K, never, Table>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableConfigOf<T extends Table<any>> = T extends Table<infer Config> ? Config : never;
