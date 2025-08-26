<template>
   <div>
      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
         <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
               <Input :label="'เลขที่คำร้อง/ชื่อเรือ/IMO/Official No.'" name="keyword" v-model="filter.keyword"
                  :placeholder="$t('search_title_placeholder')" icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <div class="col-span-3">
               <UFormGroup :label="$t('eta')">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                        :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                        placeholder="ค้นหา" :ui="{
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
            <div class="col-span-3">
               <!-- <UFormGroup :label="$t('berth_select')">
                  <USelectMenu
                     class="max-w-[512px]"
                     color="purple"
                     variant="outline"
                     v-model="filter.port"
                     value-attribute="status"
                     option-attribute="text"
                     :options="portList"
                     :placeholder="$t('berth_select')"
                     :ui="{
                        base: 'h-[36px] bg-white',
                        wrapper: 'rounded-md bg-white',
                     }"
                     @change="() => getVtList()"
                  />
               </UFormGroup> -->
               <USelect :label="$t('berth')" name="berth_id" placeholder="" :options="berthList"
                  v-model="filter.berthId" class="max-w-[240px] w-full" />
            </div>
            <div class="col-span-3">
               <div class="flex">
                  <!-- <UFormGroup :label="$t('vtms_request_table_status_request')" class="" style="width: 100%">
                     <USelectMenu
                        class="max-w-[512px]"
                        color="purple"
                        variant="outline"
                        v-model="filter.status"
                        value-attribute="status"
                        option-attribute="text"
                        :options="statusList"
                        :placeholder="$t('vtms_request_table_status_request')"
                        :ui="{
                           base: 'h-[36px] bg-white',
                           wrapper: 'rounded-md bg-white',
                        }"
                        @change="() => getVtList()"
                     />
                  </UFormGroup> -->
                  <USelect :label="$t('status_request')" name="status" placeholder="" :options="statusList"
                     v-model="filter.status" class="max-w-[240px] w-full" />
                  <div class="ml-2 mt-7">
                     <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div id="request-form-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-lg text-white">{{ $t("vtList_topic") }}</h1>
               <div class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ total }} {{ $t("vtList_total") }}</div>
            </div>
            <!-- <div>
               <RequestListDialog @fetch="getVtList">
                  <template #activator="{ on }">
                     <UButton class="" outlined icon="i-heroicons-plus-circle" size="md" label="เพิ่ม" v-on="on" />
                  </template>
               </RequestListDialog>
            </div> -->
         </div>
         <UTable @select="selectRow" :columns="columns" :rows="vtList" :ui="{
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

            <template #id-data="{ index }">
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>
            <template #name-data="{ row }">
               <div class="flex items-center">
                  <UAvatar v-if="row.vesselFlagImage" size="xs" :src="row.vesselFlagImage" alt="Avatar" />
                  <div class="ml-3">
                     <div class="text-black font-semibold">
                        {{ row.vesselName }}
                     </div>
                     <div class="text-grayy-75">{{ row && row.imoNumber }}/{{ row && row.officialNumber }}</div>
                  </div>
               </div>
            </template>
            <template #berth-names-data="{ row }">
               <div>{{ row.berthNames }}</div>
               <div class="text-grayy-75">{{ row.purpose }}</div>
            </template>

            <template #status-data="{ row }">
               <BadgeCr :label="row.statusDes" :type="row.status" />
            </template>
            <template #vesselStatusDesEn-data="{ row }">
               <BadgeVt :label="row.vesselStatusDesEn" :type="row.vesselStatusDesEn" />
            </template>
            <template #eta-data="{ row }">
               <div>
                  {{ renderDateFormat(row.eta) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.eta) }}</div>
               </div>
            </template>
            <template #actions-data="{ row }">
               <UDropdown :items="getMenuTable(row)" @click.stop>
                  <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
               </UDropdown>
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
      <DialogAlert title="บันทึกข้อมูล" desc="ข้อมูลนี้ถูกบันทึกแล้ว" type="success" :isOpen="isDialogSuccessOpen"
         :setDialog="handleCloseSuccessDialog" />
      <Loading v-if="isLoading" />
   </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import { format, isSameDay, sub } from "date-fns";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading";
import DialogAlert from "~/components/dialog/alert.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeCr from "~/components/badge/badgeCr.vue";
import BadgeVt from "~/components/badge/badgeVt.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import MarkerIcon from "~/assets/icons/fi-rs-marker.svg";
import NotebookIcon from "~/assets/icons/fi-rs-notebook.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import DatePicker from "~/components/form/v-datepicker.vue";

import { convertObjToQueryString, renderDateFormat, renderTimeFormat } from "~/utils/function.js";
import vtService from "~/core/services/vtms/tableService.ts";
import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();

