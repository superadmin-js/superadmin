/** Options for defining a component's props and events shape. */
export type ComponentOptions = {
    /** Map of event names to their argument tuples. */
    events?: Record<string, unknown[]>;
    /** Map of prop names to their types. */
    props: Record<string, unknown>;
};

/** A framework-agnostic component definition identified by a unique symbol key. */
export interface Component<
    TProps extends Record<string, unknown> = Record<string, unknown>,
    TEvents extends Record<string, unknown[]> = Record<string, unknown[]>,
> {
    /** The component's props type (used for type inference, not at runtime). */
    $props: TProps;
    /** The component's events type (used for type inference, not at runtime). */
    $events: TEvents;
    /** Unique symbol key identifying this component definition. */
    readonly key: symbol;
}

/** A component with unconstrained props and events, used when the exact shape is unknown. */
export type ComponentAny = Component<Record<string, unknown>, Record<string, unknown[]>>;

/** Creates a component definition with fully specified Component type. */
export function defineComponent<TComponent extends ComponentAny>(): TComponent;
/** Creates a component definition from a ComponentOptions shape. */
export function defineComponent<TComponent extends ComponentOptions>(): Component<
    TComponent['props'],
    Exclude<TComponent['events'], undefined>
>;
/** Creates a frozen component definition identified by a unique symbol. */
export function defineComponent() {
    const component = Object.freeze({
        key: Symbol(),
    });

    return component;
}
