#!/usr/bin/env node --enable-source-maps

import { execute, initialize } from '@nzyme/cli';

import { DevCommand } from './commands/DevCommand.js';

initialize();

await execute({
    name: 'superadmin',
    commands: [DevCommand],
});
