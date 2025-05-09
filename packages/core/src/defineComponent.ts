/**
 *
 */
export type ComponentOptions = {
    /**
     *
     */
    events?: Record<string, unknown[]>;
    /**
     *
     */
    props: Record<string, unknown>;
};

/**
 *
 */
export interface Component<
    TProps extends Record<string, unknown> = Record<string, unknown>,
    TEvents extends Record<string, unknown[]> = Record<string, unknown[]>,
> {
    /**
     *
     */
    $props: TProps;
    /**
     *
     */
    $events: TEvents;
    /**
     *
     */
    readonly key: symbol;
}

/**
 *
 */
export type ComponentAny = Component<any, any>;

/**
 *
 */
export function defineComponent<TComponent extends ComponentAny>(): TComponent;
/**
 *
 */
export function defineComponent<TComponent extends ComponentOptions>(): Component<
    TComponent['props'],
    Exclude<TComponent['events'], undefined>
>;
/**
 *
 */
export function defineComponent() {
    const component = Object.freeze({
        key: Symbol(),
    });

    return component;
}
