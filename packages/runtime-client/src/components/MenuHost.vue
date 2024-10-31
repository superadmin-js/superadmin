<script lang="ts" setup>
import type { MenuMethods } from 'primevue/menu';
import Menu from 'primevue/menu';
import type { MenuItem as PrimeVueMenuItem } from 'primevue/menuitem';
import vRipple from 'primevue/ripple';
import type { ComponentPublicInstance } from 'vue';
import { ref } from 'vue';

import { mapNotNull } from '@nzyme/utils';
import { useService } from '@nzyme/vue';
import { onEventEmitter } from '@nzyme/vue-utils';
import { ActionDispatcher } from '@superadmin/client';
import { ActionRegistry } from '@superadmin/core';
import Icon from '@superadmin/ui/Icon.vue';
import { prettifyName } from '@superadmin/utils';

import { MenuService } from './MenuService';

const actionDispatcher = useService(ActionDispatcher);
const actionRegistry = useService(ActionRegistry);
const menuService = useService(MenuService);

const menuItems = ref<PrimeVueMenuItem[]>([]);
const menuRef = ref<MenuMethods & ComponentPublicInstance>();

onEventEmitter(menuService, 'open', ({ items, event }) => {
    menuItems.value = mapNotNull(items, item => {
        const actionDef = actionRegistry.resolve(item.action);
        if (!actionDef) {
            return;
        }

        const menuItem: PrimeVueMenuItem = {
            label: item.label || prettifyName(actionDef.name),
            icon: item.icon,
            command: () => void actionDispatcher(item.action),
        };

        return menuItem;
    });

    menuRef.value?.toggle(event);
});
</script>

<template>
    <Menu
        ref="menuRef"
        :model="menuItems"
        :popup="true"
    >
        <template #item="{ item, props: { action } }">
            <a
                v-ripple
                class="flex items-center"
                v-bind="action"
            >
                <Icon
                    v-if="item.icon"
                    :icon="item.icon"
                />
                <span>{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>
