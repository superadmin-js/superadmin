import { createRouter, createWebHistory } from 'vue-router';

import type { InjectableOf } from '@nzyme/ioc';
import { defineService } from '@nzyme/ioc';

import ViewRenderer from './components/ViewRenderer.vue';

export type Router = InjectableOf<typeof Router>;

export const Router = defineService({
    name: 'Router',
    setup() {
        const router = createRouter({
            routes: [
                {
                    path: '/',
                    component: ViewRenderer,
                },
                {
                    path: '/view/:view',
                    component: ViewRenderer,
                    props: true,
                },
            ],
            history: createWebHistory(),
        });

        return router;
    },
});
