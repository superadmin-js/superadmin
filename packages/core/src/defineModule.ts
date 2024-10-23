import type { Container } from '@nzyme/ioc';

export const MODULE_SYMBOL = Symbol('module');

export type ModuleInput = {
    (container: Container): void | Promise<void>;
};

export interface Module {
    install(container: Container): void | Promise<void>;
    readonly [MODULE_SYMBOL]: true | symbol;
}

/*#__NO_SIDE_EFFECTS__*/
export function defineModule(module: ModuleInput): Module {
    return Object.freeze<Module>({
        install: module,
        [MODULE_SYMBOL]: true,
    });
}

export function isModule(value: unknown): value is Module {
    return (value as Module | undefined)?.[MODULE_SYMBOL] != null;
}
