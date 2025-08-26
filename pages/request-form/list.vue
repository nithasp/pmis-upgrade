<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("request_form_list") }}</h1>
      <div v-if="isAgency">
         <UButton @click="handleClickCreateDocument" icon="i-heroicons-plus-circle" size="md" :label="$t('create')" />
      </div>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div v-if="isAgency" class="grid grid-cols-1 items-end xs:grid-cols-2 md:grid-cols-4 gap-4">
         <div class="col-span-1">
            <Input :label="`${$t('request_number')}/${$t('vessel_name')}/${$t('IMO')}/${$t('official_number')}`"
               name="search" :placeholder="$t('search_title_placeholder')" v-model="search"
               icon="i-heroicons-magnifying-glass-20-solid" @input="handleSearchFilter" />
         </div>
         <div class="col-span-1">
            <UFormGroup :label="$t('ETA')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                     :value="dateETAValue ? `${format(dateETAValue.start, 'd MMM, yyy')} - ${format(dateETAValue.end, 'd MMM, yyy')}` : ''"
                     :placeholder="$t('search_title_placeholder')" :ui="{
                        wrapper: 'w-full rounded-md bg-white',
                     }" />

                  <template #panel="{ close }">
                     <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                        <DatePicker v-model="selectedETADate" @close="close" v-on:date-change="onETADateChange" />
                     </div>
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <USelect :label="$t('สถานะคำร้อง')" :placeholder="$t('สถานะคำร้อง')" v-model="documentStatus"
               :options="newStatus" />
         </div>
         <div class="col-span-1">
            <div class="flex items-end">
               <div class="w-full">
                  <USelect :label="$t('ท่าเรือ')" name="ท่าเรือ" :placeholder="$t('port')" v-model="berthId"
                     :options="documentOptionsStore.berthsOption" />
               </div>
               <div class="ml-2 mb-0.5">
                  <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
               </div>
            </div>
         </div>
      </div>
      <div v-else class="grid grid-cols-1 items-end xs:grid-cols-2 xl:grid-cols-4 gap-4">
         <div class="col-span-1">
            <Input :label="`${$t('request_number')}/${$t('vessel_name')}/${$t('IMO')}/${$t('official_number')}`"
               name="search" :placeholder="$t('search_title_placeholder')" v-model="search"
               icon="i-heroicons-magnifying-glass-20-solid" @input="handleSearchFilter" />
         </div>
         <div class="col-span-1">
            <UFormGroup :label="$t('วันที่ยื่นคำร้อง')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                     :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                     :placeholder="$t('search_title_placeholder')" :ui="{
                        wrapper: 'w-full rounded-md bg-white',
                     }" />

                  <template #panel="{ close }">
                     <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                        <DatePicker v-model="selectedDate" @close="close" v-on:date-change="onSelectedDateChange" />
                     </div>
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <USelect :label="$t('สถานะคำร้อง')" :placeholder="$t('สถานะคำร้อง')" v-model="documentStatus"
               :options="newStatus" />
         </div>
         <div class="col-span-1">
            <USelect :label="$t('สถานะเรือ')" name="personType" :placeholder="$t('สถานะเรือ')"
               :options="documentOptionsStore.vesselStatusOptions" v-model="vesselStatus" />
         </div>
         <div class="col-span-1">
            <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId">
               <USelectMenu :label="$t('สัญชาติเรือ/ธงเรือ')" v-model="vesselFlagId" size="md" variant="outline"
                  color="purple" value-attribute="id" option-attribute="name" searchable
                  :options="vesselOptionsStore.vesselFlagsOption" clear-search-on-close
                  :ui="{ wrapper: `rounded-md bg-white` }" placeholder="สัญชาติเรือ/ธงเรือ">
                  <template #leading>
                     <UAvatar v-if="vesselFlagData.avatar" size="xs" :src="vesselFlagData.avatar" alt="Avatar" />
                     <NuxtIcon v-else name="flag" size="xl" />
                  </template>
               </USelectMenu>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <USelect :label="$t('ท่าเรือ')" name="ท่าเรือ" :placeholder="$t('port')" v-model="berthId"
               :options="documentOptionsStore.berthsOption" />
         </div>
         <div class="col-span-1">
            <USelect :label="$t('วัตถุประสงค์')" name="personType" :placeholder="$t('วัตถุประสงค์')"
               :options="documentOptionsStore.purposesOptions" v-model="purposeId" />
         </div>
         <div class="col-span-1">
            <div class="flex items-end">
               <div class="w-full">
                  <UFormGroup :label="$t('ETA')">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                           :value="dateETAValue ? `${format(dateETAValue.start, 'd MMM, yyy')} - ${format(dateETAValue.end, 'd MMM, yyy')}` : ''"
                           :placeholder="$t('search_title_placeholder')" :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }" />

                        <template #panel="{ close }">
                           <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                              <DatePicker v-model="selectedETADate" @close="close" v-on:date-change="onETADateChange" />
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
            <h1 class="font-normal text-lg text-white">{{ $t("request_form_list_all") }}</h1>
            <div v-if="search || documentStatus || berthId || dateValue"
               class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">
               {{ paginationData.totalItems }} รายการ
            </div>
         </div>
      </div>
      <UTable :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" :columns="columns"
         :rows="documentList" :ui="{
            base: 'u-table-list',
         }" @select="selectRow">

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

         <template #createAt-data="{ row }">
            <div class="text-black font-semibold">{{ row.createAt && renderDateFormat(row.createAt) }}</div>
            <div class="text-grayy-75">{{ row.createAt && renderTimeFormat(row.createAt) }}</div>
         </template>
         <template #portAt-data="{ row }">
            <div class="text-black font-semibold">
               {{ row.portAt && renderDateFormat(row.portAt) }}
            </div>
            <div class="text-grayy-75">{{ row.portAt && renderTimeFormat(row.portAt) }}</div>
         </template>
         <template #vesselName-data="{ row }">
            <div class="flex items-center">
               <UAvatar size="xs" :src="row.vesselFlagImage" alt="Avatar" />
               <div class="ml-3">
                  <div class="flex items-center space-x-2">
                     <div class="text-black font-semibold">{{ row.vesselName }}</div>
                     <div class="text-[#F04438]">{{ row.isNewShip === true ? 'เรือใหม่' : '' }}</div>
                  </div>
                  <div class="text-grayy-75">{{ row.imoNumber }}/{{ row.officialNumber }}</div>
               </div>
            </div>
         </template>
         <template #docNumber-data="{ row }">
            <div class="text-slate-500">{{ row.docNumber }}</div>
         </template>
         <template #grt-data="{ row }">
            <div class="text-slate-500 text-right">{{ formatNumber(row.grt, 3) }}</div>
         </template>
         <template #berthNames-data="{ row }">
            <div class="text-slate-500">{{ row.berthNames }}</div>
         </template>
         <template #eta-data="{ row }">
            <div class="text-black font-semibold">{{ row.eta && renderDateFormat(row.eta) }}</div>
            <div class="text-slate-500">{{ row.eta && renderTimeFormat(row.eta) }}</div>
         </template>
         <template #status-data="{ row }">
            <BadgeCr :label="row.statusDes" :type="row.status" />
         </template>
         <template #vesselStatus-data="{ row }">
            <BadgeCr :label="row.vesselStatusDes" :type="row.vesselStatus" />
         </template>
         <template #actions-data="{ row }">
            <div @click.stop>
               <ActionMenuTable :items="getMenuTable(row)" />
            </div>
         </template>
         <template #portDues-data="{ row }">
            <div class="text-grayy-75">{{ row.portDues != 0 ? `฿ ${formatNumber(row.portDues)}` : "" }}</div>
         </template>
         <template #empty-state>
            <EmptyNotFoundTable />
         </template>
      </UTable>
      <div class="flex justify-between px-6 py-3 overflow-auto">
         <div class="flex items-center">
            <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
            <USelect :options="limitRowTable" v-model="filter.limit" />
         </div>

         <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
            :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
            v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit" />
      </div>
   </div>
   <DialogConfirm :title="$t('cancel_request_form')"
      :desc="$t('คุณต้องการยกเลิกใบคำร้องนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก')" icon="danger"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)" :dialogConfirm="handleConfirmCancelDocument"
      colorConfirm="red" :label-cancel="$t('cancel')" />
   <DialogConfirm :title="$t('เรียกคืนใบคำร้อง')" :desc="$t('คุณยืนยันเรียกคืนใบคำร้องนี้ใช่หรือไม่')" icon="warning"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmRecallDialogOpen"
      :dialogCancel="() => (isConfirmRecallDialogOpen = false)" :dialogConfirm="handleConfirmRecallDocument"
      :label-cancel="$t('cancel')" />
   <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="modalAlertTitle" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import { format } from "date-fns";
