import type { Action } from '@superadmin/schema';

export interface ActionButton {
    action: Action;
    label?: string;
    icon?: string;
    style?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';
    outlined?: boolean;
}
