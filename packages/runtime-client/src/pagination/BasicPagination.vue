<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import { computed } from 'vue';

import type { BasicPaginationEvents, BasicPaginationProps } from '@superadmin/core';

const props = defineProps<BasicPaginationProps>();
const emit = defineEmits<BasicPaginationEvents>();

const totalRows = computed(() => {
    if (props.result?.totalRows) {
        return props.result.totalRows;
    }

    if (
        props.result?.hasMore &&
        props.value.page === props.result.page &&
        props.value.pageSize === props.result.pageSize
    ) {
        return props.value.page * props.value.pageSize + 1;
    }

    return props.value.page * props.value.pageSize;
});

const first = computed({
    get() {
        return (props.value.page - 1) * props.value.pageSize;
    },
    set(value) {
        if (value === first.value) {
            return;
        }

        emit('update:value', {
            pageSize: props.value.pageSize,
            page: value / props.value.pageSize + 1,
        });
    },
});

const rows = computed({
    get() {
        return props.value.pageSize;
    },
    set(value) {
        if (value === rows.value) {
            return;
        }

        emit('update:value', {
            pageSize: value,
            page: 1,
        });
    },
});

const template = computed(() => {
    if (props.result?.totalRows) {
        return 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport';
    }

    return 'FirstPageLink PrevPageLink PageLinks NextPageLink RowsPerPageDropdown';
});
</script>

<template>
    <Paginator
        v-model:first="first"
        v-model:rows="rows"
        :total-records="totalRows"
        :rows-per-page-options="config.pageSizes"
        :template="template"
    />
</template>
