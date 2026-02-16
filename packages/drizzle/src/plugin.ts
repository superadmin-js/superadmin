import { defineModule } from '@nzyme/ioc/Module.js';
import { resolveModulePath } from '@nzyme/project-utils/resolveModulePath.js';

import { RuntimeBuilder } from '@superadmin/devkit/services/RuntimeBuilder.js';

export default defineModule(container => {
    const runtime = container.resolve(RuntimeBuilder);
    runtime.server.addFile({
        path: resolveModulePath('@superadmin/drizzle-server', import.meta),
        id: '@superadmin/drizzle-server',
        order: 1,
    });
});
