import { defineEditor } from '@superadmin/client';
import * as s from '@superadmin/schema';
import { IntegerEditor, ObjectEditor, StringEditor } from '@superadmin/ui';

export const stringEditor = defineEditor({
    schema: s.string,
    component: StringEditor,
});

export const objectEditor = defineEditor({
    schema: s.object,
    component: ObjectEditor,
});

export const integerEditor = defineEditor({
    schema: s.integer,
    component: IntegerEditor,
});
