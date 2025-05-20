#!/usr/bin/env node --enable-source-maps

import { execute, initialize } from '@nzyme/cli';

import { BuildCommand } from './commands/BuildCommand.js';
import { DevCommand } from './commands/DevCommand.js';

initialize();

await execute({
    name: 'superadmin',
    commands: [DevCommand, BuildCommand],
});
