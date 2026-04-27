import type { Container } from '@nzyme/ioc/Container.js';
import { writable } from '@nzyme/utils/writable.js';
import debug from 'debug';

/** Symbol used to identify values as submodules in the module system. */
export const MODULE_SYMBOL = Symbol('module');

const MODULE_INIT = Symbol('moduleInit');
const MODULE_INSTALL = Symbol('moduleInstall');
const log = debug('superadmin:core');

/** A registerable unit in the superadmin module system with lifecycle hooks. */
export interface Submodule {
    /** Unique identifier assigned during initialization. */
    readonly id: string;
    /** Module type discriminant, or `true` for untyped submodules. */
    readonly [MODULE_SYMBOL]: symbol | true;
    /** Called during module tree initialization to set up the submodule and optionally return nested submodules. */
    [MODULE_INIT]?(this: Submodule, id: string): Record<string, Submodule> | void;
    /** Called during installation into a DI container, optionally returning nested submodules to install. */
    [MODULE_INSTALL]?(this: Submodule, container: Container): Record<string, Submodule> | void;
}

interface SubmoduleOptions {
    init?(id: string): Record<string, Submodule> | void;
    install?(container: Container): Record<string, Submodule> | void;
}

type SubmoduleOptionsFor<TModule extends Submodule = Submodule> = {
    [K in Exclude<keyof TModule, keyof Submodule>]: TModule[K];
} & {
    init?(this: TModule, id: string): Record<string, Submodule> | void;
    install?(this: TModule, container: Container): Record<string, Submodule> | void;
};

/**
 * Creates a submodule from plain options.
 * @__NO_SIDE_EFFECTS__
 */
export function defineSubmodule<TModule extends SubmoduleOptions>(module: TModule): Submodule & TModule;
/**
 * Creates a typed submodule from options matching the target interface.
 * @__NO_SIDE_EFFECTS__
 */
export function defineSubmodule<TModule extends Submodule>(module: SubmoduleOptionsFor<TModule>): TModule;
/**
 * Creates a typed submodule with an explicit type discriminant symbol.
 * @__NO_SIDE_EFFECTS__
 */
export function defineSubmodule<TModule extends Submodule>(type: symbol, module: SubmoduleOptionsFor<TModule>): TModule;
/**
 * Creates a submodule object with lifecycle hooks for initialization and DI installation.
 * @__NO_SIDE_EFFECTS__
 */
export function defineSubmodule(typeOrModule: symbol | SubmoduleOptionsFor, module?: SubmoduleOptionsFor): Submodule {
    let type: symbol | true;

    if (typeof typeOrModule === 'symbol') {
        type = typeOrModule;
        module = module!;
    } else {
        type = true;
        module = typeOrModule;
    }

    const submodule: Submodule = {
        id: '',
        ...module,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [MODULE_INIT]: module.init,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [MODULE_INSTALL]: module.install,
        [MODULE_SYMBOL]: type,
    };

    return submodule;
}

/** Type guard that checks whether a value is a submodule, optionally of a specific type. */
export function isSubmodule(value: unknown, type?: symbol): value is Submodule {
    if (value == null) {
        return false;
    }

    if (type != null) {
        return (value as Submodule)[MODULE_SYMBOL] === type;
    }

    return (value as Submodule)[MODULE_SYMBOL] != null;
}

/** Assigns an ID to a submodule and runs its init hook. Returns any nested submodules. */
export function initializeSubmodule(submodule: Submodule, id: string) {
    log('Initializing submodule: %s', id);
    writable(submodule).id = id;

    const init = submodule[MODULE_INIT];
    const submodules = init?.call(submodule, id);

    Object.freeze(submodule);

    return submodules;
}

/** Installs a submodule into a DI container and runs its install hook. Returns any nested submodules. */
export function installSubmodule(submodule: Submodule, container: Container) {
    log('Installing submodule: %s', submodule.id);
    const install = submodule[MODULE_INSTALL];
    const submodules = install?.call(submodule, container);

    Object.freeze(submodule);

    return submodules;
}
