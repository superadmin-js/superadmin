<script lang="ts" setup>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, onMounted, ref } from 'vue';

import { useService } from '@nzyme/vue';
import { ActionDispatcher, useViewProps } from '@superadmin/client';
import type { TableView } from '@superadmin/core';
import type { Schema } from '@superadmin/schema';
import ActionButton from '@superadmin/ui/ActionButton.vue';
import ActionMenu from '@superadmin/ui/ActionMenu.vue';
import { prettifyName } from '@superadmin/utils';

const props = defineProps({
    ...useViewProps<TableView>(),
});

const actionDispatcher = useService(ActionDispatcher);

type ColumnDef = {
    prop: string;
    label: string;
    schema: Schema;
};

const headerActions = computed(() => props.view.headerActions?.(props.view.params));

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
    <component :is="layout">
        <template
            v-if="headerActions?.length"
            #header
        >
            <div class="flex gap-4">
                <ActionButton
                    v-for="(action, index) in headerActions"
                    :key="index"
                    :button="action"
                />
            </div>
        </template>

        <template #body>
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
                    v-if="view.rowMenu"
                    class="w-0"
                >
                    <template #body="{ data }">
                        <ActionMenu :items="view.rowMenu(data)" />
                    </template>
                </Column>
            </DataTable>
        </template>
    </component>
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
