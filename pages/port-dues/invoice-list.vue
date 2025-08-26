<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("port_due_invoice") }}</h1>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-4 gap-4">
         <div class="col-span-1">
            <Input label="ชื่อเรือ/IMO/Official No." placeholder="ค้นหา" v-model="search"
               icon="i-heroicons-magnifying-glass-20-solid" />
         </div>
         <div class="col-span-1">
            <Input label="รหัสลูกค้า/ชื่อลูกค้า" placeholder="ค้นหา" v-model="customerName"
               icon="i-heroicons-magnifying-glass-20-solid" />
         </div>
         <div class="col-span-1">
            <USelect label="ท่าเรือ" placeholder="ท่าเรือ" :options="documentOptionsStore.berthsOption"
               v-model="berthId" />
         </div>
         <div class="col-span-1">
            <div class="flex items-end">
               <div class="w-full">
                  <UFormGroup :label="$t('vessel_entry_date')">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                           :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                           :placeholder="$t('vessel_entry_date')" :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }" />

                        <template #panel="{ close }">
                           <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                              <DatePicker v-model="selectedDate" @close="close" />
                           </div>
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
               <div class="ml-2 mb-0.5">
                  <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <div id="request-form-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-lg text-white">ใบแจ้งหนี้ Port Dues ทั้งหมด</h1>
            <div v-if="search || vesselType" class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{
               portDuesList.length
            }} รายการ</div>
         </div>
      </div>
      <UTable @select="selectRow" :columns="columns" :rows="portDuesList" :ui="{
         base: 'u-table-list',
      }">
         <template v-for="column in filteredColumns" :key="column.key" v-slot:[column.key+'-header']>
            <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
               <span>{{ column.label }}</span>
               <span v-if="sortField === mapColumnToSortField(column.key) && sortOrder === 'asc'">
                  <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
               </span>
               <span v-else-if="sortField === mapColumnToSortField(column.key) && sortOrder === 'desc'">
                  <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
               </span>
               <span v-else>
                  <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
               </span>
            </div>
         </template>
         <template #id-data="{ index }">{{ getNumCountPagination(index, filter.page, filter.limit) }} </template>
         <template #name-data="{ row }">
            <div class="flex items-center">
               <UAvatar v-if="row.vessel?.vesselFlagPath" size="xs" :src="row.vessel?.vesselFlagPath" alt="Avatar" />
               <div class="ml-3">
                  <div class="text-black font-semibold">
                     {{ row.vessel?.vesselName }}
                  </div>
                  <div class="text-grayy-75">{{ row && row.vessel?.vesselImoNumber }}/{{ row &&
                     row.vessel?.vesselOfficialNumber
                  }}</div>
               </div>
            </div>
         </template>
         <template #grt_portdues-data="{ row }">
            <div class="text-black font-semibold">
               {{ formatNumber(row.grossTonnage, 3) }}
            </div>
            <div class="text-grayy-75">{{ formatNumber(row.invoice?.total, 2) }}</div>
         </template>
         <template #ports-data="{ row }">
            <div class="text-grayy-75">{{ row.ports }}</div>
         </template>

         <template #actions-data="{ row }">
            <UPopover>
               <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
               <template #panel>
                  <div class="w-[200px]" @click="() => navigateTo(`/port-dues/save?id=${row.documentId}`)">
                     <div class="flex items-center px-4 py-3 hover:bg-[#F9FAFB] cursor-pointer">
                        <NuxtIcon name="edit" size="lg" color="text-grayy-400" />
                        <div class="ml-3">{{ $t("save") }}</div>
                     </div>
                  </div>
               </template>
            </UPopover>
         </template>
         <template #departure_date-data="{ row }">
            <div class="text-black font-semibold">{{ row.departuredAt && renderDateFormat(row.departuredAt) }}</div>
            <div class="text-grayy-75">{{ row.departuredAt && renderTimeFormat(row.departuredAt) }}</div>
         </template>
         <template #mooring_date-data="{ row }">
            <div class="text-black font-semibold">{{ row.berthAt && renderDateFormat(row.berthAt) }}</div>
            <div class="text-grayy-75">{{ row.berthAt && renderTimeFormat(row.berthAt) }}</div>
         </template>
         <template #clientIdName-data="{ row }">
            <div class="text-black font-semibold">
               {{ row.invoice?.customerCode }}
            </div>
            <div class="text-grayy-75">{{ row.invoice?.name }}</div>
         </template>
         <template #paymentMethod-data="{ row }">
            <div class="text-grayy-75">{{ row.invoice?.paymentMethodName }}</div>
         </template>
         <template #empty-state>
            <EmptyNotFoundTable />
         </template>
      </UTable>
      <div class="flex justify-between px-6 py-3">
         <div class="flex items-center">
            <span class="text-sm text-grayy-75 mr-3.5">แสดง</span>
            <USelect :options="limitRowTable" v-model="filter.limit" />
         </div>

         <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
            :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
            v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit" />
      </div>
   </div>
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import { format } from "date-fns";
import DatePicker from "~/components/form/v-datepicker.vue";

import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import usePortDuesService from "~/core/services/portDuesService";
import type { IPortDuesSaveDetail } from "~/core/interfaces/IPortDuesSaveDetail";
import type { IFilterPortDuesPending } from "~/core/interfaces/IFilterPortDuesPending";

