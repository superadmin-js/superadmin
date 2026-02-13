import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { Func } from '@nzyme/types/Common.js';

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
