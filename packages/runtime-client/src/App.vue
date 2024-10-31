<script lang="ts" setup>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Toast from 'primevue/toast';
import { RouterView, useRoute } from 'vue-router';

import { ModalHost } from '@nzyme/vue';

import MenuHost from './components/MenuHost.vue';

const route = useRoute();
const stateKey = 'superadmin.layout';
</script>

<template>
    <Splitter
        :class="css.layout"
        layout="horizontal"
        state-storage="local"
        :state-key="stateKey"
    >
        <SplitterPanel
            :size="20"
            :class="css.panel"
        >
            <!-- <MainMenu :class="css.menu" /> -->
        </SplitterPanel>
        <SplitterPanel
            :size="80"
            :class="css.panel"
        >
            <RouterView v-slot="{ Component }">
                <Suspense>
                    <template #default>
                        <div :class="css.main">
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
        </SplitterPanel>
    </Splitter>

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

<style lang="scss" module="css">
.layout {
    height: 100vh;
    border: none;
    border-radius: 0;
    --p-splitter-gutter-background: transparent;

    // :global .p-splitter-gutter-handle {
    //     visibility: hidden;
    // }
}

.menu {
    position: sticky;
    top: 0;
}

.panel {
    display: flex;
    flex-direction: column;
}

.main {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    min-height: 100vh;
}
</style>
