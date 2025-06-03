import { sep } from 'path';

import { resolveModulePath } from '@nzyme/project-utils';

/**
 *
 */
export function normalizePath(path: string) {
    if (isRelative(path)) {
        return path;
    }

    return resolveModulePath(path, import.meta);
}

function isRelative(path: string) {
    return (
        path.startsWith('./') ||
        path.startsWith('../') ||
        path.startsWith(`.${sep}`) ||
        path.startsWith(`..${sep}`)
    );
}
