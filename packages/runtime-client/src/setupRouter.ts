import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import type { Module } from '@superadmin/core';
import { isView } from '@superadmin/core';

import View from './components/View.vue';

export function setupRouter(modules: Module[]) {
    const routes: RouteRecordRaw[] = [];

    for (const module of modules) {
        if (!isView(module)) {
            continue;
        }

        routes.push({
            path: module.path,
            component: View,
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
}
