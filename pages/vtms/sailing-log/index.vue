<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black">{{ $t("sailing_log") }}</h1>
   <div id="sailing-log">
      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6">
         <div class="flex flex-col lg:flex-row justify-between gap-4">
        <div class="flex flex-col lg:flex-row gap-4 w-full">
          <Input
            :label="$t('rn_vn_imo_on')"
            :name="$t('locode')"
            :placeholder="$t('search_title_placeholder')"
            v-model="filter.search"
            icon="i-heroicons-magnifying-glass-20-solid"
            class="w-full lg:max-w-[367px]"
          />
          <USelect
            :label="$t('berth')"
            name="berth_id"
            placeholder=""
            :options="berthList"
            v-model="filter.berthId"
            class="w-full lg:max-w-[240px]"
          />
          <USelect
            :label="$t('status_request')"
            name="status"
            placeholder=""
            :options="statusList"
            v-model="filter.status"
            class="w-full lg:max-w-[240px]"
          />
        </div>
        <div class="flex justify-end md:items-end">
          <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
        </div>
      </div>
      </div>
      <div id="sailing-log-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-base text-grayy-25">{{ $t("all_request_form") }}</h1>
               <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2">
                  {{ documentList.length }} {{ $t("vessel_type_total") }}
               </div>
            </div>
         </div>
         <UTable @select="selectRow" :columns="columns" :rows="documentList"
             :ui="{
               base: 'u-table-list'
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

            <template #id-data="{ index }">
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>

            <template #vesselInfo-data="{ row }">
               <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                  <div>
                     <img :src="row.vesselFlagImage" :alt="row.vesselFlagName" class="w-6 h-6 rounded-[50%]" />
                  </div>
                  <div>
                     <h3 class="text-grayy-900 font-anuphan-medium">{{ row.vesselName }}</h3>
                     <p class="text-grayy-600">{{ row.imoNumber }}/{{ row.officialNumber }}</p>
                  </div>
               </div>
            </template>
            <template #statusDes-data="{ row }">
               <BadgeCr :label="row.statusDes" :type="row.status" />
            </template>

            <template #eta-data="{ row }">
               <div>{{ row.eta ? renderDateFormat(row.eta) : "" }}</div>
               <div class="text-grayy-75">{{ row.eta ? renderTimeFormat(row.eta) : "" }}</div>
            </template>

            <template #actions-data="{ row }">
               <UDropdown :items="getMenuTable(row)" @click.stop>
                  <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
               </UDropdown>
            </template>
         </UTable>
         <div class="flex justify-between px-6 py-3">
            <div class="flex items-center">
               <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
               <USelect :options="limitRowTable" v-model="filter.limit" />
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
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeCr from "~/components/badge/badgeCr.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import MarkerIcon from "~/assets/icons/fi-rs-marker.svg";
import NotebookIcon from "~/assets/icons/fi-rs-notebook.svg";

import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();

import useDocumentService from "~/core/services/documentService";
import type { IDocumentData } from "~/core/interfaces/IDocumentData";
const { getDocumentList } = useDocumentService();

import useBerthService from "~/core/services/masterDataShipService/port/berthService";
import type { IBerthGet, IJetty, IVesselType } from "~/core/interfaces/IBerth";
import type { IFilterBerth } from "~/core/interfaces/IFilterBerth";
const { getBerth } = useBerthService();

