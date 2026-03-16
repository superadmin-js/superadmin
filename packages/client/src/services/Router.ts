import { defineInterface } from '@nzyme/ioc/Interface.js';
import type { Router as VueRouter } from 'vue-router';

/** The Vue Router instance type. */
export type Router = VueRouter;
/** IoC interface for the Vue Router instance. */
export const Router = defineInterface<Router>({ name: 'Router' });
