<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black">{{ $t("water_traffic_map") }}</h1>
   <div id="water-traffic-map">
      <AISMap />
      <div id="sailing-log-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-base text-grayy-25">{{ $t("water_traffic_event") }}</h1>
               <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">
                  {{ aisActivityList?.length }} {{ $t("items") }}
               </div>
            </div>
         </div>
         <UTable :columns="columns" :rows="aisActivityList" :ui="{
            base: 'u-table-list',
         }">
            <template v-for="column in filteredColumns" :key="column.key" v-slot:[column.key+'-header']>
               <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
                  <span>{{ column.label }}</span>
                  <span
                     v-if="sortField === (column.key === 'latLong' ? 'latitude' : column.key === 'shipDetails' ? 'vesselName' : column.key) && sortOrder === 'asc'">
                     <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span
                     v-else-if="sortField === (column.key === 'latLong' ? 'latitude' : column.key === 'shipDetails' ? 'vesselName' : column.key) && sortOrder === 'desc'">
                     <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span v-else>
                     <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
               </div>
            </template>

            <template #shipDetails-data="{ row }">
               <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                  <div>
                     <!-- <img :src="row.vessel.vesselFlagImage" :alt="row.vessel.vesselFlagName"
                        class="w-6 h-6 rounded-[50%]" /> -->
                  </div>
                  <div>
                     <h3 class="text-grayy-900 font-anuphan-medium">{{ row.vessel.name }}</h3>
                     <p class="text-grayy-600">{{ row.vessel.imoNumber }}/{{ row.vessel.officialNumber }}</p>
                  </div>
               </div>
            </template>

            <template #activityDate-data="{ row }">
               <div>{{ row.activityDate ? renderDateFormat(row.activityDate) : "" }}</div>
               <div class="text-grayy-75">{{ row.activityDate ? renderTimeFormat(row.activityDate) : "" }}</div>
            </template>

            <template #latLong-data="{ row }">
               <p>{{ row.latitude }}</p>
               <p>{{ row.longitude }}</p>
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
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import AISMap from "~/components/ais/ais-map.vue";
import type { IAisActivityList } from "~/core/interfaces/IAis";
import useAisService from "~/core/services/aisService";

const aisService = useAisService();
const { t } = useI18n();
const isLoading = ref<boolean>(false);
const aisActivityList = ref<IAisActivityList[]>([]);
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
});
const columns = [
   {
      key: "activityDate",
      label: t("event_date"),
   },
   {
      key: "shipDetails",
      label: t("vn_imo_on"),
   },
   {
      key: "mmsi",
      label: t("mmsi_no"),
   },
   {
      key: "location",
      label: t("position"),
   },
   {
      key: "latLong",
      label: `${t("lat")} - ${t("lng")}`,
   },
];
onMounted(() => {
   getAisActivity();
});

watch(
   () => ({
      limit: filter.value.limit,
   }),
   (newValue, oldValue) => {
      handleFilterSearch(0);
   }
);

const handleFilterSearch = debounceFilterSearch(() => {
   filter.value.page = 1;
   getAisActivity();
});
const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getAisActivity();
};

const getAisActivity = async () => {
   isLoading.value = true;
   const res = await aisService.getAisActivity(filter.value);
   if (res.statusCode === 200) {
      aisActivityList.value = res.data.data;
      paginationData.value.totalItems = res.data.totalItems;
      paginationData.value.totalPages = res.data.totalPages;
   }
   isLoading.value = false;
};

const filteredColumns = computed(() => columns.filter((column) => ![""].includes(column.key)));
const toggleSort = (column: string) => {
   let sortColumn = column;
   if (column === "latLong") {
      sortColumn = "latitude";
   } else if (column === "shipDetails") {
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
   getAisActivity();
};
</script>
