import type { Router as VueRouter } from 'vue-router';

import { defineInterface } from '@nzyme/ioc/Interface.js';

export type Router = VueRouter;
export const Router = defineInterface<Router>({ name: 'Router' });
