import { Command } from '@oclif/core';
import { Container } from '@nzyme/ioc';
import { DevServer, resolveConfig } from '@superadmin/devkit';
import { ProjectConfig } from '@superadmin/core';
import { waitForever } from '@nzyme/utils';

export class StartCommand extends Command {
    static override description = 'Start the development server';

    async run() {
        const container = new Container();

        container.set(ProjectConfig, await resolveConfig(process.cwd()));

        const devServer = await container.resolve(DevServer);
        await devServer.start();

        await waitForever();
    }
}
