<script lang="ts" setup>
import logo from '@logo';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { RouterView, useRoute } from 'vue-router';

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
      <img
        :src="logo"
        alt="Logo"
        class="h-full max-h-24 self-start p-6"
      />

      Navigation
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
</template>

<style lang="scss" module="css">
.layout {
  height: 100vh;
  border: none;
  border-radius: 0;
  --p-splitter-gutter-background: transparent;
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
