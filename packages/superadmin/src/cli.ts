#!/usr/bin/env node --enable-source-maps

import { execute, initialize } from '@nzyme/cli';
import { loadEnvVariables } from '@nzyme/project-utils';
import { register as registerTsNode } from 'ts-node';

import { BuildCommand } from './commands/BuildCommand.js';
import { DevCommand } from './commands/DevCommand.js';

registerTsNode({ esm: true });
loadEnvVariables();
initialize();

await execute({
    name: 'superadmin',
    commands: [DevCommand, BuildCommand],
});