import DatePicker from "~/components/form/v-datepicker.vue";
import USelect from "~/components/form/u-select.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeCr from "~/components/badge/badgeCr.vue";
import Loading from "~/components/loading.vue";
import ActionMenuTable from "~/components/ui/actionMenuTable.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import PrintIcon from "~/assets/icons/fi-rs-print.svg";
import RecallIcon from "~/assets/icons/fi-rs-redo-alt.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import useDocumentService from "~/core/services/documentService";
import type { IFilterDocument } from "~/core/interfaces/IFilterDocument";
import type { IDocumentList } from "~/core/interfaces/IDocumentList";
import { DocumentStatusEnum } from "~/utils/enums/DocumentStatusEnum";
import { VesselDocStatusEnum } from "~/utils/enums/VesselDocStatusEnum";
import useOptionsService from "~/core/services/options/optionsService";
import { useDocumentStore } from "~/stores/documentStore";

const config = useRuntimeConfig();
const { t } = useI18n();
const route: any = useRoute();
const isLoading = ref(false);
const search = ref("");
const documentStatus = ref("");
const berthId = ref(0);
const purposeId = ref(0);
const vesselStatus = ref("");
const vesselFlagId = ref(0);
const dateValue = ref<any>("");
const dateETAValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const selectedETADate = ref({ start: new Date(), end: new Date() });
const documentId = ref();
const documentService = useDocumentService();
const authStore = useAuthStore();
const documentStore = useDocumentStore();
const documentOptionsStore = useDocumentOptionsStore();
const vesselOptionsStore = useVesselOptionsStore();
const isAgency = authStore.profileUser.type === "Agency";
const optionService = useOptionsService();

