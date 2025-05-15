import { defineInterface } from '@nzyme/ioc';
import type { Func } from '@nzyme/types';

/**
 *
 */
export type DrizzleClient = {
    /**
     *
     */
    delete: Func;
    /**
     *
     */
    insert: Func;
    /**
     *
     */
    select: Func;
    /**
     *
     */
    update: Func;
};

/**
 *
 */
export const DrizzleClient = defineInterface<DrizzleClient>({
    name: 'DrizzleClient',
});
