import { createContainer } from '@nzyme/ioc';

import { ProjectConfig } from '@superadmin/config';
import { resolveConfig } from '@superadmin/devkit';

/**
 *
 */
export async function loadProject() {
    const container = createContainer();
    const config = await resolveConfig(process.cwd());
    container.set(ProjectConfig, config);

    for (const plugin of config.plugins) {
        plugin(container);
    }

    return container;
}
