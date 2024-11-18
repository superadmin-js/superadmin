import type { Container } from '@nzyme/ioc';

export const MODULE_SYMBOL = Symbol('module');

export type ModuleBase = {
    install(container: Container): void;
};

export interface Module extends ModuleBase {
    readonly [MODULE_SYMBOL]: symbol | true;
}

type ModuleOptions<TModule extends ModuleBase> = {
    install(this: TModule, container: Container): void;
} & {
    [K in keyof TModule as K extends typeof MODULE_SYMBOL ? never : K]: TModule[K];
};

/*#__NO_SIDE_EFFECTS__*/
export function defineModule<TModule extends ModuleBase>(module: TModule): TModule & Module;
/*#__NO_SIDE_EFFECTS__*/
export function defineModule<TModule extends Module>(
    type: symbol,
    module: ModuleOptions<TModule>,
): TModule;
/*#__NO_SIDE_EFFECTS__*/
export function defineModule(typeOrModule: symbol | ModuleBase, module?: ModuleBase) {
    let type: symbol | true;

    if (typeof typeOrModule === 'symbol') {
        type = typeOrModule;
    } else {
        type = true;
        module = typeOrModule;
    }

    return Object.freeze({
        ...module,
        [MODULE_SYMBOL]: type,
    });
}

export function isModule(value: unknown, type?: symbol): value is Module {
    if (value == null) {
        return false;
    }

    if (type != null) {
        return (value as Module)[MODULE_SYMBOL] === type;
    }

    return (value as Module)[MODULE_SYMBOL] != null;
}
