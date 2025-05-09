import { Command } from '@nzyme/cli';
import { createContainer } from '@nzyme/ioc';
import { waitForever } from '@nzyme/utils';

import { ProjectConfig } from '@superadmin/config';
import { DevServer, resolveConfig } from '@superadmin/devkit';

/**
 *
 */
export class DevCommand extends Command {
    static override paths = [['dev'], []];
    static override usage = Command.Usage({
        description: 'Start the development server',
    });

    /**
     *
     */
    async run() {
        const container = createContainer();
        const config = await resolveConfig(process.cwd());

        container.set(ProjectConfig, config);

        const devServer = await container.resolve(DevServer);
        await devServer.start();
        await waitForever();
    }
}
