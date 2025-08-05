import { createRequire } from 'module';
import { resolve, sep } from 'path';

/**
 *
 */
export function normalizePath(path: string, cwd: string) {
    if (isRelative(path)) {
        return resolve(cwd, path);
    }

    const url = new URL(`file://${cwd}`);
    const require = createRequire(url);

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
