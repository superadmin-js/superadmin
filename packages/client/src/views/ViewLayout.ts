import type { Component } from '@nzyme/vue-utils/component.js';

/** Named slots available in a view layout component. */
export type ViewLayoutSlots = {
    /** Slot for the view header content. */
    header: undefined;
    /** Slot for the main view body content. */
    body: undefined;
    /** Slot for the view footer content. */
    footer: undefined;
};

/** Vue component type that provides the structural layout for views with header, body, and footer slots. */
export type ViewLayout = Component<object, ViewLayoutSlots>;
