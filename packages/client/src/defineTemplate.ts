import type { Component } from '@nzyme/vue-utils';
import { type GenericView, type View, defineModule } from '@superadmin/core';

import { TemplateRegistry } from './TemplateRegistry.js';

interface TemplateViewOptions {
    view: View | GenericView;
    component: Component;
}

export function defineTemplate(options: TemplateViewOptions) {
    return defineModule(container => {
        container.resolve(TemplateRegistry).register(options.view, options.component);
    });
}
