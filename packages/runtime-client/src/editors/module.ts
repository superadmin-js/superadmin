import { defineEditor } from '@superadmin/client';
import * as s from '@superadmin/schema';

import ObjectEditor from './ObjectEditor.vue';
import StringEditor from './StringEditor.vue';

export const stringEditor = defineEditor({
    schema: s.string,
    component: StringEditor,
});

export const objectEditor = defineEditor({
    schema: s.object,
    component: ObjectEditor,
});
