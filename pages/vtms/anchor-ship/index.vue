<template>
   <div>
      <h1 class="font-anuphan-semi-bold text-[30px] text-black">เรือทิ้งสมอ</h1>

      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
         <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
               <Input :label="'เลขที่คำร้อง/ชื่อเรือ/IMO/Official No.'" name="keyword" v-model="filter.keyword"
                  :placeholder="$t('search_title_placeholder')" icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <div class="col-span-3">
               <UFormGroup label="วันที่ถอนสมอ">
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
               <!-- <UFormGroup :label="'ท่าเรือ'">
                  <USelectMenu
                     class="max-w-[512px]"
                     color="purple"
                     variant="outline"
                     v-model="filter.port"
                     value-attribute="status"
                     option-attribute="text"
                     :options="statusList"
                     :placeholder="$t('search_status_placeholder')"
                     :ui="{
                        base: 'h-[36px] bg-white',
                        wrapper: 'rounded-md bg-white',
                     }"
                     @change="() => getAnchorShipList()"
                  />
               </UFormGroup> -->
               <USelect :label="$t('berth')" name="berth_id" placeholder="" :options="berthList"
                  v-model="filter.berth_id" class="max-w-[240px] w-full" />
            </div>
            <div class="col-span-3">
               <div class="flex">
                  <!-- <UFormGroup :label="'สถานะ'" class="" style="width: 100%">
                     <USelectMenu
                        class="max-w-[512px]"
                        color="purple"
                        variant="outline"
                        v-model="filter.status"
                        value-attribute="status"
                        option-attribute="text"
                        :options="statusList"
                        :placeholder="$t('search_status_placeholder')"
                        :ui="{
                           base: 'h-[36px] bg-white',
                           wrapper: 'rounded-md bg-white',
                        }"
                        @change="() => getAnchorShipList()"
                     />
                  </UFormGroup> -->
                  <USelect :label="$t('status')" name="status" placeholder="" :options="statusList"
                     v-model="filter.status" class="max-w-[240px] w-full" />
                  <div class="ml-2 mt-7">
                     <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div id="log-book-form-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-lg text-white">{{ $t("anchor_topic") }}</h1>
               <div class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ total }} {{ $t("anchor_total") }}</div>
            </div>
            <div>
               <UButton class="bg-white hover:bg-white text-grayy-400 [&_span]:font-anuphan-semi-bold" outlined
                  icon="i-heroicons-plus-circle" size="md" label="เพิ่มเรือทิ้งสมอ"
                  @click="navigateTo(`/vtms/anchor-ship/create`)" />
            </div>
         </div>
         <UTable @select="selectRow" :columns="columns" :rows="anchorList" :ui="{
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
                  <UAvatar v-if="row.vessel_flag" size="xs" :src="row.vessel_flag" alt="Avatar" />
                  <div class="ml-3">
                     <div class="text-black font-semibold">
                        {{ row.vessel_name }}
                     </div>
                     <div class="text-grayy-75">{{ row && row.vessel_imo_number }}/{{ row && row.vessel_official_number
                        }}</div>
                  </div>
               </div>
            </template>
            <template #status-data="{ row }">
               <!-- <Badge :label="getVtmsStatus(row.status, 'label')" :type="getVtmsStatus(row.status, 'type')" /> -->
               <BadgeCr :label="row.status" :type="row.status" />
            </template>
            <template #anchor_date-data="{ row }">
               <div>
                  {{ row.anchor_date ? renderDateFormat(row.anchor_date) : "" }}
                  <div class="text-grayy-75">{{ row.anchor_date ? renderTimeFormat(row.anchor_date) : "" }}</div>
               </div>
            </template>
            <template #pilot_date-data="{ row }">
               <div>
                  {{ row.pilot_date ? renderDateFormat(row.pilot_date) : "" }}
                  <div class="text-grayy-75">{{ row.pilot_date ? renderTimeFormat(row.pilot_date) : "" }}</div>
               </div>
            </template>
            <template #aweigh_date-data="{ row }">
               <div>
                  {{ row.aweigh_date ? renderDateFormat(row.aweigh_date) : "" }}
                  <div class="text-grayy-75">{{ row.aweigh_date ? renderTimeFormat(row.aweigh_date) : "" }}</div>
               </div>
            </template>

            <template #actions-data="{ row }">
               <UDropdown @click.stop :items="getMenuTable(row)" :ui="{
                  rounded: 'rounded-lg',
                  width: 'max-w-[158px]',
                  item: {
                     base: 'hover:bg-grayy-50',
                     label: 'font-anuphan-medium text-grayy-400 ml-1',
                     size: 'text-sm',
                     avatar: {
                        base: '[&_img]:rounded-none [&_img]:w-4 [&_img]:h-4',
                     },
                     padding: 'p-[8px_6px_8px_12px]',
                  },
               }">
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
      <DialogAlert title="ลบข้อมูล" desc="ข้อมูลนี้ถูกลบแล้ว" type="success" :isOpen="isDialogSuccessOpen"
         :setDialog="handleCloseSuccessDialog" />
      <DialogAlert :isOpen="isAlertDialogActivateOpen" :desc="modalAlertMessage" :title="modalTitleDialog"
         :type="modalAlertType" :setDialog="handleCloseAlertDialogActivate" />
      <DialogConfirm :title="$t('delete_anchor')" :desc="$t('confirm_delete_anchor')" icon="danger"
         :labelConfirm="$t('confirm')" :labelCancel="$t('cancel')" :isDialogOpen="isConfirmDeleteDialogOpen"
         :dialogCancel="dialogCloseDelete" :dialogConfirm="dialogConfirmDelete" color-confirm="red" />
      <Loading v-if="isLoading" />
   </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import BadgeCr from "~/components/badge/badgeCr.vue";
