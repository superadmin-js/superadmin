import type { Router as H3Router } from 'h3';

import { defineInjectable } from '@nzyme/ioc';

export type Router = H3Router;
export const Router = defineInjectable<Router>({
    name: 'Router',
});
