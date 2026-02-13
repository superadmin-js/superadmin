import { createContainer } from '@nzyme/ioc/Container.js';

import { ProjectConfig } from '@superadmin/config/ProjectConfig.js';
import { resolveConfig } from '@superadmin/devkit/utils/resolveConfig.js';

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
