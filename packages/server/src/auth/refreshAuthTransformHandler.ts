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
            if (!result) {
                return null;
            }

            if (result.type !== 'refresh') {
                return null;
            }

            return result.auth.user;
        };
    },
});
