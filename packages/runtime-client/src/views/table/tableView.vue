<script lang="ts" setup>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';

import { useService } from '@nzyme/vue';
import { ActionDispatcher } from '@superadmin/client';
import type { TableView } from '@superadmin/core';
import type { Schema } from '@superadmin/schema';
import ActionMenu from '@superadmin/ui/ActionMenu.vue';
import { prettifyName } from '@superadmin/utils';

const props = defineProps({
    view: { type: Object as PropType<TableView>, required: true },
});

const actionDispatcher = useService(ActionDispatcher);

type ColumnDef = {
    prop: string;
    label: string;
    schema: Schema;
};

const columns = computed(() => {
    const columns: ColumnDef[] = [];
    const fields = props.view.rowSchema.props;

    for (const key of Object.keys(fields)) {
        const schema = fields[key];

        columns.push({
            prop: key,
            label: schema.label || prettifyName(key),
            schema,
        });
    }

    return columns;
});

const rows = ref<object[]>();

onMounted(fetchData);

async function fetchData() {
    const action = props.view.actions.fetch(undefined);
    const result = await actionDispatcher(action);

    rows.value = result;
}
</script>

<template>
    <div class="p-6">
        <DataTable
            :value="rows"
            show-gridlines
        >
            <Column
                v-for="column in columns"
                :key="column.prop"
                :field="column.prop"
                :header="column.label"
            ></Column>

            <Column
                v-if="view.rowActions"
                class="w-0"
            >
                <template #body="{ data }">
                    <ActionMenu :actions="view.rowActions(data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style lang="css" scoped>
:deep(.p-datatable-table) {
    border-collapse: unset;
}

:deep(.p-datatable-table > thead > tr:first-of-type > th:first-of-type) {
    border-top-left-radius: 0.5rem;
}

:deep(.p-datatable-table > thead > tr:first-of-type > th:last-of-type) {
    border-top-right-radius: 0.5rem;
}

:deep(.p-datatable-table > tbody > tr:last-of-type > td:first-of-type) {
    border-bottom-left-radius: 0.5rem;
}

:deep(.p-datatable-table > tbody > tr:last-of-type > td:last-of-type) {
    border-bottom-right-radius: 0.5rem;
}
</style>
