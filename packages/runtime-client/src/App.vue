<script lang="ts" setup>
import Toast from 'primevue/toast';
import { RouterView, useRoute } from 'vue-router';

import { ModalHost } from '@nzyme/vue';

import MenuHost from './components/MenuHost.vue';

const route = useRoute();
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
