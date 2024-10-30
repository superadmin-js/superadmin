import { ModalService } from '@nzyme/vue';
import { ViewRegistry, defineActionHandler } from '@superadmin/core';
import { openModalInternal } from '@superadmin/core/internal';

import ViewRenderer from '../views/ViewRenderer.vue';

export const openModalHandler = defineActionHandler({
    action: openModalInternal,
    setup: ({ inject }) => {
        const viewRegistry = inject(ViewRegistry);
        const modalService = inject(ModalService);

        return async params => {
            const view = viewRegistry.getByName(params.view);
            if (!view) {
                throw new Error(`View ${params.view} not found`);
            }

            const { default: ModalLayout } = await import('../views/layouts/ModalViewLayout.vue');

            return await modalService.open({
                modal: ViewRenderer,
                props: {
                    view: view,
                    params: params.params as unknown,
                    layout: ModalLayout,
                },
            });
        };
    },
});
