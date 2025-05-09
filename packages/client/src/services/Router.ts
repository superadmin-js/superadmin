import type { Router as VueRouter } from 'vue-router';

import { defineInterface } from '@nzyme/ioc';

export type Router = VueRouter;
export const Router = defineInterface<Router>({ name: 'Router' });
