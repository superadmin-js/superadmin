<script lang="ts" setup>
import { useService } from '@nzyme/vue-ioc';
import { useDataSource } from '@nzyme/vue-utils';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed } from 'vue';

import { ActionDispatcher, useComponent, useViewProps } from '@superadmin/client';
import type { TableView } from '@superadmin/core';
import * as s from '@superadmin/schema';
import { ActionButtons, Icon } from '@superadmin/ui';
import { prettifyName } from '@superadmin/utils';
const props = defineProps({
  ...useViewProps<TableView>(),
});

const params = defineModel<s.Infer<TableView['params']>>('params');

const actionDispatcher = useService(ActionDispatcher);

type ColumnDef = {
  label: string;
  prop: string;
  schema: s.Schema;
  sortable: boolean;
};

const headerButtons = computed(() => props.view.config.headerButtons?.(props.view.params));

const columns = computed(() => {
  const columns: ColumnDef[] = [];
  const fields = props.view.config.schema.props;

  for (const key of Object.keys(fields)) {
    const schema = fields[key];

    columns.push({
      prop: key,
      label: schema.label || prettifyName(key),
      schema,
      sortable: props.view.config.sortColumns.includes(key),
    });
  }

  return columns;
});

const sortBy = computed({
  get() {
    return params.value?.sort?.by;
  },
  set(value) {
    if (!value) {
      params.value = {
        ...params.value,
        sort: undefined,
      };

      return;
    }

    if (params.value?.sort?.by === value) {
      return;
    }

    params.value = {
      ...params.value,
      sort: {
        by: value,
        direction: 'asc',
      },
    };
  },
});

const sortDirection = computed({
  get() {
    return params.value?.sort?.direction === 'desc' ? -1 : 1;
  },
  set(value) {
    const direction = value === -1 ? ('desc' as const) : ('asc' as const);

    if (!params.value?.sort) {
      return;
    }

    if (params.value?.sort?.direction === direction) {
      return;
    }

    params.value = {
      ...params.value,
      sort: {
        ...params.value.sort,
        direction,
      },
    };
  },
});

const pagination = computed({
  get() {
    if (params.value?.pagination) {
      return params.value.pagination;
    }

    const pagination = props.view.config.pagination;
    if (!pagination) {
      return undefined;
    }

    return s.coerce(pagination.params);
  },
  set(value) {
    params.value = { ...params.value, pagination: value };
  },
});

const data = useDataSource({
  params,
  load: params => {
    if (!params) {
      params = s.coerce(props.view.params);
    }

    const action = props.view.actions.fetch(params);

    return actionDispatcher(action);
  },
  behavior: 'eager',
});

const Pagination = useComponent(() => props.view.config.pagination?.component);

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
        <Button
          severity="primary"
          outlined
          @click="reload"
        >
          <template #icon>
            <Icon icon="refresh-cw" />
          </template>
        </Button>
        <ActionButtons
          :buttons="headerButtons"
          @action="reload"
        />
      </div>
    </template>

    <template #body>
      <DataTable
        v-model:sort-field="sortBy"
        v-model:sort-order="sortDirection"
        :value="data?.rows"
        show-gridlines
        lazy
        removable-sort
      >
        <Column
          v-for="column in columns"
          :key="column.prop"
          :field="column.prop"
          :header="column.label"
          :sortable="column.sortable"
        />

        <Column
          v-if="view.config.rowButtons"
          class="w-0"
        >
          <template #body="{ data: row }">
            <div class="flex justify-end gap-3">
              <ActionButtons
                :buttons="view.config.rowButtons(row)"
                size="small"
                @action="reload"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>

    <template #footer>
      <Pagination
        v-if="view.config.pagination && Pagination"
        v-model:value="pagination"
        :result="data?.pagination"
        :config="view.config.pagination.config"
      />
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
