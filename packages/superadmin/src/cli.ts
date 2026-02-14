#!/usr/bin/env node --enable-source-maps

import { execute } from '@nzyme/cli/execute.js';
import { initialize } from '@nzyme/cli/initialize.js';
import { loadEnvVariables } from '@nzyme/project-utils/loadEnvVariables.js';
import { BuildCommand } from './commands/BuildCommand.js';
import { DevCommand } from './commands/DevCommand.js';

loadEnvVariables();
initialize();

await execute({
    name: 'superadmin',
    commands: [DevCommand, BuildCommand],
});