const sortField = ref("status");
const sortOrder = ref("desc");
const vesselFlagData = ref({
   avatar: "",
   flagName: "",
});
const filter = ref<IFilterDocument>({
   status: 0,
   berthId: 0,
   begin: "",
   end: "",
   page: 1,
   limit: 10,
   search: "",
   vesselStatus: "",
   vesselFlagId: 0,
   purposeId: 0,
   etaBegin: "",
   etaEnd: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const documentList = ref<IDocumentList[]>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});

const isConfirmCancelDialogOpen = ref(false);
const isConfirmRecallDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const modalAlertTitle = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");

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

const renderStatus = (status: string) => {
   if ((status === DocumentStatusEnum.PendingApproval && isAgency) || status === DocumentStatusEnum.PendingReview) {
      return "warning";
   } else if (status === DocumentStatusEnum.Rejected || status === DocumentStatusEnum.Canceled || status === DocumentStatusEnum.AdminCanceled) {
      return "gray";
   } else if (status === DocumentStatusEnum.PendingEdit) {
      return "error";
   } else if (status === DocumentStatusEnum.PendingApproval && !isAgency) {
      return "purple";
   } else if (status === DocumentStatusEnum.Approved) {
      return "green";
   } else if (
      (status === DocumentStatusEnum.PendingConfirmation && !isAgency) ||
      (status === DocumentStatusEnum.PendingConfirmation1 && !isAgency) ||
      (status === DocumentStatusEnum.PendingConfirmation2 && !isAgency)
   ) {
      return "blue";
   }
   return "warning";
};

const renderVesselStatus = (status: string) => {
   if (status === VesselDocStatusEnum.Berth) {
      return "green";
   } else if (status === VesselDocStatusEnum.PendingBerth) {
      return "warning";
   }
   return "warning";
};

const onETADateChange = (newDate: any) => {
   dateETAValue.value = newDate;
};

const onSelectedDateChange = (newDate: any) => {
   dateValue.value = newDate;
};

