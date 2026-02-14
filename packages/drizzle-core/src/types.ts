import type { IfLiteral } from '@nzyme/types/TypeGuards.js';
import type { Table } from 'drizzle-orm';

/**
 *
 */
export type DrizzleSchema = Record<string, unknown>;

/**
 *
 */
export type TablesOf<TSchema extends DrizzleSchema> = {
    [K in keyof TSchema as TSchema[K] extends Table
        ? K & string
        : IfLiteral<K, never, K & string>]: TSchema[K] extends Table
        ? TSchema[K]
        : IfLiteral<K, never, Table>;
};

/**
 *
 */
export type TableConfigOf<T extends Table<any>> = T extends Table<infer Config> ? Config : never;

/**
 *
 */
export type TableNamesOf<TSchema extends DrizzleSchema> = {
    [K in keyof TSchema as TSchema[K] extends Table
        ? K & string
        : IfLiteral<K, never, K & string>]: TSchema[K] extends Table
        ? TSchema[K]
        : IfLiteral<K, never, Table>;
};

/**
 *
 */
export type TableAny = Table<any>;
