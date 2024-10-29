<script lang="ts" setup>
import Button from 'primevue/button';
import { ref } from 'vue';

import { useService } from '@nzyme/vue';
import { ActionDispatcher, useViewProps } from '@superadmin/client';
import type { FormView } from '@superadmin/core';
import { validate } from '@superadmin/schema';
import type { ValidationErrors } from '@superadmin/validation';

import Editor from '../components/Editor.vue';

const props = defineProps({
    ...useViewProps<FormView>(),
});

const actionDispatcher = useService(ActionDispatcher);
const model = ref<unknown>();
const errors = ref<ValidationErrors | null>();

model.value = await actionDispatcher(props.view.actions.fetch(props.params));

async function submit() {
    errors.value = validate(props.view.schema, model.value);
    if (errors.value) {
        return;
    }

    const action = props.view.actions.submit(model.value);
    await actionDispatcher(action);
}
</script>

<template>
    <form
        class="flex flex-col gap-4 p-6"
        @submit.prevent="submit"
    >
        <h1>Form</h1>

        <Editor
            v-model="model"
            :schema="props.view.schema"
            :errors="errors"
            path=""
        />

        <Button
            label="Submit"
            size="large"
            type="submit"
        />
    </form>
</template>
