import { defineEndpoint } from '@nzyme/rpc/defineEndpoint.js';
import * as z from '@zod/mini';

/** RPC endpoint definition for executing actions by name with parameters. */
export const ExecuteActionEndpoint = defineEndpoint({
    name: 'ExecuteAction',
    input: z.object({
        action: z.string(),
        params: z.unknown(),
    }),
});
