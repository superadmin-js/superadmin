import { identity } from '@nzyme/utils';
import type { SchemaMeta, SchemaOptionsBase, SchemaOptionsSimplify } from '@nzyme/zchema';
import { defineSchema } from '@nzyme/zchema';
import type { Schema, SchemaOptions, SchemaProto } from '@nzyme/zchema';
import type * as lucide from 'lucide-static';
import type { KebabCase } from 'type-fest';

/**
 *
 */
export interface Icons {
    /**
     *
     */
    default: LucideIcon;
}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Icon = CustomIcons[keyof CustomIcons] | Icons['default'];

/**
 *
 */
export type IconSchema<O extends SchemaOptionsBase = SchemaOptionsBase> = Schema<Icon, O>;

type LucideIcon = KebabCase<keyof typeof lucide>;

type CustomIcons = {
    [K in Exclude<keyof Icons, 'default'>]: `${K}:${Icons[K]}`;
};

const proto: SchemaProto<string> = {
    coerce: String,
    serialize: identity,
    check: value => typeof value === 'string',
    default: () => '',
};

type IconSchemaBase = {
    /** Creates an icon schema with default options */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (): IconSchema<{}>;
    /** Creates an icon schema with custom options */
    <
        TNullable extends boolean | undefined = undefined,
        TOptional extends boolean | undefined = undefined,
        TMeta extends SchemaMeta | undefined = undefined,
    >(
        options: SchemaOptions<string, TNullable, TOptional, TMeta>,
    ): IconSchema<SchemaOptionsSimplify<TNullable, TOptional, TMeta>>;
};

/**
 *
 */
export const icon = defineSchema<IconSchemaBase>({
    name: 'icon',
    proto: () => proto,
});
