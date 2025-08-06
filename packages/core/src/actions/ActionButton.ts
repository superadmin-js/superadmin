import * as s from '@superadmin/schema';

/**
 *
 */
export type ActionButton = s.Infer<typeof ActionButton>;
/**
 *
 */
export const ActionButton = s.object({
    action: s.action({ optional: true }),
    label: s.string({ optional: true }),
    icon: s.string({ optional: true }),
    color: s.enum({
        values: ['primary', 'secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'],
        optional: true,
    }),
    style: s.enum({
        values: ['outline', 'link'],
        optional: true,
    }),
});
