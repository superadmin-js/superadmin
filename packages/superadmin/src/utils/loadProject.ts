import { createContainer } from '@nzyme/ioc/Container.js';

import { ProjectConfig } from '@superadmin/config/ProjectConfig.js';
import { resolveConfig } from '@superadmin/devkit/utils/resolveConfig.js';
import type { ResolveConfigOptions } from '@superadmin/devkit/utils/resolveConfig.js';

/**
 *
 */
export async function loadProject(options: ResolveConfigOptions) {
    const container = createContainer();
    const config = await resolveConfig(options);
    container.set(ProjectConfig, config);

    for (const plugin of config.plugins) {
        plugin(container);
    }

    return container;
}
