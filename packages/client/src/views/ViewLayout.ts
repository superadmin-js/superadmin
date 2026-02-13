import type { Component } from '@nzyme/vue-utils/component.js';

export type ViewLayoutSlots = {
    header: undefined;
    body: undefined;
    footer: undefined;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ViewLayout = Component<{}, ViewLayoutSlots>;
