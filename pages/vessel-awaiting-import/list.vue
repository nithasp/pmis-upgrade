<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("รายการเรือรอนำเข้า") }}</h1>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-[1fr_auto] gap-1">
         <div>
            <div class="grid grid-cols-3 gap-4">
               <div class="col-span-1">
                  <Input :label="`${$t('request_number')}/${$t('vessel_name')}/${$t('IMO')}/${$t('Official No.')}`"
                     name="search" :placeholder="$t('search_title_placeholder')" v-model="search"
                     icon="i-heroicons-magnifying-glass-20-solid" @input="handleSearchFilter" />
               </div>
               <div class="col-span-1">
                  <USelectMultiple :label="$t('purpose_type')" :options="documentOptionsStore.purposeTypeOptions"
                     placeholder="ทั้งหมด" multiple v-model="divisionIds" />
               </div>
               <div class="col-span-1">
                  <USelectMultiple :label="$t('port')" :options="documentOptionsStore.berthsOption"
                     placeholder="ทั้งหมด" multiple v-model="berthIds" />
               </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-3">
               <div class="col-span-1">
                  <UFormGroup :label="$t('arrival_date')">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input name="mooring_date" size="md" variant="outline" color="purple" custom-icon="calendar"
                           :value="mooringDateValue ? `${format(mooringDateValue.start, 'd MMM, yyyy')} - ${format(mooringDateValue.end, 'd MMM, yyyy')}` : ''"
                           :placeholder="$t('arrival_date')" :ui="{ wrapper: 'w-full rounded-md bg-white' }" />
                        <template #panel="{ close }">
                           <DatePicker v-model="selectMooringDate" @close="close" :onDateChange="onMooringDateChange" />
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
               <div class="col-span-1">
                  <div class="flex items-end">
                     <div class="w-full">
                        <UFormGroup :label="$t('departure_date')">
                           <UPopover :popper="{ placement: 'bottom-start' }">
                              <Input name="departure_date" size="md" variant="outline" color="purple"
                                 custom-icon="calendar"
                                 :value="unmooringDateValue ? `${format(unmooringDateValue.start, 'd MMM, yyyy')} - ${format(unmooringDateValue.end, 'd MMM, yyyy')}` : ''"
                                 :placeholder="$t('departure_date')" :ui="{ wrapper: 'w-full rounded-md bg-white' }" />
                              <template #panel="{ close }">
                                 <DatePicker v-model="selectUnmooringDate" @close="close"
                                    :onDateChange="onUnmooringDateChange" />
                              </template>
                           </UPopover>
                        </UFormGroup>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="ml-2 mb-0.5 content-end">
            <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
         </div>
      </div>
   </div>
   <div id="request-form-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-lg text-white">{{ $t("รายการเรือรอนำเข้าทั้งหมด") }}</h1>
            <div v-if="search || documentStatus || berthId || dateValue"
               class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">
               {{ paginationData.totalItems }} รายการ
            </div>
         </div>
      </div>
      <div class="w-full overflow-y-auto">
         <div class="u-table-list-custom min-w-[1700px] table-auto border-collapse overflow-hidden">
            <div
               class="table-header tr grid grid-cols-[83px_130px_200px_105px_280px_133px_99px_254px_171px_130px_50px] border-b bg-purple-25 text-grayy-75 font-anuphan-semi-bold text-sm">
               <div class="th flex px-4 py-3.5 whitespace-nowrap justify-center">
                  <span>{{ t("number_no") }}</span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('mooring_date')">
                  <span class="flex items-center">
                     {{ t("วันที่เรือเข้า") }}
                     <span :class="getSortIcon('mooring_date')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('departure_date')">
                  <span class="flex items-center">
                     {{ t("วันที่เรือออก") }}
                     <span :class="getSortIcon('departure_date')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-5 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('document_number')">
                  <span class="flex items-center">
                     {{ t("เลขที่คำร้อง") }}
                     <span :class="getSortIcon('document_number')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('vessel_name')">
                  <span class="flex items-center">
                     {{ t("ชื่อเรือ/IMO/Official No.") }}
                     <span :class="getSortIcon('vessel_name')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('vessel_type_name')">
                  <span class="flex items-center">
                     {{ t("ประเภทเรือ") }}
                     <span :class="getSortIcon('vessel_type_name')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('gross_tonnage')">
                  <span class="flex items-center">
                     {{ t("GRT") }}
                     <span :class="getSortIcon('gross_tonnage')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('berth_name')">
                  <span class="flex items-center">
                     {{ t("ท่าเรือ/ท่าเรือย่อย") }}
                     <span :class="getSortIcon('berth_name')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('purpose_type_name')">
                  <span class="flex items-center">
                     {{ t("ประเภทวัตถุประสงค์") }}
                     <span :class="getSortIcon('purpose_type_name')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('purpose_name')">
                  <span class="flex items-center">
                     {{ t("วัตถุประสงค์") }}
                     <span :class="getSortIcon('purpose_name')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap cursor-pointer" @click="sortTable('updated_date')">
                  <span class="flex items-center">
                     {{ t("วันที่อัปเดต") }}
                     <span :class="getSortIcon('updated_date')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>
            </div>

            <div class="table-body">
               <template v-if="vtmsLogBookList.length" v-for="(row, index) in vtmsLogBookList" :key="row.id">
                  <div
                     class="tr grid grid-cols-[83px_130px_200px_105px_280px_133px_99px_254px_171px_130px_50px] border-b items-center text-grayy-900 text-sm">
                     <div class="td text-center p-3">
                        {{ getNumCountPagination(index, filter.page, filter.limit) }}
                     </div>
                     <div class="td p-3">
                        <div class="text-black font-anuphan-semi-bold">{{ row.mooring_date &&
                           renderDateFormat(row.mooring_date) }}</div>
                        <div class="text-grayy-75">{{ row.mooring_date && renderTimeFormat(row.mooring_date) }}</div>
                     </div>
                     <div class="td p-3">
                        <div class="text-black font-anuphan-semi-bold">{{ row.departure_date &&
                           renderDateFormat(row.departure_date) }}</div>
                        <div class="text-grayy-75">{{ row.departure_date && renderTimeFormat(row.departure_date) }}
                        </div>
                     </div>
                     <div class="td p-3">{{ row.document_number }}</div>
                     <div class="td p-3">
                        <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                           <img v-if="row.vessel_flag" :src="row.vessel_flag" alt="Flag" class="w-6 h-6 rounded-full" />
                           <div>
                              <h3 class="text-gray-900 font-anuphan-semi-bold">{{ row.vessel_name }}</h3>
                              <p class="text-grayy-75">{{ row.vessel_imo_number }}/{{ row.vessel_official_number }}</p>
                           </div>
                        </div>
                     </div>
                     <div class="td p-3">{{ row.vessel_type_name }}</div>
                     <div class="td p-3">{{ formatNumber(row.gross_tonnage) }}</div>
                     <div class="td p-3">
                        <p class="font-anuphan-semi-bold text-gray-900">{{ row.berth_name }}</p>
                        <p class="text-grayy-75">{{ row.jetty_name }}</p>
                     </div>
                     <div class="td p-3">{{ row.purpose_type_name }}</div>
                     <div class="td p-3">{{ row.purpose_name }}</div>
                     <div class="td p-3">
                        <div class="text-black font-anuphan-semi-bold">{{ row.updated_date &&
                           renderDateFormat(row.updated_date) }}</div>
                        <div class="text-grayy-75">{{ row.updated_date && renderTimeFormat(row.updated_date) }}</div>
                     </div>
                  </div>
               </template>
            </div>
         </div>
         <EmptyNotFoundTable v-if="!vtmsLogBookList.length" />
      </div>

      <div class="flex justify-between px-6 py-3">
         <div class="flex items-center">
            <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
            <USelect :options="limitRowTable" v-model="filter.limit" />
         </div>

         <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
            :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
            v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit" />
      </div>
   </div>
   <DialogConfirm :title="$t('ยกเลิกใบคำร้อง')"
      :desc="$t('คุณต้องการยกเลิกใบคำร้องนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก')" icon="danger"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)" :dialogConfirm="handleConfirmCancelDocument"
      colorConfirm="red" :label-cancel="$t('cancel')" />
   <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="modalAlertTitle" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import USelectMultiple from "~/components/form/u-select-multiple.vue";
