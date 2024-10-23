import { defineService } from '@nzyme/ioc';
import type { Component } from '@nzyme/vue-utils';
import type { GenericView, View } from '@superadmin/core';

export const TemplateRegistry = defineService({
    name: 'TemplateRegistry',
    setup() {
        const registry = new Map<string, Component>();

        return {
            register,
            resolve,
        };

        function register(view: View | GenericView, component: Component) {
            registry.set(view.name, component);
        }

        function resolve(view: View) {
            if (view.generic) {
                return registry.get(view.generic.name);
            }

            return registry.get(view.name);
        }
    },
});
