import { HttpError } from '@nzyme/fetch-utils';

import { defineFunctionHandler } from '@superadmin/core';
import { refreshAuthTransform } from '@superadmin/core/internal';

import { VerifyAuthToken } from './VerifyAuthToken.js';

/**
 *
 */
export const refreshAuthTransformHandler = defineFunctionHandler({
    function: refreshAuthTransform,
    deps: {
        verifyAuthToken: VerifyAuthToken,
    },
    setup({ verifyAuthToken }) {
        return async input => {
            const result = await verifyAuthToken(input);
            if (!result || result.type !== 'refresh') {
                throw new HttpError(401, 'Unauthorized');
            }

            return result.auth.user;
        };
    },
});
