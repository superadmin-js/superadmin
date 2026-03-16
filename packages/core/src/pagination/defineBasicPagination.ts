import * as s from '@superadmin/schema';
import * as v from '@superadmin/validation';

import type { ComponentAny } from '../defineComponent.js';
import { defineComponent } from '../defineComponent.js';
import type { PaginationEvents, PaginationProps } from './definePagination.js';
import { definePagination } from './definePagination.js';

/** Configuration options for a basic offset-based pagination. */
export interface BasicPaginationOptions {
    /** Allowed page sizes for the user to choose from (defaults to [25, 50, 100]). */
    pageSizes?: number[];
}

/** Type alias for the return type of {@link defineBasicPagination}. */
export type BasicPagination = ReturnType<typeof defineBasicPagination>;

/** Props type for the basic pagination component. */
export type BasicPaginationProps = PaginationProps<
    BasicPagination['params'],
    BasicPagination['result'],
    BasicPagination['config']
>;

/** Inferred params type for basic pagination (page number and page size). */
export type BasicPaginationParams = s.Infer<BasicPagination['params']>;

/** Inferred result type for basic pagination (page info and row count). */
export type BasicPaginationResult = s.Infer<BasicPagination['result']>;

/** Events type for the basic pagination component. */
export type BasicPaginationEvents = PaginationEvents<BasicPagination['params']>;

/** Shared component definition for all basic pagination instances. */
export const basicPaginationComponent = defineComponent<BasicPagination['component']>();

/** Creates a basic offset-based pagination definition with configurable page sizes. */
export function defineBasicPagination(options?: BasicPaginationOptions) {
    const pageSizes = options?.pageSizes ?? [25, 50, 100];

    const params = getParams(pageSizes);
    const result = getResult();

    const component = basicPaginationComponent as ComponentAny;

    return definePagination({
        params,
        result,
        component,
        config: {
            pageSizes,
        },
    });
}

function getParams(pageSizes: number[]) {
    return s.object({
        pageSize: s.enum(pageSizes),
        page: s.number({
            default: () => 1,
            validate: v.minValue(1, { exclusive: false }),
        }),
    });
}

function getResult() {
    return s.object({
        page: s.number(),
        pageSize: s.number(),
        hasMore: s.boolean(),
        totalRows: s.number({ optional: true, nullable: true }),
    });
}
