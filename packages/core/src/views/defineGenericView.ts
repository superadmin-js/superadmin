import { MODULE_SYMBOL } from '../defineModule.js';

export interface GenericViewOptions {
    name: string;
}

export const GENERIC_VIEW_SYMBOL = Symbol('view');

export interface GenericView {
    [MODULE_SYMBOL]: typeof GENERIC_VIEW_SYMBOL;
    name: string;
    symbol: symbol;
}

export function defineGenericView(template: GenericViewOptions): GenericView {
    return {
        [MODULE_SYMBOL]: GENERIC_VIEW_SYMBOL,
        name: template.name,
        symbol: Symbol(template.name),
    };
}
