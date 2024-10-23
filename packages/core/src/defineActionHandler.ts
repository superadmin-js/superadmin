import type { ServiceContext } from '@nzyme/ioc';
import type { SchemaAny, SchemaValue } from '@nzyme/zchema';

import type { ActionDefinition } from './defineAction.js';

export interface ActionHandler<P, R> {
    (params: P): R | Promise<R>;
}

export interface ActionHandlerOptions<P extends SchemaAny, R extends SchemaAny> {
    action: ActionDefinition<P, R>;
    setup: (ctx: ServiceContext) => ActionHandler<SchemaValue<P>, SchemaValue<R>>;
}

export function defineActionHandler<P extends SchemaAny, R extends SchemaAny>(
    options: ActionHandlerOptions<P, R>,
) {
    return options;
}
