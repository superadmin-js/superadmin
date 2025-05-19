import { Command } from '@nzyme/cli';
import { waitForever } from '@nzyme/utils';

import { DevServer } from '@superadmin/devkit';

import { loadProject } from '../utils/loadProject.js';

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
        const container = await loadProject();

        const devServer = await container.resolve(DevServer);
        await devServer.start();
        await waitForever();
    }
}
