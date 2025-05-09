import { useService } from '@nzyme/vue-ioc';
import { makeRef } from '@nzyme/vue-utils';
import type { RefParam } from '@nzyme/vue-utils';
import { computed } from 'vue';

import type { ComponentAny } from '@superadmin/core';

import { ComponentRegistry } from './ComponentRegistry.js';

/**
 *
 */
export function useComponent<T extends ComponentAny>(component: RefParam<T | null | undefined>) {
    const componentRef = makeRef(component);

    return computed(() => {
        const componentRegistry = useService(ComponentRegistry);
        const component = componentRef.value;

        return component ? componentRegistry.resolve(component) : undefined;
    });
}
