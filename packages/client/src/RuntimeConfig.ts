import { defineInterface } from '@nzyme/ioc';

/**
 * Runtime configuration.
 */
export interface RuntimeConfig {
    /**
     * Application base path.
     */
    basePath: string;

    /**
     * Prefix to use for storage keys.
     */
    storagePrefix: string;
}

/**
 * Runtime configuration interface.
 */
export const RuntimeConfig = defineInterface<RuntimeConfig>({
    name: 'RuntimeConfig',
});
