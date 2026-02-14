import type { Component } from '@nzyme/vue-utils/component.js';

/**
 *
 */
export type ViewLayoutSlots = {
    /**
     *
     */
    header: undefined;
    /**
     *
     */
    body: undefined;
    /**
     *
     */
    footer: undefined;
};

/**
 *
 */
export type ViewLayout = Component<{}, ViewLayoutSlots>;
