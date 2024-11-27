import { defineModule } from '@nzyme/ioc';
import { RuntimeBuilder } from '@superadmin/devkit';

export default defineModule(container => {
    const runtime = container.resolve(RuntimeBuilder);
    runtime.server.addFile('@superadmin/drizzle-server', { order: 1 });
});
