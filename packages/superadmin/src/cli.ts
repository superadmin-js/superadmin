#!/usr/bin/env node --enable-source-maps

import { execute, initialize } from '@nzyme/cli';
import { loadEnvVariables } from '@nzyme/project-utils';

import { BuildCommand } from './commands/BuildCommand.js';
import { DevCommand } from './commands/DevCommand.js';

loadEnvVariables();
initialize();

await execute({
    name: 'superadmin',
    commands: [DevCommand, BuildCommand],
});
