import { defineInterface } from '@nzyme/ioc';

export interface RuntimeConfig {
    basePath: string;
}

export const RuntimeConfig = defineInterface<RuntimeConfig>({
    name: 'RuntimeConfig',
});