const { t, locale } = useI18n();
const isLoading = ref<boolean>(false);
const allowFetch = ref<boolean>(true);
const sortBy = ref<any>("eta");
const sortOrder = ref<any>("desc");
const sortField = ref("");
const filter = ref<any>({
   limit: 10,
   page: 1,
   search: "",
   status: "",
   berthId: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const filterBerth = ref<IFilterBerth>({
   limit: -1,
   page: 1,
   search: "",
   vessel_type_id: "",
   personType: "",
 
});
const statusList = ref<any>([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   //{ id: "PendingReview", name: `${locale.value === "en" ? "PendingReview" : "รอตรวจ"}` },
   { id: "PendingEdit", name: `${locale.value === "en" ? "PendingEdit" : "รอแก้ไข"}` },
   { id: "PendingConfirmation", name: `${locale.value === "en" ? "PendingConfirmation" : "รอยืนยันท่า"}` },
   { id: "PendingApproval", name: `${locale.value === "en" ? "PendingApproval" : "รออนุมัติ"}` },
   { id: "Approved", name: `${locale.value === "en" ? "Approved" : "อนุมัติแล้ว"}` },
   { id: "Canceled", name: `${locale.value === "en" ? "Canceled" : "ตัวแทนยกเลิก"}` },
   { id: "AdminCanceled", name: `${locale.value === "en" ? "AdminCanceled" : "เจ้าหน้าที่ยกเลิก"}` },
]);

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

const handleResetFilter = () => {
   allowFetch.value = true;
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.search = "";
   filter.value.status = "";
   filter.value.berthId = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   sortBy.value = null;
   sortOrder.value = null;
};

const columns = [
   {
      key: "id",
      label: t("number_no"),
      class: "w-[60px] text-center",
   },
   {
      key: "docNumber",
      label: t("request_number"),
      class: "text-center",
   },
   {
      key: "vesselInfo",
      label: t("rn_vn_imo_on"),
   },
   {
      key: "vesselTypeName",
      label: t("vessel_type"),
   },
   {
      key: "callSign",
      label: t("call_sign"),
   },
   {
      key: "berthNames",
      label: t("port_and_purpose"),
   },
   {
      key: "eta",
      label: t("eta"),
      //sortable: true,
   },
   {
      key: "statusDes",
      label: t("status_request"),
   },
   {
      key: "agencyName",
      label: t("agency_name"),
   },
   {
      key: "actions",
      sortable: false,
   },
];

const berthList = ref<IBerthGet[]>([
   {
      id: "",
      name: "All",
      name_th: "",
      name_en: "",
      name_alt: "",
      vessel_type_id: 0,
      vessel_type: {} as IVesselType,
      jettys: [] as IJetty[],
      status: false,
      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
   },
]);
const documentList = ref<any[]>([]);

onMounted(() => {
   fetchDocumentList();
   getBerthList();
});

const fetchDocumentList = async () => {
   isLoading.value = true;
   const resp = await getDocumentList(filter.value);
   if (resp.statusCode === 200) {
      documentList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

const getBerthList = async () => {
   isLoading.value = true;
   const res = await getBerth(filterBerth.value);
   if (res.statusCode === 200) {
      const berthListMap = res.data.data.map((item: IBerthGet) => ({ id: item.id, name: locale.value === "en" ? item.name_alt : item.name_alt }));
      berthList.value.push(...berthListMap);
   }
   isLoading.value = false;
};

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      created: filter.value.created,
      status: filter.value.status,
      search: filter.value.search,
      berthId: filter.value.berthId,
   }),
   (newValue, oldValue) => {
      if (newValue.search !== oldValue.search && newValue.search) {
         handleFilterSearch(500);
      } else if (newValue.page !== oldValue.page) {
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
   fetchDocumentList();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   fetchDocumentList();
};

const getMenuTable = (row: IDocumentData) => {
   if (row.status === "PendingCheck" || row.status === "PendingEdit" || row.status === "PendingApproval" || row.status === "PendingReview") {
      const items = [
         [
            {
               label: t("view"),
               avatar: {
                  src: ViewIcon,
               },
               click: () => {
                  vtmsStore.setVtmsDocumentStatus(row.status);
                  vtmsStore.setSailingLogType("request-form");
                  navigateTo(`/vtms/sailing-log/log/${row.id}`);
               },
            },
            {
               label: "บันทึกการทิ้งสมอ",
               avatar: {
                  src: MarkerIcon,
               },
               click: () => {
                  vtmsStore.setVtmsDocumentStatus(row.status);
                  vtmsStore.setSailingLogType("anchor-dropping");
                  navigateTo(`/vtms/sailing-log/log/${row.id}`);
               },
            },
         ],
      ];
      return items;
   } else if (row.status === "Approved") {
      const items = [
         [
            {
               label: t("view"),
               avatar: {
                  src: ViewIcon,
               },
               click: () => {
                  vtmsStore.setVtmsDocumentStatus(row.status);
                  vtmsStore.setSailingLogType("request-form");
                  navigateTo(`/vtms/sailing-log/log/${row.id}`);
               },
            },
            {
               label: "บันทึกการทิ้งสมอ",
               avatar: {
                  src: MarkerIcon,
               },
               click: () => {
                  vtmsStore.setVtmsDocumentStatus(row.status);
                  vtmsStore.setSailingLogType("anchor-dropping");
                  navigateTo(`/vtms/sailing-log/log/${row.id}`);
               },
            },
            {
               label: "บันทึกการเดินเรือ",
               avatar: {
                  src: NotebookIcon,
               },
               click: () => {
                  vtmsStore.setVtmsDocumentStatus(row.status);
                  vtmsStore.setSailingLogType("navigation");
                  navigateTo(`/vtms/sailing-log/log/${row.id}`);
               },
            },
         ],
      ];
      return items;
   } else {
      const items = [
         [
            {
               label: t("view"),
               avatar: {
                  src: ViewIcon,
               },
               click: () => {
                  vtmsStore.setVtmsDocumentStatus(row.status);
                  vtmsStore.setSailingLogType("request-form");
                  navigateTo(`/vtms/sailing-log/log/${row.id}`);
               },
            },
         ],
      ];
      return items;
   }
};

const selectRow = (row: any) => {
   const menuItems = getMenuTable(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
}

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const sortMapping: Record<string, string> = {
   vesselInfo: "vesselName",
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
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   filter.value.page = 1;
   fetchDocumentList();
};
</script>
