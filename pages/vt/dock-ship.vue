<template>
   <div>
      <div id="log-book-form-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-lg text-white">{{ $t("dock_ship_topic") }}</h1>
               <div class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ total }} {{ $t("dock_ship_total") }}
               </div>
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
            <template #mooring_date-data="{ row }">
               <div>
                  {{ renderDateFormat(row.mooring_date) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.mooring_date) }}</div>
               </div>
            </template>

            <template #berth_name-data="{ row }">
               <p class="font-anuphan-medium text-gray-900">{{ row.berth_name }}</p>
               <p class="text-gray-600">{{ row.jetty_name }}</p>
            </template>

            <template #gross_tonnage_depth-data="{ row }">
               <div>
                  {{ row.gross_tonnage }}
                  <div class="text-grayy-75">{{ row.depth }}</div>
               </div>
            </template>
            <template #updated_at-data="{ row }">
               <div>
                  {{ renderDateFormat(row.updated_at) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.updated_at) }}</div>
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
import BadgeVt from "~/components/badge/badgeVt.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import MarkerIcon from "~/assets/icons/fi-rs-marker.svg";
import NotebookIcon from "~/assets/icons/fi-rs-notebook.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";

import { convertObjToQueryString, renderDateFormat, renderTimeFormat } from "~/utils/function.js";
import logBookService from "~/core/services/vtms/logBookService.ts";
const { getVtmsLogBook } = logBookService();

import { watch } from "vue";
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });

// const { getVt } = vtService();
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
      key: "mooring_date",
      label: "วันที่เทียบท่า",
   },
   {
      key: "berth_name",
      label: "ท่าเรือ/ท่าเรือย่อย",
   },
   {
      key: "document_number",
      label: "เลขที่คำร้อง",
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
      key: "gross_tonnage_depth",
      label: "GRT/Draft",
   },
   {
      key: "voyage",
      label: "Voyage",
   },
   {
      key: "purpose_name",
      label: "วัตถุประสงค์",
   },
   {
      key: "agency_name",
      label: "Agency Name",
   },
   {
      key: "actions",
      sortable: false,
   },
];
const filter = ref({
   keyword: "", port: "", status: "", offset: 0, page: 1, limit: 10, Order: [{ column: sortField.value, dir: sortOrder.value }]
});
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
            label: "ดู",
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               navigateTo(`/vtms/sailing-log/log/${row.id}`);
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
         // search: filter.value.keyword,
         // status: filter.value.status,
         log_type: "dock",
         Order: [{ column: sortField.value, dir: sortOrder.value }]
      };
      const resp = await getVtmsLogBook(query);
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
   name: "vessel_name",
   gross_tonnage_depth: "gross_tonnage",
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
