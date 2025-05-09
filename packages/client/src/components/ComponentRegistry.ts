import { defineService } from '@nzyme/ioc';
import type { Component as VueComponent } from '@nzyme/vue-utils';

import type { Component, ComponentAny } from '@superadmin/core';

/**
 *
 */
export type ComponentTemplate<TComponent extends Component> = VueComponent<
    TComponent['$props'],
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    {
        [K in keyof TComponent['$events']]: (...args: TComponent['$events'][K]) => void;
    }
>;

/**
 *
 */
export const ComponentRegistry = defineService({
    name: 'ComponentRegistry',
    setup() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const registry = new Map<symbol, VueComponent<any, any, any>>();

        return {
            register,
            resolve,
        };

        function register<TComponent extends ComponentAny>(
            component: TComponent,
            template: ComponentTemplate<TComponent>,
        ) {
            registry.set(component.key, template);
        }

        function resolve<TComponent extends ComponentAny>(
            component: TComponent,
        ): ComponentTemplate<TComponent> | undefined {
            return registry.get(component.key);
        }
    },
});
