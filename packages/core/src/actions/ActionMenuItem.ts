import type { Action } from '@superadmin/schema';

export interface ActionMenuItem {
    action: Action;
    label?: string;
    icon?: string;
}
