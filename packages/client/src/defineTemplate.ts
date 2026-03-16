import type { Component } from '@superadmin/core/defineComponent.js';
import { defineSubmodule } from '@superadmin/core/defineSubmodule.js';

import type { ComponentTemplate } from './components/ComponentRegistry.js';
import { ComponentRegistry } from './components/ComponentRegistry.js';

interface TemplateComponentOptions<TComponent extends Component> {
    component: ComponentTemplate<TComponent>;
}

/** Creates a submodule that registers a Vue template for a superadmin component. */
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
