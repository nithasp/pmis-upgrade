<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("รายงานเรือเข้า-ออก") }}</h1>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-4 gap-4">
         <div class="col-span-1">
            <Input :label="`${$t('request_number')}/${$t('vessel_name')}/${$t('IMO')}/${$t('Official No.')}`"
               name="search" :placeholder="$t('search_title_placeholder')" v-model="search"
               icon="i-heroicons-magnifying-glass-20-solid" @input="handleSearchFilter" />
         </div>
         <div class="col-span-1">
            <USelect :label="$t('status')" :placeholder="$t('status')" v-model="documentStatus" :options="newStatus" />
         </div>
         <div class="col-span-1">
            <USelect :label="$t('ท่าเรือ')" name="ท่าเรือ" :placeholder="$t('port')" v-model="berthId"
               :options="documentOptionsStore.berthsOption" 
               />
         </div>
         <div class="col-span-1">
            <USelect :label="$t('jettys_list')" :placeholder="$t('jettys_list')"
               :options="documentOptionsStore.berthJettiesOptions" v-model="filter.jettyId"
               :disabled="!documentOptionsStore.berthJettiesOptions.length"
               />
         </div>
         <div class="col-span-1">
            <UFormGroup :label="$t('วันที่เรือเข้า VS')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                     :value="mooringDateVS ? `${format(mooringDateVS.start, 'd MMM, yyyy')} - ${format(mooringDateVS.end, 'd MMM, yyyy')}` : ''"
                     :placeholder="$t('วันที่เรือเข้า VS')" :ui="{ wrapper: 'w-full rounded-md bg-white' }" />
                  <template #panel="{ close }">
                     <DatePicker v-model="selectMooringDateVS" @close="close" :onDateChange="onMooringDateVSChange" />
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <UFormGroup :label="$t('วันที่เรือออก VS')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                     :value="unmooringDateVS ? `${format(unmooringDateVS.start, 'd MMM, yyyy')} - ${format(unmooringDateVS.end, 'd MMM, yyyy')}` : ''"
                     :placeholder="$t('วันที่เรือออก VS')" :ui="{ wrapper: 'w-full rounded-md bg-white' }" />
                  <template #panel="{ close }">
                     <DatePicker v-model="selectUnmooringDateVS" @close="close"
                        :onDateChange="onUnmooringDateVSChange" />
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <UFormGroup :label="$t('วันที่เรือเข้า VT')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                     :value="mooringDateVT ? `${format(mooringDateVT.start, 'd MMM, yyyy')} - ${format(mooringDateVT.end, 'd MMM, yyyy')}` : ''"
                     :placeholder="$t('วันที่เรือเข้า VT')" :ui="{ wrapper: 'w-full rounded-md bg-white' }" />
                  <template #panel="{ close }">
                     <DatePicker v-model="selectMooringDateVT" @close="close" :onDateChange="onMooringDateVTChange" />
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <div class="flex items-end">
               <div class="w-full">
                  <UFormGroup :label="$t('วันที่เรือออก VT')">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                           :value="unmooringDateVT ? `${format(unmooringDateVT.start, 'd MMM, yyyy')} - ${format(unmooringDateVT.end, 'd MMM, yyyy')}` : ''"
                           :placeholder="$t('วันที่เรือออก VT')" :ui="{ wrapper: 'w-full rounded-md bg-white' }" />
                        <template #panel="{ close }">
                           <DatePicker v-model="selectUnmooringDateVT" @close="close"
                              :onDateChange="onUnmooringDateVTChange" />
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
            </div>
         </div>
         <div class="col-span-2">
            <Input :label="t('product_name')" name="productName" :placeholder="$t('search_title_placeholder')"
               v-model="productName" icon="i-heroicons-magnifying-glass-20-solid" @input="handleSearchProductName" />
         </div>
         <div class="col-span-2 grid grid-cols-[1fr_auto] items-end">
            <USelect :label="$t('purpose_type')" :placeholder="$t('purpose_type')" name="purposeTypeId"
               v-model="purposeTypeId" :options="documentOptionsStore.purposeTypeOptions" />
            <div class="ml-2 mb-0.5">
               <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
            </div>
         </div>
      </div>
   </div>

   <div id="request-form-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-lg text-white">{{ $t("รายงานเรือเข้า-ออก") }}</h1>
            <div v-if="search || documentStatus || berthId || dateValue"
               class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">
               {{ paginationData.totalItems }} รายการ
            </div>
         </div>
         <UButton class="bg-grayy-25 text-grayy-400 hover:bg-purple-25 [&_span]:font-anuphan-semi-bold h-10" outlined
            size="md" @click="handleDisplayExpandItem">
            <template #default>
               <div class="flex gap-2 text-right w-full justify-center">
                  <img :src="ListIcon" alt="list-icon" class="w-5 h-5" />
                  <span>{{ $t(displayAllExpandItem ? "hide_all" : "show_all") }}</span>
               </div>
            </template>
         </UButton>
      </div>

      <div class="w-full overflow-y-auto">
         <div class="u-table-list-custom min-w-[1500px] table-auto border-collapse overflow-hidden">
            <div
               class="table-header tr grid grid-cols-[10px_31px_85px_100px_183px_103px_100px_110px_110px_100px_50px] justify-between border-b bg-purple-25 text-grayy-75 font-anuphan-semi-bold text-sm">
               <div class="th flex px-4 py-3.5 whitespace-nowrap">
                  <span>{{ t("number_no") }}</span>
               </div>

               <div class="th flex px-4 py-3.5 whitespace-nowrap">
                  <span class="relative left-3">{{ t("show") }}</span>
               </div>

               <div class="th flex items-center justify-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('status')">
                  <span class="flex items-center relative left-6">
                     {{ t("status") }}
                     <span :class="getSortIcon('status')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center justify-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('documentNumber')">
                  <span class="flex items-center">
                     {{ t("เลขที่คำร้อง") }}
                     <span :class="getSortIcon('documentNumber')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('vesselName')">
                  <span class="flex items-center">
                     {{ t("vn_imo_on") }}
                     <span :class="getSortIcon('vesselName')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('grtVS')">
                  <span class="flex items-center">
                     {{ t("GRT VS/VT") }}
                     <span :class="getSortIcon('grtVS')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('berthName')">
                  <span class="flex items-center">
                     {{ t("berth_jetty") }}
                     <span :class="getSortIcon('berthName')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('mooringDateVS')">
                  <span class="flex items-center">
                     {{ t("วันที่เรือเข้า VS/VT") }}
                     <span :class="getSortIcon('mooringDateVS')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center px-4 py-3.5 whitespace-nowrap cursor-pointer"
                  @click="sortTable('unmooringDateVS')">
                  <span class="flex items-center">
                     {{ t("วันที่เรือออก VS/VT") }}
                     <span :class="getSortIcon('unmooringDateVS')" class="ml-2 w-5 h-5"></span>
                  </span>
               </div>

               <div class="th flex items-center justify-center px-4 py-3.5 whitespace-nowrap">
                  <span>{{ t("remark") }}</span>
               </div>

               <div class="th flex items-center justify-center px-4 py-3.5 whitespace-nowrap"></div>
            </div>

            <div class="table-body">
               <template v-if="vesselImportTypeSendList.length" v-for="(row, index) in vesselImportTypeSendList"
                  :key="row.id">
                  <div
                     class="tr grid grid-cols-[10px_31px_85px_100px_183px_103px_100px_110px_110px_100px_50px] justify-between border-b items-center text-grayy-900 text-sm cursor-pointer"
                     @click="() => selectRow(row)">
                     <div class="td text-center p-3">
                        <span class="relative left-4">{{ getNumCountPagination(index, filter.page, filter.limit)
                        }}</span>
                     </div>
                     <div class="td">
                        <img v-if="row.products.length" :src="ArrowUpIcon" alt="arrow-up-icon"
                           :class="[expandedItemIds.includes(row.id) ? 'rotate-180' : '', 'cursor-pointer transition relative left-8']"
                           @click.stop="() => handleExpandItem(row)" />
                     </div>
                     <div class="td text-center">
                        <div class="relative left-4">
                           <!-- <Badge :label="row.statusDes" :type="renderStatus(row.status)" /> -->
                           <BadgeVesselInOut :label="row.statusDes" :type="row.status" />
                        </div>
                     </div>
                     <div class="td p-3 text-center">{{ row.documentNumber }}</div>
                     <div class="td p-3">
                        <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                           <img :src="row.vesselFlagImage" :alt="row.vesselName" class="w-6 h-6 rounded-[50%]" />
                           <div>
                              <h3 class="text-gray-900 font-anuphan-medium">{{ row.vesselName }}</h3>
                              <p class="text-gray-600">{{ row.imoNumber }}/{{ row.officialNumber }}</p>
                           </div>
                        </div>
                     </div>
                     <div class="td p-3">
                        <div class="text-black font-anuphan-semi-bold">{{ formatNumber(row.grtVS, 3) }}</div>
                        <div class="text-grayy-75">{{ formatNumber(row.grtVT, 3) }}</div>
                     </div>
                     <div class="td p-3">
                        <p class="font-anuphan-medium text-gray-900">{{ row.berthName }}</p>
                        <p class="text-gray-600">{{ row.jettyName }}</p>
                     </div>
                     <div class="td p-3">
                        <div class="text-black font-anuphan-semi-bold whitespace-nowrap">
                           {{ row.mooringDateVS && renderDateFormat(row.mooringDateVS, DATE_FORMAT_WITH_TIME) }}
                        </div>
                        <div class="text-grayy-75 whitespace-nowrap">{{ row.mooringDateVT &&
                           renderDateFormat(row.mooringDateVT, DATE_FORMAT_WITH_TIME) }}</div>
                     </div>
                     <div class="td p-3">
                        <div class="text-black font-anuphan-semi-bold whitespace-nowrap">
                           {{ row.unmooringDateVS && renderDateFormat(row.unmooringDateVS, DATE_FORMAT_WITH_TIME) }}
                        </div>
                        <div class="text-grayy-75 whitespace-nowrap">{{ row.unmooringDateVT &&
                           renderDateFormat(row.unmooringDateVT, DATE_FORMAT_WITH_TIME) }}</div>
                     </div>
                     <div class="td p-3">{{ row.note }}</div>
                     <div class="td text-center p-3">
                        <ActionMenuTable :items="getMenuTable(row)" @click.stop />
                     </div>
                  </div>
                  <transition name="expand" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                     <div v-if="expandedItemIds.includes(row.id)" class="content relative bg-white">
                        <div class="flex items-center ml-16">
                           <div class="p-4">
                              <table class="table-auto border-collapse border border-gray-400 w-full text-left">
                                 <tbody class="divide-y divide-gray-300">
                                    <tr v-for="(item, index) in row.products" :key="index"
                                       class="divide-x divide-gray-300">
                                       <td :class="[
                                          item.purposeTypeId === 1 ? 'bg-[#4AB288]' : item.purposeTypeId === 2 ? 'bg-[#F4736A]' : 'bg-[#ED9264]',
                                          'p-2 text-left bg-[#4AB288] text-white font-anuphan-semi-bold',
                                       ]">
                                          {{ item.purposeTypeName || "-" }} #{{ index + 1 }}
                                       </td>
                                       <td class="p-2 text-left">
                                          <span v-if="item.purposeType === 'Passenger'"> {{ item.passengers || "0" }}
                                             คน</span>
                                          <span
                                             v-if="item.purposeType === 'Spare Part' || item.purposeType === 'Other' || item.purposeType === 'DischargeLoading'">
                                             {{ item.detail || "-" }}</span>
                                          <span
                                             v-if="item.purposeType === 'Loading' || item.purposeType === 'Discharge'">{{
                                                item.productName || "-" }}</span>
                                       </td>
                                       <td v-if="item.purposeType === 'Loading' || item.purposeType === 'Discharge'"
                                          class="p-2 text-right">{{ getInputDecimal(item.mTonQty?.toString(), 3) || "-"
                                          }} M/TON</td>
                                       <td v-if="item.purposeType === 'Loading' || item.purposeType === 'Discharge'"
                                          class="p-2 text-right">{{ getInputDecimal(item.rTonQty?.toString(), 3) || "-"
                                          }} R/TON</td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </transition>
               </template>
            </div>
         </div>
         <EmptyNotFoundTable v-if="!vesselImportTypeSendList.length" />
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
   <MatchingRequestFormDialog :isDialogOpen="isMatchingRequestFormDialogOpen"
      :dialogCancel="() => (isMatchingRequestFormDialogOpen = false)"
      :confirmMatchingRequestForm="confirmMatchingRequestForm" :vesselImportId="vesselImportId" :vesselId="vesselId" />
   <DialogConfirm :title="$t('ลบเรือเข้า-ออก')"
      :desc="$t('คุณต้องการลบรายการเรือเข้า-ออกนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก')" icon="danger"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)" :dialogConfirm="handleConfirmCancelVesselImport"
      colorConfirm="red" :label-cancel="$t('cancel')" />
   <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="modalAlertTitle" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import { format } from "date-fns";
