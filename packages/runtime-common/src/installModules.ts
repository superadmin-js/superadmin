import type { Container } from '@nzyme/ioc/Container.js';

import type { Submodule } from '@superadmin/core/defineSubmodule.js';
import { isSubmodule } from '@superadmin/core/defineSubmodule.js';
import { initializeSubmodule, installSubmodule } from '@superadmin/core/internal';

import type { RuntimeModules } from './RuntimeModules.js';

/**
 *
 */
export function installModules(container: Container, modules: RuntimeModules) {
    const rootSubmodules: Submodule[] = [];
    const childSubmodules: {
        id: string;
        submodule: Submodule;
    }[] = [];

    for (const [moduleName, module] of Object.entries(modules)) {
        for (const [submoduleName, submodule] of Object.entries(module)) {
            if (!isSubmodule(submodule)) {
                continue;
            }

            if (submodule.id) {
                continue;
            }

            const id = `${moduleName}:${submoduleName}`;

            rootSubmodules.push(submodule);
            const children = initializeSubmodule(submodule, id);

            processChildren(id, children, (childId, child) => {
                childSubmodules.push({ id: childId, submodule: child });
            });
        }
    }

    for (let i = 0; i < childSubmodules.length; i++) {
        const { id, submodule } = childSubmodules[i]!;
        if (submodule.id) {
            continue;
        }

        const children = initializeSubmodule(submodule, id);

        processChildren(id, children, (childId, child) => {
            childSubmodules.push({ id: childId, submodule: child });
        });
    }

    for (const submodule of rootSubmodules) {
        const children = installSubmodule(submodule, container);
        processChildren(submodule.id, children, (childId, child) => {
            childSubmodules.push({ id: childId, submodule: child });
            return initializeSubmodule(child, childId);
        });
    }

    for (let i = 0; i < childSubmodules.length; i++) {
        const { id, submodule } = childSubmodules[i]!;
        const children = installSubmodule(submodule, container);

        processChildren(id, children, (childId, child) => {
            childSubmodules.push({ id: childId, submodule: child });
            return initializeSubmodule(child, childId);
        });
    }
}

function processChildren(
    parentId: string,
    children: Record<string, Submodule> | undefined | void,
    callback: (id: string, submodule: Submodule) => Record<string, Submodule> | undefined | void,
) {
    if (!children) {
        return;
    }

    for (const [key, child] of Object.entries(children)) {
        const id = `${parentId}:${key}`;
        const children = callback(id, child);
        if (children) {
            processChildren(id, children, callback);
        }
    }
}
