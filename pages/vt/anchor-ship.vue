<template>
   <div>
      <div id="log-book-form-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-lg text-white">{{ $t("anchor_topic") }}</h1>
               <div class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ total }} {{ $t("anchor_total") }}</div>
            </div>
            <!-- <div>
                       <UButton class="" outlined icon="i-heroicons-plus-circle" size="md" label="เรือกิจกรรม  />
                 
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
               <BadgeVt :label="row.status" :type="row.status" />
            </template>
            <template #anchor_date-data="{ row }">
               <div>
                  {{ renderDateFormat(row.anchor_date) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.anchor_date) }}</div>
               </div>
            </template>
            <template #pilot_date-data="{ row }">
               <div>
                  {{ renderDateFormat(row.pilot_date) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.pilot_date) }}</div>
               </div>
            </template>
            <template #aweigh_date-data="{ row }">
               <div>
                  {{ renderDateFormat(row.aweigh_date) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.aweigh_date) }}</div>
               </div>
            </template>
            <template #location-data="{ row }">
               <div>
                  {{ row.latitude }}
                  <div class="text-grayy-75">{{ row.longitude }}</div>
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

import { format, isSameDay, sub } from "date-fns";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeVt from "~/components/badge/badgeVt.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import MarkerIcon from "~/assets/icons/fi-rs-marker.svg";
import NotebookIcon from "~/assets/icons/fi-rs-notebook.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";

// import { convertObjToQueryString, renderDateFormat, renderTimeFormat } from "~/utils/function.js";
// import vtService from "~/core/services/vtms/tableService.ts";
import vtmsAnchorService from "~/core/services/vtms/anchorService.ts";
import { watch } from "vue";
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
// const { getVt } = vtService();
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
      key: "location",
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
const filter = ref({ keyword: "", port: "", status: "Anchor", offset: 0, page: 1, limit: 10, Order: [{ column: sortField.value, dir: sortOrder.value }] });
const statusList = ref([
   { status: "", text: "ทุกประเภท" },
   { status: "true", text: "เปิดใช้งาน" },
   { status: "false", text: "ปิดใช้งาน" },
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
   const items = [
      [
         {
            label: "แก้ไข",
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`vtms/anchor-ship/edit?id=${row.id}`);
            },
         },
         {
            label: "ลบ",
            avatar: {
               src: CrossIcon,
            },
            click: () => {
               isConfirmDeleteDialogOpen.value = true;
               rowId.value = row.id;
            },
         },
      ],
   ];
   return items;
};
const vtList = ref([]);
const total = ref(0);

onMounted(() => {
   getVtList();
});
const getVtList = async () => {
   try {
      isLoading.value = true;
      let query = {
         limit: filter.value.limit,
         page: filter.value.page,
         search: filter.value.keyword,
         status: filter.value.status,
         Order: [{ column: sortField.value, dir: sortOrder.value }]
      };
      const resp = await getVtmsAnchor(query);
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
const isAlertDialogActivateOpen = ref(false);
const modalAlertMessage = ref("");
const modalTitleDialog = ref("");
const modalAlertType = ref("");

const isConfirmDeleteDialogOpen = ref(false);
const dialogConfirmDelete = async () => {
   isLoading.value = true;
   if (rowId) {
      const resp = await deleteVtmsAnchor(rowId.value);
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

   isLoading.value = false;
   isConfirmDeleteDialogOpen.value = false;
};
const dialogCloseDelete = () => {
   isConfirmDeleteDialogOpen.value = false;
   getVtList();
};
const handleCloseAlertDialogActivate = () => {
   isAlertDialogActivateOpen.value = false;
   getVtList();
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
   location: "latitude",
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
