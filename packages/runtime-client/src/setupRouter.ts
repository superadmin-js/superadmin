import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import type { Container } from '@nzyme/ioc';
import { AuthStore } from '@superadmin/client';
import type { AuthContext, Module, View } from '@superadmin/core';
import { isView, loginGenericView } from '@superadmin/core';

import NavigationLayout from './components/NavigationLayout.vue';
import ViewRenderer from './views/ViewRenderer.vue';
import PageViewLayout from './views/layouts/PageViewLayout.vue';

export function setupRouter(container: Container, modules: Module[]) {
    const authStore = container.resolve(AuthStore);

    const routes: RouteRecordRaw[] = [];
    const routesWithNavigation: RouteRecordRaw[] = [];

    routes.push({
        path: '/',
        component: NavigationLayout,
        children: routesWithNavigation,
    });

    let loginView: View | undefined;

    for (const module of modules) {
        if (!isView(module)) {
            continue;
        }

        const routesToAddTo = module.navigation ? routesWithNavigation : routes;

        if (module.generic === loginGenericView) {
            loginView = module;
        }

        routesToAddTo.push({
            path: module.path,
            component: ViewRenderer,
            props: {
                view: module,
                params: null,
                layout: PageViewLayout,
            },
            beforeEnter: async (to, from, next) => {
                await authStore.checkAuth();

                const authorized = module.auth.isAuthorized(authStore.auth);
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