import { format, isSameDay, sub } from "date-fns";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import Badge from "~/components/badge/badge.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import DatePicker from "~/components/form/v-datepicker.vue";

import { convertObjToQueryString, renderDateFormat, renderTimeFormat } from "~/utils/function.js";
import vtmsAnchorService from "~/core/services/vtms/anchorService.ts";
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
const { getVtmsAnchor, deleteVtmsAnchor } = vtmsAnchorService();
const sortField = ref("");
const sortOrder = ref("");
const columns = [
   {
      key: "id",
      label: "ลำดับ",
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: "สถานะ",
      class: "w-[97px] text-center",
   },
   {
      key: "anchor_date",
      label: "วันที่ทอดสมอ",
   },
   {
      key: "berth_name",
      label: "ท่าเรือ",
      class: "w-[70px] text-center",
   },
   {
      key: "name",
      label: "ชื่อเรือ/IMO/Official No.",
      class: "w-[70px] text-center",
   },
   {
      key: "vessel_type_name",
      label: "ประเภทเรือ",
   },
   {
      key: "pilot_date",
      label: "วันที่นัดนำร่อง",
   },
   {
      key: "aweigh_date",
      label: "วันที่ถอนสมอ",
   },
   {
      key: "latitude",
      label: "ละติจูด/ลองจิจูด",
   },
   {
      key: "duration",
      label: "เวลารวม",
   },
   {
      key: "remark",
      label: "หมายเหตุ",
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
   keyword: "", berth_id: "", status: "", begin: "", end: "", offset: 0, page: 1, limit: 10, Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const filterBerth = ref<IFilterBerth>({
   limit: -1,
   page: 1,
   search: "",
   vessel_type_id: "",
   personType: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]

});
// const statusList = ref([
//    { status: "", text: "ทุกประเภท" },
//    { status: "true", text: "เปิดใช้งาน" },
//    { status: "false", text: "ปิดใช้งาน" },
// ]);
const statusList = ref<any>([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   { id: "anchor", name: `${locale.value === "en" ? "Anchor" : "Anchor"}` },
   { id: "aweigh", name: `${locale.value === "en" ? "Aweigh" : "Aweigh"}` },
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
         getAnchorShipList();
      }, 800);
   }
);
watch(
   () => selectedDate.value,
   (value) => {
      dateValue.value = value;
      getAnchorShipList();
   }
);
watch(
   () => dateValue.value,
   (value) => {
      // const beginDate = value ? new Date(value.start).toISOString() : "";
      // const endDate = value ? new Date(value.end).toISOString() : "";
      // filter.value.begin = beginDate;
      // filter.value.end = endDate;
      if (value) {
         const beginDate = value && value.start ? new Date(value.start) : null;
         const endDate = value && value.end ? new Date(value.end) : null;
         if (beginDate instanceof Date && !isNaN(beginDate)) {
            beginDate.setHours(7, 0, 0, 0);
         }
         if (endDate instanceof Date && !isNaN(endDate)) {
            endDate.setHours(23, 59, 59, 999);
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
         filter.value.begin = new Date(beginDateFormatted).toISOString();
         filter.value.end = new Date(endDateFormatted).toISOString();
      } else {
         filter.value.begin = "";
         filter.value.end = "";
      }
      filter.value.page = 1;
      getAnchorShipList();
   }
);
watch(
   () => filter.value.page,
   (value) => {
      getAnchorShipList();
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getAnchorShipList();
   }
);
const rowData = ref(null);
const rowId = ref(0);
const getMenuTable = (row) => {
   const { id, status } = row;
   const items = [
      [
         {
            label: "แก้ไข",
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`/vtms/anchor-ship/edit?id=${id}`);
            },
         },
         {
            label: "ลบ",
            avatar: {
               src: CrossIcon,
            },
            click: () => {
               isConfirmDeleteDialogOpen.value = true;
               anchorId.value = row.id;
            },
         },
      ],
   ];
   return items;
};
const anchorList = ref([]);
const anchorId = ref(0);
const total = ref(0);

