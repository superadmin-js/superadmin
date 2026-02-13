import { defineModule } from '@nzyme/ioc/Module.js';

import { RuntimeBuilder } from '@superadmin/devkit/services/RuntimeBuilder.js';

export default defineModule(container => {
    const runtime = container.resolve(RuntimeBuilder);
    runtime.server.addFile('@superadmin/drizzle-server', { order: 1 });
});
