import { Option } from '@nzyme/cli';
import { Command } from '@nzyme/cli/Command.js';

import { ProjectBuilder } from '@superadmin/devkit/services/ProjectBuilder.js';

import { loadProject } from '../utils/loadProject.js';

/**
 * Command to build the Superadmin project.
 */
export class BuildCommand extends Command {
    static override paths = [['build']];
    static override usage = Command.Usage({
        description: 'Build the frontend (Vite) and backend (Rollup) for production',
    });

    config = Option.String({
        name: '--config,-c',
        required: false,
    });

    /** Executes the build command. */
    async run() {
        const container = await loadProject({
            configFile: this.config,
        });

        // Prepare runtime (client/server modules) and build
        const builder = container.resolve(ProjectBuilder);
        await builder.build();

        console.info('Build completed successfully!');

        // Explicitly exit because build tooling (Vite, Rollup, debounced generators)
        // may leave handles open that prevent the process from exiting naturally.
        process.exit(0);
    }
}
