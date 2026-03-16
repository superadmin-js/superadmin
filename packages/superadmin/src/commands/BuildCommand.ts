import { Command } from '@nzyme/cli/Command.js';

import { ProjectBuilder } from '@superadmin/devkit/services/ProjectBuilder.js';

import { loadProject } from '../utils/loadProject.js';

/** CLI command that builds the frontend and backend for production deployment. */
export class BuildCommand extends Command {
    static override paths = [['build']];
    static override usage = Command.Usage({
        description: 'Build the frontend (Vite) and backend (Rollup) for production',
    });

    /** Executes the production build process. */
    async run() {
        const container = await loadProject();

        // Prepare runtime (client/server modules) and build
        const builder = container.resolve(ProjectBuilder);
        await builder.build();

        console.info('Build completed successfully!');

        // Explicitly exit because build tooling (Vite, Rollup, debounced generators)
        // may leave handles open that prevent the process from exiting naturally.
        process.exit(0);
    }
}