import { format } from "date-fns";
import DatePicker from "~/components/form/v-datepicker.vue";
import USelect from "~/components/form/u-select.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import useDocumentService from "~/core/services/documentService";
import { DocumentStatusEnum } from "~/utils/enums/DocumentStatusEnum";
import useVtmsTableService from "~/core/services/vtms/logBookService";
import type { IFilterLogbook } from "~/core/interfaces/IFilterLogbook";
import type { IVtmsLogBookGet } from "~/core/interfaces/IVtmsLogBook";
import type { IDateRange } from "~/core/interfaces/IDate";

const { t } = useI18n();
const isLoading = ref(false);
const search = ref("");
const documentStatus = ref(0);
const berthId = ref(0);
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const documentId = ref();
const documentService = useDocumentService();
const vtmsTableService = useVtmsTableService();
const authStore = useAuthStore();
const documentOptionsStore = useDocumentOptionsStore();
const isAgency = authStore.profileUser.type === "Agency";
const sortField = ref("mooring_date");
const sortOrder = ref("desc");
const filter = ref<IFilterLogbook>({
   log_type: "vessel-in",
   berth_id: 0,
   mooringDateBegin: "",
   mooringDateEnd: "",
   unmooringDateBegin: "",
   unmooringDateEnd: "",
   page: 1,
   limit: 10,
   search: "",
   vesselId: 0,
   purpose_type_ids: "",
   berth_ids: "",
   mooring_date: "",
   departure_date: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const vtmsLogBookList = ref<IVtmsLogBookGet[] | any>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});
