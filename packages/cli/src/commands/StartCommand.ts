import { Command } from '@oclif/core';

import { createContainer } from '@nzyme/ioc';
import { waitForever } from '@nzyme/utils';
import { ProjectConfig } from '@superadmin/core';
import { DevServer, resolveConfig } from '@superadmin/devkit';

export class StartCommand extends Command {
    static override description = 'Start the development server';

    async run() {
        const container = createContainer();
        container.set(ProjectConfig, await resolveConfig(process.cwd()));

        const devServer = await container.resolve(DevServer);
        await devServer.start();

        await waitForever();
    }
}
