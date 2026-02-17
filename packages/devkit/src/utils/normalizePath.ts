import { createRequire } from 'module';
import { join, resolve, sep } from 'path';

/**
 *
 */
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
