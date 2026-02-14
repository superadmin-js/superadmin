import { identity } from '@nzyme/utils/functions/identity.js';
import { defineSchema } from '@nzyme/zchema/defineSchema.js';
import type {
    Infer,
    Schema,
    SchemaMeta,
    SchemaOptions,
    SchemaOptionsBase,
    SchemaOptionsSimplify,
    SchemaProto,
} from '@nzyme/zchema/Schema.js';

declare const ACTION_SYMBOL: unique symbol;

/**
 *
 */
export interface Action<
    P extends Schema = Schema,
    R extends Schema = Schema,
> extends ActionPayload<P> {
    /**
     * This is just a marker to preserve result type
     * @internal
     */
    [ACTION_SYMBOL]: R;
}

/**
 *
 */
export interface ActionPayload<P extends Schema = Schema> {
    /**
     * ID of the action
     */
    action: string;
    /**
     * Parameters of the action
     */
    params: Infer<P>;
}

/**
 *
 */
export type ActionSchema<O extends SchemaOptionsBase = SchemaOptionsBase> = Schema<Action, O>;

const proto: SchemaProto<Action> = {
    coerce: (value: unknown) => {
        const action = {
            action: (value as Action).action || '',
            params: (value as Action).params,
        };

        return action as Action;
    },
    serialize: identity,
    check(value): value is Action {
        return (
            value != null &&
            typeof value === 'object' &&
            'action' in value &&
            typeof value.action === 'string' &&
            'params' in value
        );
    },
    default: () => ({ action: '', params: null }) as Action,
};

type ActionSchemaBase = {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (): ActionSchema<{}>;
    <
        TNullable extends boolean | undefined = undefined,
        TOptional extends boolean | undefined = undefined,
        TMeta extends SchemaMeta | undefined = undefined,
    >(
        options: SchemaOptions<Action, TNullable, TOptional, TMeta>,
    ): ActionSchema<SchemaOptionsSimplify<TNullable, TOptional, TMeta>>;
};

/**
 *
 */
export const action = defineSchema<ActionSchemaBase>({
    name: 'action',
    proto: () => proto,
});