import DatePicker from "~/components/form/v-datepicker.vue";
import USelect from "~/components/form/u-select.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeVesselInOut from "~/components/badge/badgeVesselInOut.vue";
import Loading from "~/components/loading.vue";
import ActionMenuTable from "~/components/ui/actionMenuTable.vue";
import ListIcon from "~/assets/icons/fi-rs-list.svg";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import SearchIcon from "~/assets/icons/fi-rs-search.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import MatchingRequestFormDialog from "~/components/dialog/vessel-in-out/matching-request-form-dialog.vue";
import useVesselImportService from "~/core/services/vesselImport";
import type { IFilterVesselImportList } from "~/core/interfaces/IFilterVesselImport";
import type { IVesselImportTypeSendList } from "~/core/interfaces/IVesselImportTypeSendList";
import ArrowUpIcon from "~/assets/icons/fi-rs-caret-up.svg";
import { VesselInOutStatusEnum } from "~/utils/enums/VesselInOutStatusEnum";
import DialogConfirm from "~/components/dialog/confirm.vue";
import { useDocumentStore } from "~/stores/documentStore";

import useOptionsService from "~/core/services/options/optionsService";
const optionService = useOptionsService();

import { useVtmsStore } from "~/stores/vtmsStore";
import type { IDateRange } from "~/core/interfaces/IDate";
const vtmsStore = useVtmsStore();

