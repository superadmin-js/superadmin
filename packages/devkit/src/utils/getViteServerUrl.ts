import type { ViteDevServer } from 'vite';

/** Extracts the HTTP URL from a running Vite dev server, normalizing localhost addresses. */
export function getViteServerUrl(server: ViteDevServer) {
    const address = server.httpServer?.address();

    if (address && typeof address !== 'string') {
        let hostname = address.address;
        if (hostname === '127.0.0.1' || hostname === '::1') {
            hostname = 'localhost';
        }

        return `http://${hostname}:${address.port}`;
    }
}
