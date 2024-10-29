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
import { ActionRegistry } from '@superadmin/core';
import type { Action } from '@superadmin/schema';

import Icon from './Icon.vue';

const actionDispatcher = useService(ActionDispatcher);
const actionRegistry = useService(ActionRegistry);

const props = defineProps({
    actions: Array as PropType<Action[]>,
});

const menuRef = ref<MenuMethods & ComponentPublicInstance>();
const menuId = `actions-${randomString(12)}`;
const menuItems = computed<MenuItem[]>(() => {
    const actions = props.actions ?? [];

    return mapNotNull(actions, action => {
        const actionDef = actionRegistry.resolveAction(action.action);
        if (!actionDef) {
            return;
        }

        return {
            label: actionDef.label,
            icon: actionDef.icon,
            command: () => actionDispatcher(action),
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
