import type { Router as VueRouter } from 'vue-router';

import { defineInjectable } from '@nzyme/ioc';

export type Router = VueRouter;
export const Router = defineInjectable<Router>({
    name: 'Router',
});
