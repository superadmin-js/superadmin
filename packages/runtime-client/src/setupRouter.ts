import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import type { Container } from '@nzyme/ioc';
import { AuthStore } from '@superadmin/client';
import type { View } from '@superadmin/core';
import { ViewRegistry } from '@superadmin/core';
import { loginComponent } from '@superadmin/core/internal';

import NavigationLayout from './components/NavigationLayout.vue';
import PageViewRenderer from './views/PageViewRenderer.vue';

export function setupRouter(container: Container) {
    const authStore = container.resolve(AuthStore);
    const viewRegistry = container.resolve(ViewRegistry);

    const routes: RouteRecordRaw[] = [];
    const routesWithNavigation: RouteRecordRaw[] = [];

    routes.push({
        path: '/',
        component: NavigationLayout,
        children: routesWithNavigation,
    });

    let loginView: View | undefined;

    for (const view of viewRegistry.getAll()) {
        const routesToAddTo = view.navigation ? routesWithNavigation : routes;

        if (view.component === loginComponent) {
            loginView = view;
        }

        routesToAddTo.push({
            path: view.path,
            component: PageViewRenderer,
            props: { view },
            beforeEnter: async (to, from, next) => {
                await authStore.checkAuth();

                const authorized = view.auth.isAuthorized(authStore.auth);
                if (authorized) {
                    return next();
                }

                if (loginView) {
                    return next({
                        path: loginView.path,
                        query: {
                            redirect: to.path,
                        },
                    });
                }

                return next(new Error('Unauthorized'));
            },
        });
    }

    const router = createRouter({
        routes,
        history: createWebHistory(),
    });

    return router;
}
