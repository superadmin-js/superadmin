<script lang="ts" setup>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed } from 'vue';

import { useService } from '@nzyme/vue';
import { useDataSource } from '@nzyme/vue-utils';
import { ActionDispatcher, useViewProps } from '@superadmin/client';
import type { TableView } from '@superadmin/core';
import type { Schema } from '@superadmin/schema';
import { ActionButtons } from '@superadmin/ui';
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

const headerButtons = computed(() => props.view.headerButtons?.(props.view.params));

const columns = computed(() => {
    const columns: ColumnDef[] = [];
    const fields = props.view.schema.props;

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

const data = useDataSource({
    load: fetchData,
    behavior: 'eager',
});

function fetchData() {
    const action = props.view.actions.fetch(undefined);
    return actionDispatcher(action);
}

function reload() {
    return data.reload();
}
</script>

<template>
    <component :is="layout">
        <template
            v-if="headerButtons?.length"
            #header
        >
            <div class="flex gap-4">
                <ActionButtons
                    :buttons="headerButtons"
                    @action="reload"
                />
            </div>
        </template>

        <template #body>
            <DataTable
                :value="data"
                show-gridlines
            >
                <Column
                    v-for="column in columns"
                    :key="column.prop"
                    :field="column.prop"
                    :header="column.label"
                ></Column>

                <Column
                    v-if="view.rowButtons"
                    class="w-0"
                >
                    <template #body="{ data }">
                        <div class="flex justify-end gap-3">
                            <ActionButtons
                                :buttons="view.rowButtons(data)"
                                size="small"
                                @action="reload"
                            />
                        </div>
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
