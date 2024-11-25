import { computed } from 'vue';

import { useService } from '@nzyme/vue-ioc';
import { type RefParam, makeRef } from '@nzyme/vue-utils';
import type { ComponentAny } from '@superadmin/core';

import { ComponentRegistry } from './ComponentRegistry.js';

export function useComponent<T extends ComponentAny>(component: RefParam<T | undefined | null>) {
    const componentRef = makeRef(component);

    return computed(() => {
        const componentRegistry = useService(ComponentRegistry);
        const component = componentRef.value;

        return component ? componentRegistry.resolve(component) : undefined;
    });
}
