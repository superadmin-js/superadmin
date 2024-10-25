import { defineInjectable } from '@nzyme/ioc';

export interface RuntimeConfig {
    basePath: string;
}

export const RuntimeConfig = defineInjectable<RuntimeConfig>({
    name: 'RuntimeConfig',
});
