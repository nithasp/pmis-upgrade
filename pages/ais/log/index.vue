<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black mb-8">AIS Log</h1>
   <div id="ais-log">
      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6">
         <div class="block justify-between gap-4 mobile:flex">
            <div class="block gap-4 w-full mobile:flex">
               <UFormGroup :label="$t('Arrival Time')" class="w-[calc(100%-8px)] mobile:w-[calc(50%-8px)]">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input name="etd" size="md" variant="outline" color="purple" custom-icon="calendar"
                        :value="mooringDate ? `${format(mooringDate.start, 'd MMM, yyy')} - ${format(mooringDate.end, 'd MMM, yyy')}` : ''"
                        :placeholder="$t('ค้นหา')" :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }" />
                     <template #panel="{ close }">
                        <Datepicker v-model="selectMooringDate" @close="close" :onDateChange="onMooringDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>
               <Select :label="$t('Position')" :placeholder="$t('Position')"
                  :options="[allFilterObject, ...documentOptionsStore.berthsOption]" v-model="filter.berthId"
                  class="w-[calc(100%-8px)] mobile:w-[calc(50%-8px)] mt-3 mobile:mt-0" />
            </div>
            <div class="content-end mt-3 mobile:mt-0 justify-self-start mobile:justify-self-end">
               <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
            </div>
         </div>
      </div>
      <div id="ais-log-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-base text-grayy-25">{{ $t("all_ais_log") }}</h1>
               <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">{{
                  aisLogList?.length }} {{ $t("items") }}</div>
            </div>
         </div>
         <UTable :columns="columns" :rows="aisLogList" :ui="{
            base: 'u-table-list',
         }">
            <template v-for="column in filteredColumns" :key="column.key" v-slot:[column.key+'-header']>
               <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
                  <span>{{ column.label }}</span>
                  <span
                     v-if="sortField === (column.key === 'shipDetails' ? 'vesselName' : column.key) && sortOrder === 'asc'">
                     <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span
                     v-else-if="sortField === (column.key === 'shipDetails' ? 'vesselName' : column.key) && sortOrder === 'desc'">
                     <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span v-else>
                     <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
               </div>
            </template>

            <template #vesselInfo-data="{ row }">
               <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                  <div>
                     <!-- <img :src="row.vesselFlagImage" :alt="row.vesselFlagName" class="w-6 h-6 rounded-[50%]" /> -->
                  </div>
                  <div>
                     <h3 class="text-grayy-900 font-anuphan-medium">{{ row.vesselName }}</h3>
                     <p class="text-grayy-600">{{ row.imoNumber }}/{{ row.officialNumber }}</p>
                  </div>
               </div>
            </template>

            <template #arrivalDateTime-data="{ row }">
               <div>{{ row.arrivalDateTime ? renderDateFormat(row.arrivalDateTime) : "" }}</div>
               <div class="text-grayy-75">{{ row.arrivalDateTime ? renderTimeFormat(row.arrivalDateTime) : "" }}</div>
            </template>

            <template #departureDateTime-data="{ row }">
               <div>{{ row.departureDateTime ? renderDateFormat(row.departureDateTime) : "" }}</div>
               <div class="text-grayy-75">{{ row.departureDateTime ? renderTimeFormat(row.departureDateTime) : "" }}
               </div>
            </template>

            <template #shipDetails-data="{ row }">
               <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                  <div>
                     <img :src="row.vessel.vesselFlagImage" :alt="row.vessel.vesselFlagName"
                        class="w-6 h-6 rounded-[50%]" />
                  </div>
                  <div>
                     <h3 class="text-grayy-900 font-anuphan-medium">{{ row.vessel.name }}</h3>
                     <p class="text-grayy-600">{{ row.vessel.imoNumber }}/{{ row.vessel.officialNumber }}</p>
                  </div>
               </div>
            </template>
         </UTable>
         <div class="flex justify-between px-6 py-3 overflow-auto">
            <div class="flex items-center">
               <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
               <Select :options="limitRowTable" v-model="filter.limit" />
            </div>
            <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
               :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
               v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit"
               @update:modelValue="onPageChange" />
         </div>
      </div>
   </div>
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import { format } from "date-fns";
import type { IAisActivityList } from "~/core/interfaces/IAis";
import type { IFilterAllStatus } from "~/core/interfaces/IFilterAllStatus";

import useAisService from "~/core/services/aisService";
import type { IDateRange } from "~/core/interfaces/IDate";
const aisService = useAisService();
const documentOptionsStore = useDocumentOptionsStore();

const { t, locale } = useI18n();
const isLoading = ref<boolean>(false);
const allowFetch = ref<boolean>(true);
const aisLogList = ref<IAisActivityList[]>([]);
const sortField = ref("");
const sortOrder = ref("");
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
const filter = ref<any>({
   limit: 10,
   page: 1,
   arrivalBeginDate: "",
   arrivalEndDate: "",
   berthId: 0,
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const columns = [
   {
      key: "arrivalDateTime",
      label: "Arrival Time",
   },
   {
      key: "departureDateTime",
      label: t("Departure Time"),
   },
   {
      key: "shipDetails",
      label: t("ชื่อเรือ/IMO/Official No."),
   },
   {
      key: "mmsi",
      label: t("MMSI No."),
   },
   {
      key: "callSign",
      label: `CALL SIGN`,
   },
   {
      key: "position",
      label: `POSITION`,
   },
];
const handleResetFilter = () => {
   allowFetch.value = true;
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.arrivalBeginDate = "";
   filter.value.arrivalEndDate = "";
   filter.value.berthId = 0;
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   selectMooringDate.value = { start: new Date(), end: new Date() };
   mooringDate.value = null;
};
const allFilterObject = ref<IFilterAllStatus>({ id: "", name: `${locale.value === "en" ? "All" : "ทั้งหมด"}` });
const mooringDate = ref<IDateRange | null>(null);
const selectMooringDate = ref<IDateRange>({ start: new Date(), end: new Date() });

onMounted(() => {
   getAisLogs();
   documentOptionsStore.getBerthsOptions();
});

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      berthId: filter.value.berthId,
      mooringDate: mooringDate.value,
   }),
   (newValue, oldValue) => {
      if (newValue.mooringDate !== oldValue.mooringDate) {
         filter.value.arrivalBeginDate = newValue.mooringDate ? adjustToUTC(newValue.mooringDate.start) : "";
         filter.value.arrivalEndDate = newValue.mooringDate ? adjustToUTC(newValue.mooringDate.end) : "";
      }

      if (newValue.page !== oldValue.page) {
         filter.value.page = newValue.page;
         if (allowFetch.value) {
            handleFilterSearch(0);
         }
      } else {
         handleFilterSearch(0);
      }
   }
);

const handleFilterSearch = debounceFilterSearch(() => {
   filter.value.page = 1;
   getAisLogs();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getAisLogs();
};

const onMooringDateChange = (newDate: IDateRange) => {
   mooringDate.value = newDate;
};

const getAisLogs = async () => {
   isLoading.value = true;
   const res = await aisService.getAisLogs(filter.value);
   if (res.statusCode === 200) {
      aisLogList.value = res.data.data;
      paginationData.value.totalItems = res.data.totalItems;
      paginationData.value.totalPages = res.data.totalPages;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const toggleSort = (column: string) => {
   let sortColumn = column;
   if (column === "shipDetails") {
      sortColumn = "vesselName";
   }
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
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   filter.value.page = 1;
   getAisLogs();
};
</script>
