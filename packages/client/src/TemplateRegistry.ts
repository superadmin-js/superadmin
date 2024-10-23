import { defineService } from '@nzyme/ioc';
import type { Component } from '@nzyme/vue-utils';
import { type GenericView, type View, ViewRegistry } from '@superadmin/core';

export const TemplateRegistry = defineService({
    name: 'TemplateRegistry',
    setup({ inject }) {
        const views = inject(ViewRegistry);
        const registry = new Map<string, Component>();

        return {
            register,
            resolve,
        };

        function register(view: View | GenericView, component: Component) {
            registry.set(view.name, component);
        }

        function resolve(viewName: string): Component | undefined;
        function resolve(view: View): Component;
        function resolve(view: View | string | undefined) {
            if (typeof view === 'string') {
                view = views.getByName(view);
            }

            if (!view) {
                return undefined;
            }

            if (view.generic) {
                return registry.get(view.generic.name);
            }

            return registry.get(view.name);
        }
    },
});
