import { defineContext } from '@nzyme/vue-utils/context.js';
import type { Ref } from 'vue';

import type { View } from '@superadmin/core/views/defineView.js';

export /**
 *
 */
const ViewContext = defineContext<Readonly<Ref<View>>>('View');
