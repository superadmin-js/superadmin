import { defineService } from '@nzyme/ioc/Service.js';

import type { UserDefinition } from './defineUser.js';

export /**
 *
 */
const AuthRegistry = defineService({
    name: 'AuthRegistry',
    setup() {
        const userTypes = new Map<string, UserDefinition>();

        return {
            registerUserType,
            resolveUserType,
        };

        function registerUserType(userDef: UserDefinition) {
            if (userTypes.has(userDef.name)) {
                throw new Error(`User type ${userDef.name} already registered`);
            }

            userTypes.set(userDef.name, userDef);
        }

        function resolveUserType(userType: string) {
            return userTypes.get(userType);
        }
    },
});
