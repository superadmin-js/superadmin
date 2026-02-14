import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { Router as VueRouter } from 'vue-router';

/**
 *
 */
export type Router = VueRouter;
export /**
 *
 */
const Router = defineInterface<Router>({ name: 'Router' });
