import { createServer } from './createServer.js';

const server = createServer({
    port: Number(process.env.PORT || 3001),
});

await server.start();
