<script lang="ts" setup>
import Button from 'primevue/button';
import Message from 'primevue/message';
import { ref } from 'vue';

import { ModalContext, useService } from '@nzyme/vue';
import { injectContext } from '@nzyme/vue-utils';
import { ActionDispatcher, useViewProps } from '@superadmin/client';
import { ApplicationError, type FormView } from '@superadmin/core';
import { validate } from '@superadmin/schema';
import { Editor } from '@superadmin/ui';
import { ValidationError, type ValidationErrors } from '@superadmin/validation';

const props = defineProps({
    ...useViewProps<FormView>(),
});

const actionDispatcher = useService(ActionDispatcher);
const modal = injectContext(ModalContext, { optional: true });

const model = ref<unknown>();
const validation = ref<ValidationErrors | null>();
const error = ref<string | null>(null);

model.value = await actionDispatcher(props.view.actions.fetch(props.params));

async function submit(e: Event) {
    validation.value = validate(props.view.schema, model.value);
    if (validation.value) {
        return;
    }

    try {
        const action = props.view.actions.submit(model.value);
        await actionDispatcher(action, e);
        modal?.done(null);
    } catch (e) {
        if (e instanceof ApplicationError) {
            error.value = e.message;
            return;
        }

        if (e instanceof ValidationError) {
            validation.value = e.errors;
            return;
        }

        throw e;
    }
}
</script>

<template>
    <component :is="layout">
        <template #body>
            <form
                class="mt-1 flex flex-col gap-4"
                @submit.prevent="submit"
            >
                <Message
                    v-if="error"
                    severity="error"
                >
                    {{ error }}
                </Message>

                <Editor
                    v-model="model"
                    :schema="view.schema"
                    :errors="validation"
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
