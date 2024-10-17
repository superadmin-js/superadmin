import { Container } from '@nzyme/ioc';

const moduleSymbol = Symbol('module');

export type ModuleInput = {
    (container: Container): void | Promise<void>;
};

export type Module = ModuleInput & { [moduleSymbol]: true };

/*#__NO_SIDE_EFFECTS__*/
export function defineModule(module: ModuleInput) {
    const moduleBranded = module as Module;
    moduleBranded[moduleSymbol] = true;

    return moduleBranded;
}

export function isModule(value: unknown): value is Module {
    return typeof value === 'function' && !!(value as Module)[moduleSymbol];
}
