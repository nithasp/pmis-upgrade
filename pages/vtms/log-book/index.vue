<template>
   <div>
      <h1 class="font-anuphan-semi-bold text-[30px] text-black">Log Book</h1>

      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
         <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
               <Input
                  :label="'เลขที่คำร้อง/ชื่อเรือ/IMO/Official No.'"
                  name="keyword"
                  v-model="filter.keyword"
                  :placeholder="$t('search_title_placeholder')"
                  icon="i-heroicons-magnifying-glass-20-solid"
               />
            </div>
            <div class="col-span-3">
               <UFormGroup label="วันที่บันทึก">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                        placeholder="ค้นหา"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

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
                     v-model="filter.berth_id"
                     value-attribute="id"
                     option-attribute="name_th"
                     :options="berthList"
                     :placeholder="$t('search_status_placeholder')"
                     :ui="{
                        base: 'h-[36px] bg-white',
                        wrapper: 'rounded-md bg-white',
                     }"
                     @change="() => getLogBookList()"
                  />
               </UFormGroup> -->
               <USelect :label="$t('berth')" name="berth_id" placeholder="" :options="berthList" v-model="filter.berth_id" class="max-w-[240px] w-full" />
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
                        @change="() => getLogBookList()"
                     />
                  </UFormGroup> -->
                  <USelect :label="$t('status_request')" name="status" placeholder="" :options="statusList" v-model="filter.status" class="max-w-[240px] w-full" />

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
               <h1 class="font-normal text-lg text-white">{{ $t("logBook_topic") }}</h1>
               <div class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ total }} {{ $t("logBook_total") }}</div>
            </div>
            <div>
               <UButton
                  class="bg-white hover:bg-white text-grayy-400 [&_span]:font-anuphan-semi-bold mr-2"
                  outlined
                  icon="i-heroicons-plus-circle"
                  size="md"
                  label="เพิ่มเรือราชการ"
                  @click="navigateTo('/vtms/log-book/government/create')"
               />
            </div>
         </div>
         <UTable
            @select="selectRow"
            :columns="columns"
            :rows="logBookList"
            :ui="{
               base: 'u-table-list',
            }"
         >
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
                     <div class="text-grayy-75">{{ row && row.vessel_imo_number }}/{{ row && row.vessel_official_number }}</div>
                  </div>
               </div>
            </template>
            <template #status-data="{ row }">
               <BadgeCr :label="row.status" :type="row.status" />
            </template>
            <template #create_date-data="{ row }">
               <div>
                  {{ renderDateFormat(row.create_date) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.create_date) }}</div>
               </div>
            </template>
            <template #port-data="{ row }">
               <div>
                  {{ row.berth_name }}
                  <div class="text-grayy-75">{{ row.jetty_name }}</div>
               </div>
            </template>
            <template #actions-data="{ row }">
               <UDropdown
                  @click.stop
                  :items="getMenuTable(row)"
                  :ui="{
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
                  }"
               >
                  <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
               </UDropdown>
            </template>
         </UTable>
         <div class="flex justify-between px-6 py-3">
            <div class="flex items-center">
               <span class="text-sm text-grayy-75 mr-3.5">แสดง</span>
               <USelect :options="limitRowTable" v-model="filter.limit" />
            </div>

            <UPagination
               :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
               :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
               v-model="filter.page"
               :total="paginationData.totalItems"
               :page-count="filter.limit"
            />
         </div>
      </div>
      <DialogAlert title="ลบข้อมูล" desc="ข้อมูลนี้ถูกลบแล้ว" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
      <DialogConfirm
         :title="'ลบ Log Book '"
         :desc="'คุณต้องการลบ Log Book นี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก'"
         icon="danger"
         :labelConfirm="$t('confirm')"
         :isDialogOpen="isConfirmDeleteDialogOpen"
         :dialogCancel="dialogCancelDeleteLogBook"
         :dialogConfirm="dialogConfirmDeleteLogBook"
         color-confirm="red"
      />
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
import Badge from "~/components/badge/badge.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import DatePicker from "~/components/form/v-datepicker.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import { convertObjToQueryString, renderDateFormat, renderTimeFormat } from "~/utils/function.js";
import logBookService from "~/core/services/vtms/logBookService.ts";
import useBerthService from "~/core/services/masterDataShipService/port/berthService";
import type { IBerthGet, IJetty, IVesselType } from "~/core/interfaces/IBerth";
import type { IFilterBerth } from "~/core/interfaces/IFilterBerth";
import { watch } from "vue";
import { date } from "zod";
const { getBerth } = useBerthService();
const { t, locale } = useI18n();
const toast = useToast();
const router = useRouter();
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const logBookId = ref(0);
const { getVtmsLogBook, deleteVtmsLogBook } = logBookService();
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
      key: "create_date",
      label: "วันที่และเวลา",
   },
   {
      key: "port",
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
      key: "gross_tonnage",
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
   keyword: "",
   berth_id: "",
   status: "",
   begin: "",
   end: "",
   offset: 0,
   page: 1,
   limit: 10,
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const filterBerth = ref<IFilterBerth>({
   limit: -1,
   page: 1,
   search: "",
   vessel_type_id: "",
   personType: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const statusList = ref([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   { id: "Departure", name: `${locale.value === "en" ? "Departure" : "Departure"}` },
   { id: "Arrival", name: `${locale.value === "en" ? "Arrival" : "Arrival"}` },
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
         getLogBookList();
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
   () => dateValue.value,
   (value) => {
      console.log("watch", dateValue.value);
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
         console.log("beginDate", beginDate);
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
      getLogBookList();
   }
);
watch(
   () => filter.value.page,
   (value) => {
      getLogBookList();
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getLogBookList();
   }
);
watch([() => filter.value.status, () => filter.value.berth_id, () => filter.value.limit], ([status, berth_id, limit]) => {
   filter.value.page = 1;
   getLogBookList();
});
const rowData = ref(null);
const rowId = ref(0);
const getMenuTable = (row) => {
   const { id, status, agency_name } = row;
   const items = [
      [
         {
            label: "แก้ไข",
            avatar: {
               src: EditIcon,
            },
            click: () => {
               if (agency_name == "VTMS") {
                  navigateTo(`/vtms/log-book/government/edit?id=${id}`);
               } else {
                  navigateTo(`/vtms/log-book/edit?id=${id}`);
               }
            },
         },
         {
            label: "ลบ",
            avatar: {
               src: CrossIcon,
            },
            click: () => {
               isConfirmDeleteDialogOpen.value = true;
               logBookId.value = row.id;
            },
         },
      ],
   ];
   return items;
};
const logBookList = ref([]);
const total = ref(0);

onMounted(() => {
   getLogBookList();
   getBerthList();
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
const getLogBookList = async () => {
   try {
      console.log("getLogBookList");
      isLoading.value = true;
      // let query = {
      //    limit: filter.value.limit,
      //    page: filter.value.page,
      //    search: filter.value.keyword,
      //    status: filter.value.status,
      //    berth_id: filter.value.berth_id,
      //    date: dateValue.value,
      // };
      const resp = await getVtmsLogBook(filter.value);
      if (resp.statusCode === 200) {
         const { data, totalItems, totalPages } = resp.data;
         logBookList.value = data;
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
   filter.value.berth_id = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   dateValue.value = "";
   getLogBookList();
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
   getLogBookList();
};

const isConfirmDeleteDialogOpen = ref(false);

const dialogConfirmDeleteLogBook = async () => {
   isLoading.value = true;
   if (logBookId) {
      const resp = await deleteVtmsLogBook(logBookId.value);
      if (resp.statusCode === 200) {
         isDialogSuccessOpen.value = true;
      } else {
         isDialogSuccessOpen.value = true;
      }
   }

   isLoading.value = false;
   isConfirmDeleteDialogOpen.value = false;
};
const dialogCancelDeleteLogBook = () => {
   isConfirmDeleteDialogOpen.value = false;
};

const selectRow = (row: any) => {
   const menuItems = getMenuTable(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const sortMapping: Record<string, string> = {
   port: "berth_name",
   name: "vessel_name",
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
   getLogBookList();
};
</script>
