import { defineEditor } from '@superadmin/client';
import * as s from '@superadmin/schema';
import {
    BooleanEditor,
    IntegerEditor,
    ObjectEditor,
    PasswordEditor,
    StringEditor,
} from '@superadmin/ui';

export const booleanEditor = defineEditor({
    schema: s.boolean,
    component: BooleanEditor,
});

export const stringEditor = defineEditor({
    schema: s.string,
    component: StringEditor,
});

export const passwordEditor = defineEditor({
    schema: s.password,
    component: PasswordEditor,
});
export const objectEditor = defineEditor({
    schema: s.object,
    component: ObjectEditor,
});

export const integerEditor = defineEditor({
    schema: s.integer,
    component: IntegerEditor,
});
