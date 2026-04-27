import type * as s from '@superadmin/schema';

/** Definition of a named function with typed params and result schemas. */
export type FunctionDefinition<P extends s.Schema, R extends s.Schema> = {
    /** Unique name identifying this function. */
    name: string;
    /** Schema for the function's input parameters. */
    params: P;
    /** Schema for the function's return value. */
    result: R;
};

/** Creates a function definition with typed params and result schemas. */
export function defineFunction<P extends s.Schema, R extends s.Schema>(definition: FunctionDefinition<P, R>) {
    return definition;
}
