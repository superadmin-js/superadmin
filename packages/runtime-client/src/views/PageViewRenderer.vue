<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { getSingleItem } from '@nzyme/utils';
import { defineProp, provideContext } from '@nzyme/vue-utils';
import { ViewContext, useComponent } from '@superadmin/client';
import type { View } from '@superadmin/core';
import { parseJson } from '@superadmin/schema';

import PageViewLayout from './PageViewLayout.vue';

const props = defineProps({
    view: defineProp<View>({ type: Object, required: true }),
});

provideContext(
    ViewContext,
    computed(() => props.view),
);

const router = useRouter();
const ViewComponent = useComponent(() => props.view.component);

const params = computed(() => {
    const query = getSingleItem(router.currentRoute.value.query?.p);
    return parseJson(props.view.params, query);
});

function updateParams(params: unknown) {
    void router.push({ query: { p: JSON.stringify(params) } });
}
</script>

<template>
    <template v-if="ViewComponent">
        <ViewComponent
            :params="params"
            :view="props.view"
            :layout="PageViewLayout"
            @update:params="updateParams"
        />
    </template>
</template>
