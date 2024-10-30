<script lang="ts" setup>
import Button from 'primevue/button';
import type { MenuMethods } from 'primevue/menu';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import vRipple from 'primevue/ripple';
import type { ComponentPublicInstance, PropType } from 'vue';
import { computed, ref } from 'vue';

import { randomString } from '@nzyme/crypto-utils';
import { mapNotNull } from '@nzyme/utils';
import { useService } from '@nzyme/vue';
import { ActionDispatcher } from '@superadmin/client';
import type { ActionMenuItem } from '@superadmin/core';
import { ActionRegistry } from '@superadmin/core';
import { prettifyName } from '@superadmin/utils';

import Icon from './Icon.vue';

const actionDispatcher = useService(ActionDispatcher);
const actionRegistry = useService(ActionRegistry);

const props = defineProps({
    items: Array as PropType<ActionMenuItem[]>,
});

const menuRef = ref<MenuMethods & ComponentPublicInstance>();
const menuId = `actions-${randomString(12)}`;
const menuItems = computed<MenuItem[]>(() => {
    const items = props.items ?? [];

    return mapNotNull(items, item => {
        const actionDef = actionRegistry.resolveAction(item.action);
        if (!actionDef) {
            return;
        }

        return {
            label: item.label || prettifyName(actionDef.name),
            icon: item.icon,
            command: () => actionDispatcher(item.action),
        };
    });
});
</script>

<template>
    <Button
        link
        type="button"
        aria-haspopup="true"
        :aria-controls="menuId"
        @click="menuRef?.toggle($event)"
    >
        <template #icon>
            <Icon icon="more-vertical" />
        </template>
    </Button>

    <Menu
        :id="menuId"
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
