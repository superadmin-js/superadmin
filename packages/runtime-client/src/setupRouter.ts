import type { Container } from '@nzyme/ioc/Container.js';
import createDebug from 'debug';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import { AuthChecker } from '@superadmin/client/auth/AuthChecker.js';
import { AuthStore } from '@superadmin/client/auth/AuthStore.js';
import { RuntimeConfig } from '@superadmin/client/RuntimeConfig.js';
import { loginComponent } from '@superadmin/core/internal';
import type { View } from '@superadmin/core/views/defineView.js';
import { ViewRegistry } from '@superadmin/core/views/ViewRegistry.js';

import NavigationLayout from './components/NavigationLayout.vue';
import PageViewRenderer from './views/PageViewRenderer.vue';

/**
 *
 */
export function setupRouter(container: Container) {
    const authStore = container.resolve(AuthStore);
    const authChecker = container.resolve(AuthChecker);
    const viewRegistry = container.resolve(ViewRegistry);
    const config = container.resolve(RuntimeConfig);
    const debug = createDebug('superadmin:router');

    const routes: RouteRecordRaw[] = [];
    const routesWithNavigation: RouteRecordRaw[] = [];

    routes.push({
        path: '/',
        component: NavigationLayout,
        children: routesWithNavigation,
        beforeEnter: async (to, _from, next) => {
            await authChecker();

            if (authStore.auth) {
                return next();
            }

            if (loginView) {
                return next({
                    path: loginView.path,
                    query: { redirect: to.path },
                });
            }

            return next(new Error('Unauthorized'));
        },
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
            beforeEnter: async (to, _from, next) => {
                await authChecker();

                const authorized = view.auth.isAuthorized(authStore.auth);
                if (authorized) {
                    return next();
                }

                if (loginView) {
                    return next({
                        path: loginView.path,
                        query: { redirect: to.path },
                    });
                }

                return next(new Error('Unauthorized'));
            },
        });
    }

    const router = createRouter({
        routes,
        history: createWebHistory(config.basePath),
    });

    router.beforeEach((to, from, next) => {
        debug(`before %s → %s`, from.path, to.path);
        next();
    });

    router.afterEach((to, from) => {
        debug(`after %s → %s`, from.path, to.path);
    });

    return router;
}
