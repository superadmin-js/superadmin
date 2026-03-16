import { defineContext } from '@nzyme/vue-utils/context.js';
import type { Ref } from 'vue';

import type { View } from '@superadmin/core/views/defineView.js';

/** Vue provide/inject context holding a readonly ref to the current view definition. */
export const ViewContext = defineContext<Readonly<Ref<View>>>('View');
