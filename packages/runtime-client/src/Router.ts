import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import type { InjectableOf } from '@nzyme/ioc';
import { defineService } from '@nzyme/ioc';
import { Modules, isView } from '@superadmin/core';

import ViewRenderer from './components/ViewRenderer.vue';

export type Router = InjectableOf<typeof Router>;

export const Router = defineService({
    name: 'Router',
    setup({ inject }) {
        const modules = inject(Modules);
        const routes: RouteRecordRaw[] = [];

        for (const module of modules) {
            if (!isView(module)) {
                continue;
            }

            routes.push({
                path: module.path ?? `/view/${module.name}`,
                component: ViewRenderer,
                props: {
                    view: module,
                },
            });
        }

        const router = createRouter({
            routes,
            history: createWebHistory(),
        });

        return router;
    },
});
