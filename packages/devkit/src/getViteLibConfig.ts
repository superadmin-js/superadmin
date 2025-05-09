import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 *
 */
export interface ViteLibOptions {
    /**
     *
     */
    entry: string | string[];
}

/**
 *
 */
export function getViteLibConfig(options: ViteLibOptions) {
    return defineConfig({
        plugins: [
            vue(),
            vueJsx(),
            tsconfigPaths(),
            checker({
                typescript: true,
                vueTsc: true,
            }),
        ],
        build: {
            lib: {
                entry: options.entry,
                formats: ['es'],
            },
        },
    });
}