import useBerthService from "~/core/services/masterDataShipService/port/berthService";
import type { IBerthGet, IJetty, IVesselType } from "~/core/interfaces/IBerth";
import type { IFilterBerth } from "~/core/interfaces/IFilterBerth";
import { watch } from "vue";
const { getBerth } = useBerthService();
const { t, locale } = useI18n();
const toast = useToast();
const router = useRouter();
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const { getVt } = vtService();
const sortField = ref("");
const sortOrder = ref("");
const columns = [
   {
      key: "id",
      label: "ลำดับ",
      class: "w-[60px] text-center",
   },
   {
      key: "vesselStatusDesEn",
      label: "สถานะเรือ",
      class: "w-[97px] text-center",
   },
   {
      key: "docNumber",
      label: "เลขที่คำร้อง",
      class: "w-[70px] text-center",
   },
   {
      key: "name",
      label: "ชื่อเรือ/IMO/Official No.",
      class: "w-[70px] text-center",
   },
   {
      key: "vesselTypeName",
      label: "ประเภทเรือ",
   },
   {
      key: "berthNames",
      label: "ท่าเรือ/วัตถุประสงค์",
   },
   {
      key: "eta",
      label: "ETA",
   },
   {
      key: "agencyName",
      label: "Agency Name",
   },
   {
      key: "status",
      label: "สถานะคำร้อง",
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
const filter = ref({
   keyword: "", berthId: "", status: "", etaBegin: "", etaEnd: "", offset: 0, page: 1, limit: 10, Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const filterBerth = ref<IFilterBerth>({
   limit: -1,
   page: 1,
   search: "",
   vessel_type_id: "",
   personType: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const statusList = ref<any>([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   //{ id: "PendingReview", name: `${locale.value === "en" ? "Pending Review" : "รอตรวจ"}` },
   { id: "PendingEdit", name: `${locale.value === "en" ? "Pending Edit" : "รอแก้ไข"}` },
   { id: "PendingConfirmation", name: `${locale.value === "en" ? "Pending Confirmation" : "รอยืนยันท่า"}` },
   { id: "PendingApproval", name: `${locale.value === "en" ? "Pending Approval" : "รออนุมัติ"}` },
   //{ id: "Approved", name: `${locale.value === "en" ? "Approved" : "รอแก้ไข"}` },
   { id: "Canceled", name: `${locale.value === "en" ? "Canceled" : "ตัวแทนยกเลิก"}` },
   { id: "AdminCanceled", name: `${locale.value === "en" ? "Admin Canceled" : "เจ้าหน้าที่ยกเลิก"}` },
]);

const isLoading = ref(false);
let debounceTimer;
watch(
   () => filter.value.keyword,
   (newKeyword) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         filter.value.offset = 0;
         filter.value.page = 1;
         getVtList();
      }, 800);
   }
);
watch(
   () => selectedDate.value,
   (value) => {
      dateValue.value = value;
      // getVtList();
   }
);
watch(
   () => dateValue.value,
   (value) => {
      // const beginDate = value ? new Date(value.start).toISOString() : "";
      // const endDate = value ? new Date(value.end).toISOString() : "";
      // filter.value.etaBegin = beginDate;
      // filter.value.etaEnd = endDate;
      if (value) {
         const beginDate = value && value.start ? new Date(value.start) : null;
         const endDate = value && value.end ? new Date(value.end) : null;
         if (beginDate instanceof Date && !isNaN(beginDate)) {
            beginDate.setHours(7, 0, 0, 0);
         }
         if (endDate instanceof Date && !isNaN(endDate)) {
            endDate.setHours(7, 0, 0, 0);
         }
         const options = {
            timeZone: "Asia/Bangkok",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
         };
         const beginDateFormatted = beginDate ? beginDate.toLocaleString("en-US", options) : "";
         const endDateFormatted = endDate ? endDate.toLocaleString("en-US", options) : "";
         filter.value.etaBegin = new Date(beginDateFormatted).toISOString();
         filter.value.etaEnd = new Date(endDateFormatted).toISOString();
      } else {
         filter.value.etaBegin = "";
         filter.value.etaEnd = "";
      }
      filter.value.page = 1;
      getVtList();
   }
);
watch(
   () => filter.value.page,
   (value) => {
      getVtList();
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getVtList();
   }
);
const rowData = ref(null);
const rowId = ref(0);
const getMenuTable = (row) => {
   const { id, status } = row;
   console.log("request status", status);
   if (status === "Approved") {
      const items = [
         [
            {
               label: "ดู",
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
   } else if (status === "Canceled" || status === "") {
      const items = [
         [
            {
               label: "ดู",
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
   } else {
      const items = [
         [
            {
               label: "ดู",
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
   }
};
const vtList = ref([]);
const total = ref(0);

onMounted(() => {
   console.log("vtList");
   getBerthList();
   getVtList();
});
const getBerthList = async () => {
   isLoading.value = true;
   const res = await getBerth(filterBerth.value);
   if (res.statusCode === 200) {
      const berthListMap = res.data.data.map((item: IBerthGet) => ({ id: item.id, name: locale.value === "en" ? item.name_alt : item.name_alt }));
      berthList.value.push(...berthListMap);
   }
   isLoading.value = false;
};
watch([() => filter.value.status, () => filter.value.berthId, () => filter.value.limit], ([status, berthId, limit]) => {
   filter.value.page = 1;
   getVtList();
});
const getVtList = async () => {
   try {
      isLoading.value = true;
      // let queryString = convertObjToQueryString({
      //    limit: filter.value.limit,
      //    page: filter.value.page,
      //    search: filter.value.keyword,
      //    status: filter.value.status,
      // });
      const resp = await getVt(filter.value);
      if (resp.statusCode === 200) {
         const { data, totalItems, totalPages } = resp.data;
         vtList.value = data;
         total.value = totalItems;
         paginationData.value.totalItems = totalItems;
         paginationData.value.totalPages = totalPages;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const handleClickResetFitler = () => {
   filter.value.keyword = "";
   filter.value.status = "";
   filter.value.offset = 0;
   filter.value.page = 1;
   filter.value.berthId = "";
   filter.value.etaBegin = "";
   filter.value.etaEnd = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   dateValue.value = "";
   getVtList();
};
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

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
const dialogCancel = () => {
   setDialogStatus(false);
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

const filteredColumns = computed(() => columns.filter((column) => !["id","vesselStatusDesEn", "actions"].includes(column.key)));
const sortMapping: Record<string, string> = {
   name: "vesselName",
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
   getVtList();
};
</script>
