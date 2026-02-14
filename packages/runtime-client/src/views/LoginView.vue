<script lang="ts" setup>
import logo from '@logo';
import { useService } from '@nzyme/vue-ioc/useService.js';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ActionDispatcher } from '@superadmin/client/actions/ActionDispatcher.js';
import { useViewProps } from '@superadmin/client/actions/useViewProps.js';
import type { LoginView } from '@superadmin/core/auth/defineLoginView.js';
import { coerce, validate } from '@superadmin/schema';
import { default as Editor } from '@superadmin/ui/Editor.vue';
import type { ValidationErrors } from '@superadmin/validation';

const props = defineProps({
  ...useViewProps<LoginView>(),
});

const router = useRouter();

const actionDispatcher = useService(ActionDispatcher);

const model = ref(props.view.config.form ? coerce(props.view.config.form) : undefined);
const errors = ref<ValidationErrors | null>();

async function submit() {
  if (!props.view.config.form) {
    return;
  }

  errors.value = validate(props.view.config.form, model.value);
  if (errors.value) {
    return;
  }

  const action = props.view.actions.submit(model.value);
  await actionDispatcher(action);

  const redirect = router.currentRoute.value.query.redirect;
  if (redirect) {
    await router.replace(redirect as string);
  }
}
</script>

<template>
  <div
    class="bg-surface-50 dark:bg-surface-950 flex flex-1 flex-col items-center justify-center bg-gray-100 px-6 py-20 md:px-12 lg:px-20"
  >
    <div
      class="bg-surface-0 dark:bg-surface-900 mb-[30%] w-full max-w-xl rounded-2xl bg-white p-10 shadow-lg"
    >
      <div class="mb-8 flex flex-col items-center">
        <img
          :src="logo"
          alt="Logo"
          class="h-full max-h-24 w-full p-6"
        />
      </div>

      <form
        v-if="view.config.form"
        class="flex flex-col gap-4"
        @submit.prevent="submit"
      >
        <Editor
          v-model="model"
          :schema="view.config.form"
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
