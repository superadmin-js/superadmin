import { Command } from '@nzyme/cli';

import { ProjectBuilder } from '@superadmin/devkit';

import { loadProject } from '../utils/loadProject.js';

/**
 *
 */
export class BuildCommand extends Command {
    static override paths = [['build']];
    static override usage = Command.Usage({
        description: 'Build the frontend (Vite) and backend (Rollup) for production',
    });

    /**
     *
     */
    async run() {
        const container = await loadProject();

        // Prepare runtime (client/server modules) and build
        const builder = container.resolve(ProjectBuilder);
        await builder.build();

        console.info('Build completed successfully!');
    }
}
