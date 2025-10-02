import * as s from '@superadmin/schema';
import * as v from '@superadmin/validation';

import type { ComponentAny } from '../defineComponent.js';
import { defineComponent } from '../defineComponent.js';
import type { PaginationEvents, PaginationProps } from './definePagination.js';
import { definePagination } from './definePagination.js';

/**
 *
 */
export interface BasicPaginationOptions {
    /**
     *
     */
    pageSizes?: number[];
}

/**
 *
 */
export type BasicPagination = ReturnType<typeof defineBasicPagination>;

/**
 *
 */
export type BasicPaginationProps = PaginationProps<
    BasicPagination['params'],
    BasicPagination['result'],
    BasicPagination['config']
>;

/**
 *
 */
export type BasicPaginationParams = s.Infer<BasicPagination['params']>;

/**
 *
 */
export type BasicPaginationResult = s.Infer<BasicPagination['result']>;

/**
 *
 */
export type BasicPaginationEvents = PaginationEvents<BasicPagination['params']>;

/**
 *
 */
export const basicPaginationComponent = defineComponent<BasicPagination['component']>();

/**
 *
 */
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
