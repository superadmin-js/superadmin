import type * as s from '@superadmin/schema';

export type FunctionDefinition<P extends s.Schema, R extends s.Schema> = {
    name: string;
    params: P;
    result: R;
};

export function defineFunction<P extends s.Schema, R extends s.Schema>(
    definition: FunctionDefinition<P, R>,
) {
    return definition;
}
