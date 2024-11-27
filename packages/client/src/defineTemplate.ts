import type { Component } from '@superadmin/core';
import { defineSubmodule } from '@superadmin/core';

import type { ComponentTemplate } from './components/ComponentRegistry.js';
import { ComponentRegistry } from './components/ComponentRegistry.js';

interface TemplateComponentOptions<TComponent extends Component> {
    component: ComponentTemplate<TComponent>;
}

export function defineTemplate<TComponent extends Component>(
    component: TComponent,
    options: TemplateComponentOptions<TComponent>,
) {
    return defineSubmodule({
        install(container) {
            container.resolve(ComponentRegistry).register(component, options.component);
        },
    });
}
