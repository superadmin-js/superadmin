import type { Action } from '@superadmin/schema';

export interface ActionButton {
    action: Action;
    label?: string;
    icon?: string;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';
    style?: 'outline' | 'link';
}
