<script lang="ts" setup>
import logo from '@logo';
import Button from 'primevue/button';
import { ref } from 'vue';

import { useViewProps } from '@superadmin/client';
import type { LoginView } from '@superadmin/core';
import { coerce, validate } from '@superadmin/schema';
import type { ValidationErrors } from '@superadmin/validation';

import Editor from '../components/Editor.vue';

const props = defineProps({
    ...useViewProps<LoginView>(),
});

const model = ref(props.view.form ? coerce(props.view.form) : undefined);
const errors = ref<ValidationErrors | null>();

function submit() {
    if (!props.view.form) {
        return;
    }

    errors.value = validate(props.view.form, model.value);
    if (errors.value) {
        return;
    }
}
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex flex-1 flex-col items-center justify-center bg-gray-100 px-6 py-20 md:px-12 lg:px-20"
    >
        <div
            class="bg-surface-0 dark:bg-surface-900 mb-[30%] w-full rounded-2xl bg-white p-10 shadow-lg lg:w-1/3"
        >
            <div class="mb-8 flex flex-col items-center">
                <img
                    :src="logo"
                    alt="Logo"
                    class="h-full max-h-24 p-6"
                />
            </div>

            <form
                v-if="view.form"
                class="flex flex-col gap-4"
                @submit.prevent="submit"
            >
                <Editor
                    v-model="model"
                    :schema="view.form"
                    :errors="errors"
                    path=""
                />

                <Button
                    label="Sign In"
                    icon="pi pi-user"
                    class="w-full"
                    type="submit"
                />
            </form>
        </div>
    </div>
</template>
