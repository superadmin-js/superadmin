<script lang="ts" setup>
import { useService } from '@nzyme/vue-ioc/useService.js';
import type { MenuItem } from 'primevue/menuitem';
import PanelMenu from 'primevue/panelmenu';
import vRipple from 'primevue/ripple';
import { computed } from 'vue';

import { ActionDispatcher } from '@superadmin/client/actions/ActionDispatcher.js';
import { getViewRoute } from '@superadmin/client/views/getViewRoute.js';
import { ViewRegistry } from '@superadmin/core/views/ViewRegistry.js';
import type { Navigation, NavigationItem } from '@superadmin/core/navigation/defineNavigation.js';
import { goToViewAction } from '@superadmin/core/module';
import Icon from '@superadmin/ui/Icon.vue';

const props = defineProps<{
  navigation: Navigation;
}>();

const viewRegistry = useService(ViewRegistry);
const actionDispatcher = useService(ActionDispatcher);

const menuItems = computed(() => {
  return props.navigation.items.map(mapMenuItem);
});

function mapMenuItem(item: NavigationItem): MenuItem {
  const menuItem: MenuItem = {
    label: item.title,
    icon: item.icon,
    children: item.children?.map(mapMenuItem),
  };

  const action = item.action;
  if (!action) {
    return menuItem;
  }

  if (isAction(goToViewAction, action)) {
    const view = viewRegistry.getById(action.params.view);
    if (!view) {
      return menuItem;
    }

    menuItem.route = getViewRoute(view, action.params.params);
  } else if (action) {
    menuItem.command = event => void actionDispatcher(action, { event: event.originalEvent });
  }

  return menuItem;
}
</script>

<template>
  <PanelMenu :model="menuItems">
    <template #item="{ item, props: { action } }">
      <router-link
        v-if="item.route"
        v-slot="{ href, navigate, isActive }"
        :to="item.route"
        custom
      >
        <a
          v-ripple
          class="text-surface-700 dark:text-surface-0 flex cursor-pointer items-center px-4 py-2"
          :href="href"
          :class="{ 'bg-primary-50 text-primary-700!': isActive }"
          @click="navigate"
        >
          <Icon
            v-if="item.icon"
            :icon="item.icon"
          />

          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <button
        v-else
        v-ripple
        class="text-surface-700 dark:text-surface-0 flex cursor-pointer items-center px-4 py-2"
        v-bind="action"
      >
        <Icon
          v-if="item.icon"
          :icon="item.icon"
        />
        <span class="ml-2">{{ item.label }}</span>
        <span
          v-if="item.items"
          class="pi pi-angle-down text-primary ml-auto"
        />
      </button>
    </template>
  </PanelMenu>
</template>

<style lang="css">
/* .p-panelmenu {
  @apply bg-transparent;
}

.p-panelmenu .p-panelmenu-header-link {
  @apply flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100;
}

.p-panelmenu .p-panelmenu-content {
  @apply border-none bg-transparent;
}

.p-panelmenu .p-menuitem-link {
  @apply flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100;
}

.p-panelmenu .p-menuitem-icon {
  @apply text-gray-500;
}

.p-panelmenu .p-menuitem-text {
  @apply text-sm;
}

.p-panelmenu .p-submenu-list {
  @apply pl-4;
} */
</style>
