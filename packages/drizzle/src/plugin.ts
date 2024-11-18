import { defineModule } from '@superadmin/core';
import { RuntimeBuilder } from '@superadmin/devkit';

export default defineModule({
    install(container) {
        const runtime = container.resolve(RuntimeBuilder);

        runtime.server.addFile('@superadmin/drizzle-server/plugin', { order: 1 });
    },
});
