<script lang="ts" setup>
import Button from 'primevue/button';
import { ref } from 'vue';

import { ModalContext, useService } from '@nzyme/vue';
import { injectContext } from '@nzyme/vue-utils';
import { ActionDispatcher, useViewProps } from '@superadmin/client';
import type { FormView } from '@superadmin/core';
import { validate } from '@superadmin/schema';
import type { ValidationErrors } from '@superadmin/validation';

import Editor from '../components/Editor.vue';

const props = defineProps({
    ...useViewProps<FormView>(),
});

const actionDispatcher = useService(ActionDispatcher);
const modal = injectContext(ModalContext, { optional: true });

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
    modal?.close();
}
</script>

<template>
    <component :is="layout">
        <template #body>
            <form
                class="flex flex-col gap-4"
                @submit.prevent="submit"
            >
                <Editor
                    v-model="model"
                    :schema="view.schema"
                    :errors="errors"
                    path=""
                />
            </form>
        </template>

        <template #footer>
            <template v-if="modal">
                <Button
                    v-if="modal"
                    label="Cancel"
                    severity="secondary"
                    size="large"
                    class="flex-1"
                    @click="modal.close"
                />

                <Button
                    label="Submit"
                    size="large"
                    class="flex-1"
                    @click="submit"
                />
            </template>

            <Button
                v-else
                label="Submit"
                size="large"
                @click="submit"
            />
        </template>
    </component>
</template>
