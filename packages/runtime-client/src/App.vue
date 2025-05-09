<script lang="ts" setup>
import { ModalHost } from '@nzyme/vue';
import { useService } from '@nzyme/vue-ioc';
import { onWindowEvent } from '@nzyme/vue-utils';
import Toast from 'primevue/toast';
import { RouterView, useRoute } from 'vue-router';

import { ErrorEvent, ToastService } from '@superadmin/client';

import MenuHost from './components/MenuHost.vue';

const route = useRoute();
const toastService = useService(ToastService);

onWindowEvent('superadmin-error', event => {
  if (event instanceof ErrorEvent) {
    toastService.add({
      summary: event.title,
      detail: event.message,
      severity: 'error',
      life: 5000,
    });
  }
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <div class="flex flex-1 flex-col">
          <component
            :is="Component"
            :key="route.path"
          />
        </div>
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </RouterView>

  <Toast position="top-center" />

  <MenuHost />
  <ModalHost>
    <template #default="modals">
      <Suspense>
        <component
          :is="modal.component"
          v-for="modal in modals"
          :key="modal.id"
        />
      </Suspense>
    </template>
  </ModalHost>
</template>
