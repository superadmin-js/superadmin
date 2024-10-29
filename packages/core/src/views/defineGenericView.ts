export interface GenericViewOptions {
    name: string;
}

export const GENERIC_VIEW_SYMBOL = Symbol('view');

export interface GenericView {
    name: string;
    symbol: symbol;
}

export function defineGenericView(template: GenericViewOptions): GenericView {
    return {
        name: template.name,
        symbol: Symbol(template.name),
    };
}