const mooringDateValue = ref<any>("");
const unmooringDateValue = ref<any>("");
const selectMooringDate = ref({ start: new Date(), end: new Date() });
const selectUnmooringDate = ref({ start: new Date(), end: new Date() });

const isConfirmCancelDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const modalAlertTitle = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");
const berthIds = ref<any>([]);
const divisionIds = ref<any>([]);
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
   documentStatus.value = 0;
   berthId.value = 0;

   mooringDateValue.value = '';
   unmooringDateValue.value = '';
   selectMooringDate.value = { start: new Date(), end: new Date() };
   selectUnmooringDate.value = { start: new Date(), end: new Date() };
   divisionIds.value = [];
   berthIds.value = [];
   Object.assign(filter.value, {
      log_type: "vessel-in",
      berth_id: 0,
      mooringDateBegin: "",
      mooringDateEnd: "",
      unmooringDateBegin: "",
      unmooringDateEnd: "",
      page: 1,
      limit: 10,
      search: "",
      vesselId: 0,
      purpose_type_ids: "",
      berth_ids: "",
      mooring_date: "",
      departure_date: "",
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
   getLogBookList(filter.value);
};

onMounted(() => {
   documentOptionsStore.getDocumentStatusOptions();
   documentOptionsStore.getVesselStatusOptions();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getAcencyDocumentStatusOptions();
   documentOptionsStore.getPurposeTypeOptions();
   getLogBookList(filter.value);
});

const getLogBookList = async (
   filter: IFilterLogbook = {
      log_type: "vessel-in",
      berth_id: 0,
      mooringDateBegin: "",
      mooringDateEnd: "",
      unmooringDateBegin: "",
      unmooringDateEnd: "",
      page: 1,
      limit: 10,
      search: "",
      vesselId: 0,
      purpose_type_ids: "",
      berth_ids: "",
      mooring_date: "",
      departure_date: "",
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   }
) => {
   isLoading.value = true;
   const resp = await vtmsTableService.getVtmsLogBook(filter);
   if (resp.statusCode === 200) {
      vtmsLogBookList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
};

const handleConfirmCancelDocument = async () => {
   if (documentId.value) {
      const resp = isAgency ? await documentService.cancelDocument(documentId.value) : await documentService.cancelAdminDocument(documentId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ยกเลิกใบคำร้อง";
         modalAlertMessage.value = "เราได้ส่งคำร้องของคุณให้กับเจ้าหน้าที่แล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ยกเลิกใบคำร้อง";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      navigateTo("/request-form/list");
   }
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      getLogBookList({
         ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
   isConfirmCancelDialogOpen.value = false;
   isAlertDialogOpen.value = false;
};

const performSearch = (query: any) => {
   sortOrder.value = "";
   filter.value.search = query;
   filter.value.page = 1;
   getLogBookList({
      ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};

const handleSearchFilter = debounce((event: any) => {
   performSearch(event.target.value);
}, 500);

const onMooringDateChange = (newDate: IDateRange) => {
   mooringDateValue.value = newDate;
};
const onUnmooringDateChange = (newDate: IDateRange) => {
   unmooringDateValue.value = newDate;
};

const sortTable = (key: string) => {
   if (sortField.value === key) {
      if (sortOrder.value === 'asc') {
         sortOrder.value = 'desc';
      } else if (sortOrder.value === 'desc') {
         sortField.value = '';
         sortOrder.value = '';
      } else {
         sortOrder.value = 'asc';
      }
   } else {
      sortField.value = key;
      sortOrder.value = 'asc';
   }

   filter.value.Order = sortField.value ? [{ column: sortField.value, dir: sortOrder.value }] : [];
   filter.value.page = 1;
   getLogBookList({ ...filter.value });
};

const getSortIcon = (key: string) => {
   if (sortField.value === key) {
      if (sortOrder.value === 'asc') return 'i-heroicons-bars-arrow-up-20-solid';
      if (sortOrder.value === 'desc') return 'i-heroicons-bars-arrow-down-20-solid';
   }
   return 'i-heroicons-arrows-up-down-20-solid';
};

watch(
   [() => divisionIds.value, () => berthIds.value],
   ([newDivisionIds, newBerthIds]) => {
      const joinedDivisionIds = newDivisionIds.join(",");
      const joinedBerthIds = newBerthIds.join(",");

      filter.value.purpose_type_ids = joinedDivisionIds;
      filter.value.berth_ids = joinedBerthIds;

      sortOrder.value = "";

      getLogBookList({ ...filter.value, purpose_type_ids: joinedDivisionIds, berth_ids: joinedBerthIds, page: 1 });
   }
);

watch(
   () => selectedDate.value,
   (value) => {
      sortOrder.value = "";
      dateValue.value = value;
   }
);

watch(
   () => dateValue.value,
   (value) => {
      // const beginDate = value ? new Date(value.start).toISOString() : ''
      // const endDate = value ? new Date(value.end).toISOString() : ''
      // filter.value.begin = beginDate
      // filter.value.end = endDate
      // filter.value.page = 1
      // getLogBookList({ ...filter.value, begin: beginDate, end: endDate, page: 1 })
   }
);

watch(
   () => filter.value.page,
   (value) => {
      sortOrder.value = "";
      getLogBookList({ ...filter.value, page: value });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getLogBookList({ ...filter.value, limit: value, page: 1 });
   }
);

// watch(
//    () => berthId.value,
//    (value) => {
//       sortOrder.value = "";
//       filter.value.berth_id = value;
//       getLogBookList({ ...filter.value, berth_id: value, page: 1 });
//    }
// );

watch(
   () => mooringDateValue.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.mooringDateBegin = beginDate;
      filter.value.mooringDateEnd = endDate;
      filter.value.page = 1;
      getLogBookList({ ...filter.value, mooringDateBegin: beginDate, mooringDateEnd: endDate, page: 1 });
   }
);

watch(
   () => unmooringDateValue.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.unmooringDateBegin = beginDate;
      filter.value.unmooringDateEnd = endDate;
      filter.value.page = 1;
      getLogBookList({ ...filter.value, unmooringDateBegin: beginDate, unmooringDateEnd: endDate, page: 1 });
   }
);
</script>
