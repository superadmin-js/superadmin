import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

/** Options for configuring a Vite library build. */
export interface ViteLibOptions {
    /** Entry point file(s) for the library build. */
    entry: string | string[];
}

/** Creates a Vite config for building a library with Vue, JSX, and TypeScript support. */
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