const canCreate = allowPermission("create_vessel_data");
const canView = allowPermission("view_vessel_data");
const canEdit = allowPermission("edit_vessel_data");
const canDelete = allowPermission("delete_vessel_data");
const documentOptionsStore = useDocumentOptionsStore()
const isLoading = ref(false);
const search = ref("");
const customerName = ref('')
const sortField = ref("");
const sortOrder = ref("");
const berthId = ref(0)
const vesselType = ref(0);
const dateValue = ref<any>("");
const selectedDate = ref(new Date())
const portDuesService = usePortDuesService()
const filter = ref<IFilterPortDuesPending>({
   customerName: "",
   berthId: 0,
   begin: "",
   end: "",
   page: 1,
   limit: 10,
   search: '',
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});

const portDuesList = ref<IPortDuesSaveDetail[]>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});


const limitRowTable = ref([
   {
      id: 10,
      name: 10,
   },
   {
      id: 20,
      name: 20,
   },
   {
      id: 50,
      name: 50,
   },
   {
      id: 100,
      name: 100,
   },
]);

const handleClickResetFitler = () => {
   search.value = "";
   customerName.value = ''
   berthId.value = 0
   dateValue.value = ""
   filter.value.page = 1;
   filter.value.limit = 10;
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   getPostDuesPendingList({
      customerName: "",
      berthId: 0,
      begin: "",
      end: "",
      page: 1,
      limit: 10,
      search: '',
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};


const columns = [
   {
      key: "id",
      label: "ลำดับ",
   },
   {
      key: "docNumber",
      label: "เลขที่คำร้อง",
   },
   {
      key: "name",
      label: "ชื่อเรือ/IMO/Official No.",
   },
   {
      key: "grt_portdues",
      label: "GRT/Port Dues",
   },
   {
      key: "berthName",
      label: "ท่าเรือ",
   },
   {
      key: "mooring_date",
      label: "วันที่เรือเข้า VT",
   },
   {
      key: "departure_date",
      label: "วันที่เรือออก VT",
   },
   {
      key: "clientIdName",
      label: "รหัส/ชื่อลูกค้า ",
   },
   {
      key: "paymentMethod",
      label: "วิธีชำระเงิน",
   },
   {
      key: "actions",
      sortable: false,
   },
];

onMounted(() => {
   getPostDuesPendingList(filter.value);
   documentOptionsStore.getBerthsOptions()
   // vesselOptionsStore.getVesselTypeOption();
   // vesselOptionsStore.getVesselFlagOption();
});

const getPostDuesPendingList = async (filter: IFilterPortDuesPending = {
   customerName: "",
   berthId: 0,
   begin: "",
   end: "",
   page: 1,
   limit: 10,
   search: '',
   Order: [{ column: sortField.value, dir: sortOrder.value }]
}) => {
   isLoading.value = true
   const resp = await portDuesService.getPortDuesPendingList(filter)
   if (resp.statusCode === 200) {
      portDuesList.value = resp.data.data
      paginationData.value.totalItems = resp.data.totalItems
      paginationData.value.totalPages = resp.data.totalPages
   }
   isLoading.value = false
}

const selectRow = (row: IPortDuesSaveDetail) => {
   navigateTo(`/port-dues/save?id=${row.documentId}`)
}

const performSearch = debounce((query: any) => {
   filter.value.search = query;
   filter.value.page = 1;
   getPostDuesPendingList({
      ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   }
   );
}, 500);

const performSearchCustomerName = debounce((query: any) => {
   filter.value.customerName = query;
   filter.value.page = 1;
   getPostDuesPendingList({
      ...filter.value, customerName: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
}, 500);

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const sortMapping: Record<string, string> = {
  name: "vesselVesselName",
  grt_portdues: "grossTonnage",
  mooring_date: "berthAt",
  departure_date: "departuredAt",
  clientIdName: "invoiceName",
  paymentMethod: "invoicePaymentMethodName",
};
const mapColumnToSortField = (column: string): string => {
  return sortMapping[column] || column;
};
const toggleSort = (column: string) => {
  const sortColumn = mapColumnToSortField(column);

  if (sortField.value !== sortColumn) {
    sortField.value = sortColumn;
    sortOrder.value = "asc";
  } else {
    if (sortOrder.value === "asc") {
      sortOrder.value = "desc";
    } else if (sortOrder.value === "desc") {
      sortField.value = "";
      sortOrder.value = "";
    } else {
      sortOrder.value = "asc";
    }
  }

  getPostDuesPendingList({
    ...filter.value,
    page: 1,
    Order: [{ column: sortField.value, dir: sortOrder.value }],
  });
};

watch(search, (newVal) => {
   performSearch(newVal);
});

watch(customerName, (newVal) => {
   performSearchCustomerName(newVal);
});

watch(
   () => filter.value.page,
   (value) => {
      getPostDuesPendingList({
         ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getPostDuesPendingList({
         ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => berthId.value,
   (value) => {
      filter.value.page = 1;
      getPostDuesPendingList({
         ...filter.value, berthId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => selectedDate.value,
   (value) => {
      dateValue.value = value;
   }
);

watch(
   () => dateValue.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : '';
      const endDate = value ? adjustToUTC(value.end) : '';
      filter.value.begin = beginDate
      filter.value.end = endDate
      filter.value.page = 1
      getPostDuesPendingList({
         ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      })
   }
);
</script>
