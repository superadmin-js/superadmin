<script lang="ts" setup>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
</script>

<template>
    <DataTable :value="[]">
        <Column
            field="code"
            header="Code"
        ></Column>
        <Column
            field="name"
            header="Name"
        ></Column>
        <Column
            field="category"
            header="Category"
        ></Column>
        <Column
            field="quantity"
            header="Quantity"
        ></Column>
    </DataTable>
</template>
