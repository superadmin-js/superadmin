<script lang="ts" setup>
import Button from 'primevue/button';
import type { MenuMethods } from 'primevue/menu';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import vRipple from 'primevue/ripple';
import type { ComponentPublicInstance, PropType } from 'vue';
import { computed, ref } from 'vue';

import { randomString } from '@nzyme/crypto-utils';
import { useService } from '@nzyme/vue';
import { ActionDispatcher } from '@superadmin/client';
import type { Action } from '@superadmin/core';

import Icon from './Icon.vue';

const actionDispatcher = useService(ActionDispatcher);

const props = defineProps({
    actions: Array as PropType<Action[]>,
});

const menuRef = ref<MenuMethods & ComponentPublicInstance>();
const menuId = `actions-${randomString(12)}`;
const menuItems = computed<MenuItem[]>(() => {
    const actions = props.actions ?? [];

    return actions.map(action => ({
        label: action.action.label,
        icon: action.action.icon,
        command: () => actionDispatcher(action),
    }));
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
