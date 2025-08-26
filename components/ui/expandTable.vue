<template>
   <div class="u-table-list table-container overflow-auto">
      <table class="expandable-table min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-800"
         v-if="rows && rows.length">
         <thead>
            <tr>
               <th v-for="header in headers" :key="header.key"
                  class="text-left rtl:text-right px-4 py-3.5 text-grayy-75 dark:text-white bg-purple-25 font-semibold text-sm">
                  <div v-if="header.sortable !== false" @click="$emit('sort', header.key)"
                     class="cursor-pointer flex items-center">
                     <span>{{ header.label }}</span>
                     <span v-if="sortField === mapColumnToSortField(header.key) && sortOrder === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else-if="sortField === mapColumnToSortField(header.key) && sortOrder === 'desc'">
                        <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else>
                        <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                     </span>
                  </div>
                  <div v-else>
                     {{ header.label }}
                  </div>
               </th>
            </tr>
         </thead>
         <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <template v-for="(row, index) in rows" :key="row.id">
               <tr class="cursor-pointer" @click="() => selectRow(row)">
                  <td v-for="header in headers" :key="header.key"
                     class="whitespace-nowrap px-4 py-4 text-grayy-400 text-sm">
                     <slot :name="header?.key + '-data'" :row="row" :value="row[header?.key]" :index="index">
                        <UButton v-if="header.expandButton && (row?.refDocuments.length > 0 || row?.cancelNote)"
                           variant="link" @click.stop="toggleExpand(index)">
                           <div :class="expandedRowIndex === index ? 'rotate-180' : 'Expand'">
                              <NuxtIcon name="caret-down" size="lg" color="text-[#374957]" />
                           </div>
                        </UButton>
                        <span v-else>{{ row[header.key] }}</span>
                     </slot>
                  </td>
               </tr>
               <template v-if="expandedRowIndex === index">
                  <slot name="details" :row="row">
                     <p>Additional Info: {{ row.additionalInfo || "No additional information available" }}</p>
                  </slot>
               </template>
            </template>
         </tbody>
      </table>
      <template v-else>
         <EmptyNotFoundTable />
      </template>
   </div>
</template>

<script setup>
import { ref } from "vue";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import NuxtIcon from "./nuxtIcon.vue";

// Define props using `defineProps`
const props = defineProps({
   headers: {
      type: Array,
      required: true,
   },
   rows: {
      type: Array,
      required: true,
   },
   hiddenColumns: {
      type: Array,
      default: () => [],
   },
   sortField: {
      type: String,
      default: "",
   },
   sortOrder: {
      type: String,
      default: "",
   },
});
const emit = defineEmits(["rowSelected"]);

// Reactive state for expanded row index
const expandedRowIndex = ref(null);

// Method to toggle row expansion
function toggleExpand(index) {
   if (index < 0 || index >= props.rows.length) {
      console.error("Invalid row index:", index);
      return;
   }
   expandedRowIndex.value = expandedRowIndex.value === index ? null : index;
}

const selectRow = (row) => {
   emit("rowSelected", row);
};

const mapColumnToSortField = (columnKey) => {
   const sortMapping = {
      invoiceNo: "portDueNumber",
      clientIdName: "invoiceName",
      name: "vesselVesselName",
      grt_portdues: "grossTonnage",
      ports: "berthName",
      mooring_date: "berthAt",
      departure_date: "departuredAt",
      invoice_issuer_date: "createdAt",
      payment_duedate: "invoiceDueDate",
      payment_date: "paidDate",
   };
   return sortMapping[columnKey] || columnKey;
};
</script>
