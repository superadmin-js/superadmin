import { defineEndpoint } from '@nzyme/rpc/defineEndpoint.js';
import * as z from '@zod/mini';

<<<<<<< HEAD
export /**
 *
 */
const ExecuteActionEndpoint = defineEndpoint({
=======
/**
 *
 */
export const ExecuteActionEndpoint = defineEndpoint({
>>>>>>> origin/main
    name: 'ExecuteAction',
    input: z.object({
        action: z.string(),
        params: z.unknown(),
    }),
});