const { t } = useI18n();
const route: any = useRoute();
const isLoading = ref(false);
const search = ref("");
const productName = ref("");
const documentStatus = ref("");
const berthId = ref(0);
const purposeTypeId = ref(0);
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const vesselImportId = ref();
const vesselId = ref();
const vesselImportService = useVesselImportService();
const authStore = useAuthStore();
const documentStore = useDocumentStore();
const documentOptionsStore = useDocumentOptionsStore();
const isStatOfficer = authStore.profileUser.roleType === "StatOfficer";
const isStatApprove = authStore.profileUser.roleType === "StatApprove";
const displayAllExpandItem = ref<boolean>(false);

const mooringDateVS = ref<any>(null);
const selectMooringDateVS = ref({ start: new Date(), end: new Date() });
const unmooringDateVS = ref<any>(null);
const selectUnmooringDateVS = ref({ start: new Date(), end: new Date() });
const mooringDateVT = ref<any>(null);
const selectMooringDateVT = ref({ start: new Date(), end: new Date() });
const unmooringDateVT = ref<any>(null);
const selectUnmooringDateVT = ref({ start: new Date(), end: new Date() });
const sortField = ref("mooringDateVS");
const sortOrder = ref("desc");
const filter = ref<IFilterVesselImportList>({
   limit: 10,
   page: 1,
   search: "",
   status: "",
   created: "",
   mooringDate: "",
   unmooringDate: "",
   vesselFlagId: 0,
   vesselTypeId: 0,
   berthId: 0,
   jettyId: 0,
   productName: "",
   purposeTypeId: 0,
   mooringDateBegin: "",
   mooringDateEnd: "",
   unmooringDateBegin: "",
   unmooringDateEnd: "",
   mooringDateVSBegin: "",
   mooringDateVSEnd: "",
   unmooringDateVSBegin: "",
   unmooringDateVSEnd: "",
   mooringDateVTBegin: "",
   mooringDateVTEnd: "",
   unmooringDateVTBegin: "",
   unmooringDateVTEnd: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const vesselImportTypeSendList = ref<any[]>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});

const isConfirmCancelDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const isMatchingRequestFormDialogOpen = ref(false);
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
   if (status === VesselInOutStatusEnum.PendingCheck) {
      return "warning";
   } else if (status === VesselInOutStatusEnum.Approved) {
      return "green";
   } else if (status === VesselInOutStatusEnum.PendingEdit || status === VesselInOutStatusEnum.RequestEdit) {
      return "error";
   } else if (status === VesselInOutStatusEnum.PendingApproval) {
      return "purple";
   }
   return "gray";
};

const getMenuTable = (row: IVesselImportTypeSendList) => {
   if (isStatOfficer && (row.status === VesselInOutStatusEnum.PendingCheck || row.status === VesselInOutStatusEnum.PendingEdit)) {
      const items = [
         [
            {
               label: t("view"),
               avatar: {
                  src: ViewIcon,
               },
               click: () => {
                  navigateTo(`/vessel-in-out/view?id=${row.id}`);
               },
            },
            {
               label: row.isMap ? t("เปลี่ยนคำร้อง") : t("หาคำร้อง"),
               avatar: {
                  src: SearchIcon,
               },
               click: () => {
                  isMatchingRequestFormDialogOpen.value = true;
                  vesselImportId.value = row.id;
                  vesselId.value = row.vesselId;
               },
            },
            {
               label: t("delete"),
               avatar: {
                  src: DeleteIcon,
               },
               click: () => {
                  isConfirmCancelDialogOpen.value = true;
                  vesselImportId.value = row.id;
               },
            },
         ],
      ];
      return items;
   }

   if (isStatOfficer && row.status === VesselInOutStatusEnum.PendingApproval) {
      const items = [
         [
            {
               label: t("view"),
               avatar: {
                  src: ViewIcon,
               },
               click: () => {
                  navigateTo(`/vessel-in-out/view?id=${row.id}`);
               },
            },
            {
               label: t("delete"),
               avatar: {
                  src: DeleteIcon,
               },
               click: () => {
                  isConfirmCancelDialogOpen.value = true;
                  vesselImportId.value = row.id;
               },
            },
         ],
      ];
      return items;
   }
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               navigateTo(`/vessel-in-out/view?id=${row.id}`);
            },
         },
      ],
   ];
   return items;
};

