import type { Router as H3Router } from 'h3';

import { defineInterface } from '@nzyme/ioc';

export type Router = H3Router;
export const Router = defineInterface<Router>({
    name: 'Router',
});
