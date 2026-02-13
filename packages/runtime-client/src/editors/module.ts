import { defineEditor } from '@superadmin/client/editors/defineEditor.js';
import * as s from '@superadmin/schema';
import BooleanEditor from '@superadmin/ui/editors/BooleanEditor.vue';
import EnumEditor from '@superadmin/ui/editors/EnumEditor.vue';
import IntegerEditor from '@superadmin/ui/editors/IntegerEditor.vue';
import NumberEditor from '@superadmin/ui/editors/NumberEditor.vue';
import ObjectEditor from '@superadmin/ui/editors/ObjectEditor.vue';
import ObjectUnionEditor from '@superadmin/ui/editors/ObjectUnionEditor.vue';
import PasswordEditor from '@superadmin/ui/editors/PasswordEditor.vue';
import StringEditor from '@superadmin/ui/editors/StringEditor.vue';

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

export const numberEditor = defineEditor({
    schema: s.number,
    component: NumberEditor,
});

export const enumEditor = defineEditor({
    schema: s.enum,
    component: EnumEditor,
});

export const objectUnionEditor = defineEditor({
    schema: s.objectUnion,
    component: ObjectUnionEditor,
});
