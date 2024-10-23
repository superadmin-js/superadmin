import { defineInjectable } from '@nzyme/ioc';

import type { Module } from './defineModule.js';

export const Modules = defineInjectable<Module[]>({
    name: 'Modules',
});
