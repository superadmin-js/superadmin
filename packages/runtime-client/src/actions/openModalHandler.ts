import { ModalService } from '@nzyme/vue';

import { defineActionHandler } from '@superadmin/core';
import { ViewRegistry } from '@superadmin/core';
import { openModalInternal } from '@superadmin/core/module';

import ViewRenderer from '../views/ViewRenderer.vue';

/**
 *
 */
export const openModalHandler = defineActionHandler({
    action: openModalInternal,
    deps: {
        viewRegistry: ViewRegistry,
        modalService: ModalService,
    },
    setup({ viewRegistry, modalService }) {
        return async params => {
            const view = viewRegistry.getById(params.view);
            if (!view) {
                throw new Error(`View ${params.view} not found`);
            }

            const { default: ModalLayout } = await import('../views/ModalViewLayout.vue');

            return await modalService.open(ViewRenderer, {
                view: view,
                params: params.params,
                layout: ModalLayout,
            });
        };
    },
});
