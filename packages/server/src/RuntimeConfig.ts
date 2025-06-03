import { defineInterface } from '@nzyme/ioc';

/**
 * Runtime configuration.
 */
export interface RuntimeConfig {
    /**
     * Application base path.
     * @example '/admin'
     * @default '/'
     */
    basePath: string;
}

/**
 * Runtime configuration interface.
 */
export const RuntimeConfig = defineInterface<RuntimeConfig>({
    name: 'RuntimeConfig',
});
