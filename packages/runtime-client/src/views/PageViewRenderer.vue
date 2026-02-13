<script lang="ts" setup>
import { getSingleItem } from '@nzyme/utils/array/getSingleItem.js';
import { defineProp } from '@nzyme/vue-utils/defineProp.js';
import { provideContext } from '@nzyme/vue-utils/context.js';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useComponent } from '@superadmin/client/components/useComponent.js';
import { ViewContext } from '@superadmin/client/views/ViewContext.js';
import type { View } from '@superadmin/core/views/defineView.js';
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
