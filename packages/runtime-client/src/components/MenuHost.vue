<script lang="ts" setup>
import type { MenuMethods } from 'primevue/menu';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import vRipple from 'primevue/ripple';
import type { ComponentPublicInstance } from 'vue';
import { nextTick, ref } from 'vue';

import type { PromiseWrapper } from '@nzyme/utils';
import { createPromise, mapNotNull } from '@nzyme/utils';
import { useService } from '@nzyme/vue-ioc';
import { onEventEmitter } from '@nzyme/vue-utils';
import { ActionDispatcher } from '@superadmin/client';
import { ActionRegistry } from '@superadmin/core';
import Icon from '@superadmin/ui/Icon.vue';

import { MenuService } from './MenuService';

const actionDispatcher = useService(ActionDispatcher);
const actionRegistry = useService(ActionRegistry);
const menuService = useService(MenuService);

type MenuState = {
    items: MenuItem[];
    target: HTMLElement;
    promise: PromiseWrapper<void>;
};

const menuState = ref<MenuState>();
const menuRef = ref<MenuMethods & ComponentPublicInstance>();

onEventEmitter(menuService, 'open', async ({ items, event }) => {
    const promise = createPromise();

    if (menuState.value?.target === event.target) {
        menuRef.value?.hide();
        return;
    }

    menuRef.value?.hide();
    await nextTick();

    menuState.value = {
        items: mapNotNull(items, item => {
            const actionDef = actionRegistry.resolve(item.action);
            if (!actionDef) {
                return;
            }

            const handler = async () => {
                await actionDispatcher(item.action);
                promise.resolve();
            };

            const menuItem: MenuItem = {
                label: item.label || actionDef.title,
                icon: item.icon,
                command: handler as () => void,
                style: getItemStyle(item),
            };

            return menuItem;
        }),
        target: event.target as HTMLElement,
        promise,
    };

    menuRef.value?.show(event);
    await promise.promise;
});

function getItemStyle(item: MenuItem) {
    switch (item.color) {
        case 'primary':
            return {
                '--p-menu-item-color': 'var(--p-primary-500)',
            };
        case 'success':
            return {
                '--p-menu-item-color': 'var(--p-green-500)',
            };
        case 'danger':
            return {
                '--p-menu-item-color': 'var(--p-red-500)',
            };
    }
}
</script>

<template>
    <Menu
        ref="menuRef"
        :model="menuState?.items"
        :popup="true"
        @hide="menuState = undefined"
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