const handleClickResetFitler = () => {
   search.value = "";
   documentStatus.value = "";
   berthId.value = 0;
   dateValue.value = "";
   productName.value = "";
   purposeTypeId.value = 0;

   mooringDateVS.value = "";
   unmooringDateVS.value = "";
   mooringDateVT.value = "";
   unmooringDateVT.value = "";

   selectMooringDateVS.value = { start: new Date(), end: new Date() };
   selectUnmooringDateVS.value = { start: new Date(), end: new Date() };
   selectMooringDateVT.value = { start: new Date(), end: new Date() };
   selectUnmooringDateVT.value = { start: new Date(), end: new Date() };

   documentOptionsStore.berthJettiesOptions = [];

   Object.assign(filter.value, {
      search: "",
      status: "",
      productName: "",
      berthId: 0,
      jettyId: 0,

      mooringDateVSBegin: "",
      mooringDateVSEnd: "",
      unmooringDateVSBegin: "",
      unmooringDateVSEnd: "",
      mooringDateVTBegin: "",
      mooringDateVTEnd: "",
      unmooringDateVTBegin: "",
      unmooringDateVTEnd: "",

      vesselFlagId: 0,
      vesselTypeId: 0,
      purposeTypeId: 0,
      page: 1,
      limit: filter.value.limit,
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
   getVesselImportListTypeSend(filter.value);
};

const columns = [
   {
      key: "id",
      label: t("number_no"),
   },
   {
      key: "status",
      label: "สถานะ",
   },
   {
      key: "documentNumber",
      label: "เลขที่คำร้อง",
   },
   {
      key: "vesselName",
      label: "ชื่อเรือ/IMO/Official No.",
   },
   {
      key: "grtVS",
      label: t("GRT VS/VT"),
   },
   {
      key: "jettyId",
      label: t("ท่าเรือ/ท่าเรือย่อย"),
   },
   {
      key: "mooringDateVS",
      label: "วันที่เรือเข้า VS/VT",
   },
   {
      key: "unmooringDateVS",
      label: "วันที่เรือออก VS/VT",
   },
   {
      key: "note",
      label: "หมายเหตุ",
   },
   {
      key: "actions",
      sortable: false,
   },
];

onMounted(() => {
   documentOptionsStore.getDocumentStatusOptions();
   documentOptionsStore.getVesselStatusOptions();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getJettiesOptions();
   documentOptionsStore.getAcencyDocumentStatusOptions();
   documentOptionsStore.getPurposeTypeOptions();
   getNewStatus();
   if (!route.query.status) {
      getVesselImportListTypeSend({
         ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   } else {
      documentStore.setVesselInOutQueryType(route.query.status === "Send,PendingCheck" ? "Send" : route.query.status);
   }
});

const newStatus = ref<any>([]);
const getNewStatus = async () => {
   const documentStatusOption = await optionService.getVesselImportNewStatusOptions();
   newStatus.value = documentStatusOption.data.map((item: any, index: number) => {
      return {
         ...item,
         id: index + 1,
      };
   });

   if (route.query.status === "Send,PendingCheck") {
      getVesselImportListTypeSend({
         ...filter.value, status: "Send,PendingCheck", page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
      const matchedStatusId = newStatus.value.find((item: any) => item.ids.includes("Send"))?.id;
      documentStatus.value = matchedStatusId;
   } else {
      getVesselImportListTypeSend({
         ...filter.value, status: route.query.status, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
      const matchedStatusId = newStatus.value.find((item: any) => item.ids.includes(route.query.status))?.id;
      documentStatus.value = matchedStatusId;
   }
};

const getVesselImportListTypeSend = async (
   filter: IFilterVesselImportList = {
      limit: 10,
      page: 1,
      search: "",
      created: "",
      mooringDate: "",
      unmooringDate: "",
      vesselFlagId: 0,
      vesselTypeId: 0,
      berthId: 0,
      jettyId: 0,
      status: "",
      mooringDateBegin: "",
      mooringDateEnd: "",
      unmooringDateBegin: "",
      unmooringDateEnd: "",
      productName: "",
      purposeTypeId: 0,
      mooringDateVSBegin: "",
      mooringDateVSEnd: "",
      unmooringDateVSBegin: "",
      unmooringDateVSEnd: "",
      mooringDateVTBegin: "",
      mooringDateVTEnd: "",
      unmooringDateVTBegin: "",
      unmooringDateVTEnd: "",
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   }
) => {
   isLoading.value = true;
   const resp = await vesselImportService.getVesselImportListTypeSend(filter);
   if (resp.statusCode === 200) {
      vesselImportTypeSendList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
};

const confirmMatchingRequestForm = (isSuccess: boolean) => {
   if (isSuccess) {
      isMatchingRequestFormDialogOpen.value = false;
      getVesselImportListTypeSend({
         ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
};

const handleConfirmCancelVesselImport = async () => {
   if (vesselImportId.value) {
      const resp = await vesselImportService.deleteVesselImport(vesselImportId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ลบเรือเข้า-ออก";
         modalAlertMessage.value = "การลบเรือเข้า-ออกสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ลบเรือเข้า-ออก";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      getVesselImportListTypeSend({
         ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
   isConfirmCancelDialogOpen.value = false;
   isAlertDialogOpen.value = false;
};

const performSearch = (query: any) => {
   filter.value.search = query;
   filter.value.page = 1;
   getVesselImportListTypeSend({
      ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};

const handleSearchFilter = debounce((event: any) => {
   performSearch(event.target.value);
}, 500);

const performSearchProductName = (query: any) => {
   filter.value.productName = query;
   filter.value.page = 1;
   getVesselImportListTypeSend({
      ...filter.value, productName: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};

const handleSearchProductName = debounce((event: any) => {
   performSearchProductName(event.target.value);
}, 500);

const expandedItemIds = ref<number[]>([]);
const handleExpandItem = (row: IVesselImportTypeSendList) => {
   const index = expandedItemIds.value.indexOf(row.id);
   if (index > -1) {
      expandedItemIds.value.splice(index, 1);
   } else {
      expandedItemIds.value.push(row.id);
   }
};

const handleDisplayExpandItem = () => {
   if (displayAllExpandItem.value) {
      expandedItemIds.value = [];
   } else {
      expandedItemIds.value = vesselImportTypeSendList.value.map((row) => row.id);
   }
   displayAllExpandItem.value = !displayAllExpandItem.value;
};

const beforeEnter = (el: Element) => {
   (el as HTMLElement).style.height = "0";
};

const enter = (el: Element, done: () => void) => {
   const height = (el as HTMLElement).scrollHeight;
   (el as HTMLElement).style.height = `${height}px`;
   el.addEventListener("transitionEnd", done);
};

const leave = (el: Element, done: () => void) => {
   (el as HTMLElement).style.height = "0";
   el.addEventListener("transitionEnd", done);
};

const onMooringDateVSChange = (newDate: IDateRange) => {
   mooringDateVS.value = newDate;
};
const onUnmooringDateVSChange = (newDate: IDateRange) => {
   unmooringDateVS.value = newDate;
};
const onMooringDateVTChange = (newDate: IDateRange) => {
   mooringDateVT.value = newDate;
};
const onUnmooringDateVTChange = (newDate: IDateRange) => {
   unmooringDateVT.value = newDate;
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
   getVesselImportListTypeSend({ ...filter.value });
};

const getSortIcon = (key: string) => {
   if (sortField.value === key) {
      if (sortOrder.value === 'asc') return 'i-heroicons-bars-arrow-up-20-solid';
      if (sortOrder.value === 'desc') return 'i-heroicons-bars-arrow-down-20-solid';
   }
   return 'i-heroicons-arrows-up-down-20-solid';
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

watch(
   () => documentStatus.value,
   (value) => {
      const selectedStatus = newStatus.value.find((item: any) => item.id === value)?.ids[0] || "";
      filter.value.status = selectedStatus === "Send" ? "Send,PendingCheck" : selectedStatus;
      getVesselImportListTypeSend({
         ...filter.value, status: filter.value.status, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
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
      getVesselImportListTypeSend({
         ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getVesselImportListTypeSend({
         ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => berthId.value,
   (value) => {
      filter.value.berthId = value;
      filter.value.jettyId = 0;
      if (value) {
         documentOptionsStore.getBerthJettiesOptions(value);
      }
      getVesselImportListTypeSend({
         ...filter.value, berthId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => filter.value.jettyId,
   (value) => {
      filter.value.page = 1;
      getVesselImportListTypeSend({
         ...filter.value, jettyId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => purposeTypeId.value,
   (value) => {
      filter.value.purposeTypeId = value;
      getVesselImportListTypeSend({
         ...filter.value, purposeTypeId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => route.query.status,
   (newQueryStatus) => {
      Object.assign(filter.value, {
         search: "",
         productName: "",
         berthId: 0,
         jettyId: 0,
         mooringDate: "",
         unmooringDate: "",
         mooringDateBegin: "",
         mooringDateEnd: "",
         unmooringDateBegin: "",
         unmooringDateEnd: "",
         vesselFlagId: 0,
         vesselTypeId: 0,
         purposeTypeId: 0,
         page: 1,
         limit: filter.value.limit,
         status: newQueryStatus === "Send,PendingCheck" ? "Send,PendingCheck" : newQueryStatus || "",
         Order: [{ column: sortField.value, dir: sortOrder.value }]

      });

      search.value = "";
      productName.value = "";
      documentStatus.value = "";
      berthId.value = 0;
      dateValue.value = "";
      purposeTypeId.value = 0;

      getVesselImportListTypeSend({
         ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });

      const matchedStatusId = newStatus.value.find((item: any) => item.ids.includes(newQueryStatus === "Send,PendingCheck" ? "Send" : newQueryStatus))?.id;
      documentStatus.value = matchedStatusId || "";
   }
);

watch(
   () => mooringDateVS.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.mooringDateVSBegin = beginDate;
      filter.value.mooringDateVSEnd = endDate;
      filter.value.page = 1;
      getVesselImportListTypeSend({
         ...filter.value, mooringDateVSBegin: beginDate, mooringDateVSEnd: endDate, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => unmooringDateVS.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.unmooringDateVSBegin = beginDate;
      filter.value.unmooringDateVSEnd = endDate;
      filter.value.page = 1;
      getVesselImportListTypeSend({
         ...filter.value, unmooringDateVSBegin: beginDate, unmooringDateVSEnd: endDate, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => mooringDateVT.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.mooringDateVTBegin = beginDate;
      filter.value.mooringDateVTEnd = endDate;
      filter.value.page = 1;
      getVesselImportListTypeSend({
         ...filter.value, mooringDateVTBegin: beginDate, mooringDateVTEnd: endDate, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => unmooringDateVT.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : "";
      const endDate = value ? adjustToUTC(value.end) : "";
      filter.value.unmooringDateVTBegin = beginDate;
      filter.value.unmooringDateVTEnd = endDate;
      filter.value.page = 1;
      getVesselImportListTypeSend({
         ...filter.value, unmooringDateVTBegin: beginDate, unmooringDateVTEnd: endDate, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);
</script>
<style scoped>
.expand-enter-active,
.expand-leave-active {
   transition: height 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
   height: 0;
}

.content {
   overflow: hidden;
}
</style>
