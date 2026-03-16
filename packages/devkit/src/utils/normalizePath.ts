import { createRequire } from 'module';
import { join, resolve, sep } from 'path';

/** Resolves a path to an absolute path, treating relative paths against cwd and package paths via require.resolve. */
export function normalizePath(path: string, cwd: string) {
    if (isRelative(path)) {
        return resolve(cwd, path);
    }

    const require = createRequire(join(cwd, 'noop.js'));

    return require.resolve(path);
}

function isRelative(path: string) {
    return (
        path === '.' ||
        path === '..' ||
        path.startsWith('./') ||
        path.startsWith('../') ||
        path.startsWith(`.${sep}`) ||
        path.startsWith(`..${sep}`)
    );
}
