import type * as s from '@superadmin/schema';
import type { Action } from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { Submodule } from '../defineSubmodule.js';
import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import { NavigationRegistry } from './NavigationRegistry.js';

const NAVIGATION_SYMBOL = Symbol('navigation');

/**
 * Represents a single menu item in the navigation
 */
export interface NavigationItem {
    /**
     * Display title of the menu item
     */
    title: string;

    /**
     * Icon for the menu item
     */
    icon?: string;

    /**
     * Action to be executed when menu item is clicked
     */
    action?: Action<s.Schema<void>, s.Schema<unknown>>;

    /**
     * Optional nested menu items
     */
    children?: NavigationItem[];
}

/**
 * Options for defining a navigation group
 */
export interface NavigationOptions {
    /**
     * Title of the navigation group
     */
    title?: string;

    /**
     * Menu items in this navigation group
     */
    items: NavigationItem[];

    /**
     * Display order of the navigation group (lower numbers appear first)
     */
    order?: number;
}

/**
 * Represents a navigation group with menu items
 */
export interface Navigation extends Submodule {
    /**
     * Title of the navigation group
     */
    title: string;

    /**
     * Menu items in this navigation group
     */
    items: NavigationItem[];

    /**
     * Display order of the navigation group
     */
    order: number;
}

/**
 * Creates a new navigation definition
 * @__NO_SIDE_EFFECTS__
 */
export function defineNavigation(navigation: NavigationOptions): Navigation {
    return defineSubmodule<Navigation>(NAVIGATION_SYMBOL, {
        title: navigation.title ?? '',
        items: navigation.items,
        order: navigation.order ?? 0,

        init(id) {
            if (!this.title) {
                this.title = prettifyName(id, ':');
            }
        },

        install(container) {
            container.resolve(NavigationRegistry).register(this);
        },
    });
}

/**
 * Checks if a value is a Navigation instance
 */
export function isNavigation(value: unknown): value is Navigation {
    return isSubmodule(value, NAVIGATION_SYMBOL);
}
