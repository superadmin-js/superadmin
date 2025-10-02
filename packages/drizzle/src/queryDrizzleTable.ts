import type { SQL, SQLWrapper } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

import type { BasicPaginationParams, BasicPaginationResult } from '@superadmin/core';

/**
 *
 */
export interface QueryDrizzleTableParams<TRow, TMap = TRow> {
    /**
     * Pagination parameters
     */
    pagination: BasicPaginationParams;

    /**
     * Sort column to pass to the query
     */
    sortBy?: SQLWrapper;

    /**
     * Sort direction to pass to the query
     */
    sortDirection?: 'asc' | 'desc';

    /**
     * Query function to be executed.
     */
    query: DrizzleQuery<TRow>;

    /**
     * Map the row to a new type
     */
    map?: (row: TRow) => TMap;
}

/**
 *
 */
export interface QueryDrizzleTableContext {
    /**
     * Offset to pass to the query
     */
    offset: number;

    /**
     * Limit to pass to the query
     */
    limit: number;

    /**
     * Sort column to pass to the query
     */
    orderBy: SQL | undefined;
}

type DrizzleQuery<T> = PromiseLike<T[]> & {
    limit(limit: number): PromiseLike<T[]>;
    offset(offset: number): PromiseLike<T[]>;
    orderBy(orderBy: SQLWrapper): PromiseLike<T[]>;
};

/**
 *
 */
export async function queryDrizzleTable<TRow, TMap = TRow>(
    params: QueryDrizzleTableParams<TRow, TMap>,
) {
    const pagination = params.pagination;
    const offset = (pagination.page - 1) * pagination.pageSize;
    const limit = pagination.pageSize + 1;

    let query = params.query;

    let orderBy = params.sortBy;
    if (orderBy && params.sortDirection === 'desc') {
        orderBy = desc(orderBy);
    }

    if (orderBy) {
        query = query.orderBy(orderBy) as DrizzleQuery<TRow>;
    }

    query = query.offset(offset) as DrizzleQuery<TRow>;
    query = query.limit(limit) as DrizzleQuery<TRow>;

    const rows = await query;
    const mappedRows = params.map ? rows.map(params.map) : (rows as unknown as TMap[]);

    const hasMore = mappedRows.length > pagination.pageSize;
    if (hasMore) {
        rows.pop();
    }

    const paginationResult: BasicPaginationResult = {
        hasMore,
        page: pagination.page,
        pageSize: pagination.pageSize,
    };

    return {
        rows: mappedRows,
        pagination: paginationResult,
    };
}