onMounted(() => {
   getBerthList();
   getAnchorShipList();
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
watch([() => filter.value.status, () => filter.value.berth_id, () => filter.value.limit], ([status, berth_id, limit]) => {
   filter.value.page = 1;
   getAnchorShipList();
});
const getAnchorShipList = async () => {
   try {
      isLoading.value = true;
      // let queryString = convertObjToQueryString({
      //    limit: filter.value.limit,
      //    page: filter.value.page,
      //    search: filter.value.keyword,
      //    status: filter.value.status,
      //    port: filter.value.port,
      // });
      const resp = await getVtmsAnchor(filter.value);
      if (resp.statusCode === 200) {
         const { data, totalItems, totalPages } = resp.data;
         anchorList.value = data;
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
   console.log("handle");
   filter.value.keyword = "";
   filter.value.status = "";
   filter.value.offset = 0;
   filter.value.page = 1;
   filter.value.berth_id = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   dateValue.value = "";
   getAnchorShipList();
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
const isAlertDialogActivateOpen = ref(false);
const modalAlertMessage = ref("");
const modalTitleDialog = ref("");
const modalAlertType = ref("");
const dialogCancel = () => {
   setDialogStatus(false);
};

const isConfirmDeleteDialogOpen = ref(false);
const dialogConfirmDelete = async () => {
   isLoading.value = true;
   if (rowId) {
      const resp = await deleteVtmsAnchor(anchorId.value);
      if (resp.statusCode === 200) {
         isAlertDialogActivateOpen.value = true;
         modalTitleDialog.value = t("delete_anchor");
         modalAlertMessage.value = t("delete_anchor_success");
         modalAlertType.value = "success";
      } else {
         isAlertDialogActivateOpen.value = true;
         modalTitleDialog.value = t("delete_anchor");
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }
   getAnchorShipList();
   isLoading.value = false;
   isConfirmDeleteDialogOpen.value = false;
};
const dialogCloseDelete = () => {
   isConfirmDeleteDialogOpen.value = false;
   getAnchorShipList();
};
const handleCloseAlertDialogActivate = () => {
   isAlertDialogActivateOpen.value = false;
   getAnchorShipList();
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

const filteredColumns = computed(() => columns.filter((column) => !["id", "remark", "actions"].includes(column.key)));
const sortMapping: Record<string, string> = {};
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
   getAnchorShipList();
};
</script>