const getMenuTable = (row: IDocumentList) => {
   if (isAgency) {
      if (row.status === DocumentStatusEnum.PendingApproval && row.vesselStatus === VesselDocStatusEnum.PendingBerth) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("cancel_request_form"),
                  avatar: {
                     src: DeleteIcon,
                  },
                  click: () => {
                     isConfirmCancelDialogOpen.value = true;
                     documentId.value = row.id;
                  },
               },
            ],
         ];
         return items;
      } else if (row.status === DocumentStatusEnum.PendingEdit && row.vesselStatus === VesselDocStatusEnum.PendingBerth) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("edit"),
                  avatar: {
                     src: EditIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/edit?id=${row.id}`);
                  },
               },
               {
                  label: t("พิมพ์คำร้อง"),
                  avatar: {
                     src: PrintIcon,
                  },
                  click: () => {
                     handleExportDocument(row);
                  },
               },
            ],
         ];
         return items;
      } else if (row.status === DocumentStatusEnum.Rejected || row.status === DocumentStatusEnum.Canceled || row.status === DocumentStatusEnum.AdminCanceled) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
            ],
         ];
         return items;
      } else if (row.status === DocumentStatusEnum.Approved && row.vesselStatus === VesselDocStatusEnum.PendingBerth) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("cancel_request_form"),
                  avatar: {
                     src: DeleteIcon,
                  },
                  click: () => {
                     isConfirmCancelDialogOpen.value = true;
                     documentId.value = row.id;
                  },
               },
               {
                  label: t("พิมพ์คำร้อง"),
                  avatar: {
                     src: PrintIcon,
                  },
                  click: () => {
                     handleExportDocument(row);
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
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("พิมพ์คำร้อง"),
                  avatar: {
                     src: PrintIcon,
                  },
                  click: () => {
                     handleExportDocument(row);
                  },
               },
            ],
         ];
         return items;
      }
   } else {
      if (row.status === DocumentStatusEnum.PendingReview && row.vesselStatus === VesselDocStatusEnum.PendingBerth) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("edit"),
                  avatar: {
                     src: EditIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/edit?id=${row.id}`);
                  },
               },
               {
                  label: t("cancel_request_form"),
                  avatar: {
                     src: DeleteIcon,
                  },
                  click: () => {
                     isConfirmCancelDialogOpen.value = true;
                     documentId.value = row.id;
                  },
               },
            ],
         ];
         return items;
      } else if (row.status === DocumentStatusEnum.PendingEdit && row.vesselStatus === VesselDocStatusEnum.PendingBerth) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("edit"),
                  avatar: {
                     src: EditIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/edit?id=${row.id}`);
                  },
               },
               {
                  label: t("เรียกคืน"),
                  avatar: {
                     src: RecallIcon,
                  },
                  click: () => {
                     isConfirmRecallDialogOpen.value = true;
                     documentId.value = row.id;
                  },
               },
               {
                  label: t("cancel_request_form"),
                  avatar: {
                     src: DeleteIcon,
                  },
                  click: () => {
                     isConfirmCancelDialogOpen.value = true;
                     documentId.value = row.id;
                  },
               },
            ],
         ];
         return items;
      } else if (
         (row.status === DocumentStatusEnum.PendingApproval ||
            row.status === DocumentStatusEnum.PendingConfirmation ||
            row.status === DocumentStatusEnum.PendingConfirmation1 ||
            row.status === DocumentStatusEnum.PendingConfirmation2) &&
         row.vesselStatus === VesselDocStatusEnum.PendingBerth
      ) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("edit"),
                  avatar: {
                     src: EditIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/edit?id=${row.id}`);
                  },
               },
               {
                  label: t("cancel_request_form"),
                  avatar: {
                     src: DeleteIcon,
                  },
                  click: () => {
                     isConfirmCancelDialogOpen.value = true;
                     documentId.value = row.id;
                  },
               },
            ],
         ];
         return items;
      } else if (row.status === DocumentStatusEnum.Approved && row.vesselStatus === VesselDocStatusEnum.PendingBerth) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("edit"),
                  avatar: {
                     src: EditIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/edit?id=${row.id}`);
                  },
               },
               {
                  label: t("พิมพ์คำร้อง"),
                  avatar: {
                     src: PrintIcon,
                  },
                  click: () => {
                     handleExportDocument(row);
                  },
               },
            ],
         ];
         return items;
      } else if (row.status === DocumentStatusEnum.Rejected || row.status === DocumentStatusEnum.Canceled || row.status === DocumentStatusEnum.AdminCanceled) {
         const items = [
            [
               {
                  label: t("view"),
                  avatar: {
                     src: ViewIcon,
                  },
                  click: () => {
                     navigateTo(`/request-form/view?id=${row.id}`);
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
                     navigateTo(`/request-form/view?id=${row.id}`);
                  },
               },
               {
                  label: t("พิมพ์คำร้อง"),
                  avatar: {
                     src: PrintIcon,
                  },
                  click: () => {
                     handleExportDocument(row);
                  },
               },
            ],
         ];
         return items;
      }
   }
};
const handleClickResetFitler = () => {
   search.value = "";
   documentStatus.value = "";
   berthId.value = 0;
   vesselStatus.value = "";
   vesselFlagId.value = 0;
   dateValue.value = "";
   dateETAValue.value = "";
   selectedDate.value = { start: new Date(), end: new Date() };
   selectedETADate.value = { start: new Date(), end: new Date() };
   vesselFlagData.value = {
      avatar: "",
      flagName: "",
   };
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   //resetSort();

   Object.assign(filter.value, {
      status: 0,
      berthId: 0,
      begin: "",
      end: "",
      search: "",
      vesselStatus: "",
      vesselFlagId: 0,
      purposeId: 0,
      etaBegin: "",
      etaEnd: "",
      page: 1,
      limit: filter.value.limit,
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   });

   getDocumentList(filter.value);
};

const handleClickCreateDocument = () => {
   navigateTo("/request-form/create");
};

const handleExportDocument = (row: any) => {
   // navigateTo('/request-form/create')
   documentService.exportDocumentToPDF(row.id).then((res: any) => {
      if (res) {
         // Create a Blob URL for the PDF
         const blob = new Blob([res.data], { type: "application/pdf" });
         const url = window.URL.createObjectURL(blob);

         // Open the PDF in a new tab
         window.open(url, "_blank");

         // Trigger a direct download with a predefined filename
         // const link = document.createElement("a");
         // link.href = url;
         // link.download = `ใบคำร้อง-${row.docNumber}.pdf`; // Set the desired filename
         // link.click();

         // Optionally, revoke the Blob URL after some time
         setTimeout(() => {
            window.URL.revokeObjectURL(url);
         }, 1000);
      } else {
         console.error("Failed to export document:", res);
      }
   });
};





const columns =  [
   {
      key: "id",
      label: t("number_no"),
   },
   {
      key: "createAt",
      label: "วันที่ยื่นคำขอ",
      sortable: true,
   },
   {
      key: "status",
      label: "สถานะคำร้อง",
      sortable: true,
   },
   {
      key: "docNumber",
      label: "เลขที่คำร้อง",
   },
   {
      key: "vesselName",
      label: `${t("vessel_name")}/${t("IMO")}/${t("official_number")}`,
   },
   {
      key: "grt",
      label: t("GRT"),
   },
   {
      key: "eta",
      label: t("ETA"),
   },
   {
      key: "berthNames",
      label: t("port"),
   },
   {
      key: "vesselStatus",
      label: "สถานะเรือ",
   },
   {
      key: "portAt",
      label: "เวลาเทียบท่า",
   },
   {
      key: "portDues",
      label: "ค่าภาระเรือเข้าท่า",
   },
   {
      key: "actions",
      sortable: false,
   },
]

onMounted(() => {
   documentOptionsStore.getDocumentStatusOptions();
   documentOptionsStore.getVesselStatusOptions();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getAcencyDocumentStatusOptions();
   documentOptionsStore.getPurposesOptions();
   documentOptionsStore.getPurposeTypeOptions();
   vesselOptionsStore.getVesselFlagOption();

   //getDocumentList(filter.value)

   getNewStatus();
   if (!route.query.status) {
      getDocumentList({
         ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   } else {
      documentStore.setRequestFormQueryType(route.query.status === "PendingConfirmation,PendingConfirmation1,PendingConfirmation2" ? 'PendingConfirmation' : route.query.status);
   }
});

const newStatus = ref<any>([]);
const getNewStatus = async () => {
   const documentStatusOption = isAgency ? await optionService.getAcencyDocumentStatusOptions() : await optionService.getDocumentStatusOptions();
   newStatus.value = documentStatusOption.data.map((item: any, index: number) => {
      return {
         ...item,
         id: index + 1,
      };
   });

   if (route.query.status === "PendingConfirmation,PendingConfirmation1,PendingConfirmation2") {
      getDocumentList({
         ...filter.value, status: "PendingConfirmation,PendingConfirmation1,PendingConfirmation2", page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
      const matchedStatusId = newStatus.value.find((item: any) => item.ids.includes("PendingConfirmation"))?.id;
      documentStatus.value = matchedStatusId;
   } else {
      getDocumentList({
         ...filter.value, status: route.query.status, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
      const matchedStatusId = newStatus.value.find((item: any) => item.ids.includes(route.query.status))?.id;
      documentStatus.value = matchedStatusId;
   }
};

const getDocumentList = async (
   filter: IFilterDocument = {
      status: [],
      berthId: 0,
      begin: "",
      end: "",
      page: 1,
      limit: 10,
      search: "",
      vesselStatus: "",
      vesselFlagId: 0,
      purposeId: 0,
      etaBegin: "",
      etaEnd: "",
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   }
) => {
   isLoading.value = true;
   const resp = await documentService.getDocumentList(filter);
   if (resp.statusCode === 200) {
      documentList.value = resp.data.data;
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

const handleConfirmRecallDocument = async () => {
   if (documentId.value) {
      const resp = await documentService.recallDocument(documentId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "เรียกคืนใบคำร้อง";
         modalAlertMessage.value = "การเรียกคืนใบคำร้องของคุณสำเร็จแล้ว ";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "เรียกคืนใบคำร้อง";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      navigateTo("/request-form/list");
   }
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      getDocumentList({ ...filter.value });
   }
   isConfirmRecallDialogOpen.value = false;
   isConfirmCancelDialogOpen.value = false;
   isAlertDialogOpen.value = false;
};

const performSearch = (query: any) => {
   filter.value.search = query;
   filter.value.page = 1;
   getDocumentList({
      ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};

const handleSearchFilter = debounce((event: any) => {
   performSearch(event.target.value);
}, 500);

watch(
   () => dateValue.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.begin = beginDate;
      filter.value.end = endDate;
      filter.value.page = 1;
      getDocumentList({
         ...filter.value, begin: beginDate, end: endDate, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => dateETAValue.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.etaBegin = beginDate;
      filter.value.etaEnd = endDate;
      filter.value.page = 1;
      getDocumentList({
         ...filter.value, etaBegin: beginDate, etaEnd: endDate, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => filter.value.page,
   (value) => {
      getDocumentList({
         ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getDocumentList({
         ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => documentStatus.value,
   (value) => {
      const selectedStatus = newStatus.value.find((item: any) => item.id === value)?.ids[0] || "";
      filter.value.status = value as any === 3 ? 'PendingConfirmation,PendingConfirmation1,PendingConfirmation2' : selectedStatus;
      getDocumentList({
         ...filter.value, status: filter.value.status, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => vesselStatus.value,
   (value) => {
      filter.value.vesselStatus = value;
      getDocumentList({
         ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => vesselFlagId.value,
   (value) => {
      filter.value.vesselFlagId = value;
      getDocumentList({
         ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => berthId.value,
   (value) => {
      filter.value.berthId = value;
      getDocumentList({
         ...filter.value, berthId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => purposeId.value,
   (value) => {
      filter.value.purposeId = value;
      getDocumentList({
         ...filter.value, purposeId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => vesselFlagId.value,
   (value) => {
      if (value) {
         const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value);
         if (findVesselFlag) {
            vesselFlagData.value.avatar = findVesselFlag.path;
            vesselFlagData.value.flagName = findVesselFlag.name;
         }
      }
   }
);

watch(
   () => route.query.status,
   (newQueryStatus) => {
      Object.assign(filter.value, {
         status:
            newQueryStatus === "PendingConfirmation,PendingConfirmation1,PendingConfirmation2"
               ? "PendingConfirmation,PendingConfirmation1,PendingConfirmation2"
               : newQueryStatus,
         berthId: 0,
         begin: "",
         end: "",
         page: 1,
         limit: filter.value.limit,
         search: "",
         vesselStatus: "",
         vesselFlagId: 0,
         purposeId: 0,
         etaBegin: "",
         etaEnd: "",
         Order: [{ column: sortField.value, dir: sortOrder.value }]
      });

      search.value = "";
      documentStatus.value = "";
      berthId.value = 0;
      vesselStatus.value = "";
      vesselFlagId.value = 0;
      dateValue.value = "";
      dateETAValue.value = "";
      selectedDate.value = { start: new Date(), end: new Date() };
      selectedETADate.value = { start: new Date(), end: new Date() };
      vesselFlagData.value = { avatar: "", flagName: "" };
      filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];

      getDocumentList({
         ...filter.value, status:
            newQueryStatus === "PendingConfirmation,PendingConfirmation1,PendingConfirmation2"
               ? "PendingConfirmation,PendingConfirmation1,PendingConfirmation2"
               : newQueryStatus, Order: [{ column: sortField.value, dir: sortOrder.value }]

      });

      const matchedStatusId = newStatus.value.find((item: any) =>
         item.ids.includes(newQueryStatus === "PendingConfirmation,PendingConfirmation1,PendingConfirmation2" ? "PendingConfirmation" : newQueryStatus)
      )?.id;
      documentStatus.value = matchedStatusId || "";
   }
);

const selectRow = (row: IDocumentList) => {
   const menuItems = getMenuTable(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
}
const filteredColumns = computed(() => columns.filter((column: any) => !["id", "actions"].includes(column.key)));
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
   getDocumentList({
      ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};
</script>
