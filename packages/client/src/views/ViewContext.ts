import type { Ref } from 'vue';

import { defineContext } from '@nzyme/vue-utils/context.js';
import type { View } from '@superadmin/core';

export const ViewContext = defineContext<Readonly<Ref<View>>>('View');
