import { identity } from '@nzyme/utils';
import type { SchemaMeta, SchemaOptionsBase, SchemaOptionsSimplify } from '@nzyme/zchema';
import { defineSchema } from '@nzyme/zchema';
import type { Schema, SchemaOptions, SchemaProto } from '@nzyme/zchema';

/**
 *
 */
export type PasswordSchema<O extends SchemaOptionsBase = SchemaOptionsBase> = Schema<string, O>;

const proto: SchemaProto<string> = {
    coerce: String,
    serialize: identity,
    check: value => typeof value === 'string',
    default: () => '',
};

type PasswordSchemaBase = {
    /** Creates a string schema with default options */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (): PasswordSchema<{}>;
    /** Creates a string schema with custom options */
    <
        TNullable extends boolean | undefined = undefined,
        TOptional extends boolean | undefined = undefined,
        TMeta extends SchemaMeta | undefined = undefined,
    >(
        options: SchemaOptions<string, TNullable, TOptional, TMeta>,
    ): PasswordSchema<SchemaOptionsSimplify<TNullable, TOptional, TMeta>>;
};

/**
 *
 */
export const password = defineSchema<PasswordSchemaBase>({
    name: 'password',
    proto: () => proto,
});
