import { defineEndpoint } from '@nzyme/rpc/defineEndpoint.js';
import * as z from '@zod/mini';

export const ExecuteActionEndpoint = defineEndpoint({
    name: 'ExecuteAction',
    input: z.object({
        action: z.string(),
        params: z.unknown(),
    }),
});
