<template>
   <header class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <h1 class="font-anuphan-semi-bold text-[30px] text-black">
         {{ $t("vessel_entry_exit_data_import") }}
      </h1>
      <div class="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
         <UButton
            class="bg-purple-25 text-primaryy-500 hover:bg-purple-25 [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-10"
            outlined
            size="md"
            @click="() => getVesselImportTemplate('vsTemplate')"
         >
            <template #default>
               <div class="flex gap-2 text-right w-full justify-center">
                  <img :src="DownloadBrandIcon" alt="download-icon" class="w-5 h-5" />
                  <span>{{ $t("import_file") }}</span>
               </div>
            </template>
         </UButton>

         <UButton
            class="bg-primaryy-500 text-white hover:bg-primaryy-500 [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-10"
            outlined
            size="md"
            @click="selectFile"
         >
            <template #default>
               <div class="flex gap-2 text-right w-full justify-center">
                  <span>{{ $t("import_data") }}</span>
                  <img :src="UploadIcon" alt="upload-icon" class="w-5 h-5" />
               </div>
               <input type="file" accept=".xlsx" id="input_file_vessel_import" ref="input_file_vessel_import" class="hidden" @change="handleImportVessel" />
            </template>
         </UButton>

         <UButton
            class="bg-grayy-25 text-grayy-400 hover:bg-purple-25 [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-10"
            outlined
            size="md"
            @click="() => navigateTo(`/ship-entry/vessel-import/create`)"
         >
            <template #default>
               <div class="flex gap-2 text-right w-full justify-center">
                  <img :src="AddIcon" alt="add-icon" class="w-5 h-5" />
                  <span>{{ $t("create") }}</span>
               </div>
            </template>
         </UButton>
      </div>
   </header>

   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6 lg:flex lg:gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
         <Input :label="$t('vn_imo_on')" :placeholder="$t('search')" v-model="filter.search" icon="i-heroicons-magnifying-glass-20-solid" />

         <Select :label="$t('status')" name="status" placeholder="" :options="statusList" v-model="filter.status" />

         <UFormGroup :label="$t('arrival_date')">
            <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                  name="etd"
                  size="md"
                  variant="outline"
                  color="purple"
                  custom-icon="calendar"
                  :value="mooringDate ? `${format(mooringDate.start, 'd MMM, yyy')} - ${format(mooringDate.end, 'd MMM, yyy')}` : ''"
                  :placeholder="$t('arrival_date')"
                  :ui="{ wrapper: 'w-full rounded-md bg-white' }"
               />
               <template #panel="{ close }">
                  <Datepicker v-model="selectMooringDate" @close="close" :onDateChange="onMooringDateChange" />
               </template>
            </UPopover>
         </UFormGroup>

         <UFormGroup :label="$t('departure_date')">
            <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                  name="etd"
                  size="md"
                  variant="outline"
                  color="purple"
                  custom-icon="calendar"
                  :value="unmooringDate ? `${format(unmooringDate.start, 'd MMM, yyy')} - ${format(unmooringDate.end, 'd MMM, yyy')}` : ''"
                  :placeholder="$t('departure_date')"
                  :ui="{ wrapper: 'w-full rounded-md bg-white' }"
               />
               <template #panel="{ close }">
                  <Datepicker v-model="selectUnmooringDate" @close="close" :onDateChange="onUnmooringDateChange" />
               </template>
            </UPopover>
         </UFormGroup>

         <Select
            :label="$t('ship_flag')"
            :placeholder="$t('ship_flag')"
            :options="[allFilterObject, ...documentOptionsStore.vesselFlagOptions]"
            v-model="filter.vesselFlagId"
            customIcon="flag"
         />

         <Select
            :label="$t('ship_type')"
            :placeholder="$t('ship_type')"
            :options="[allFilterObject, ...documentOptionsStore.vesselTypeOptions]"
            v-model="filter.vesselTypeId"
         />

         <Select :label="$t('berth')" :placeholder="$t('berth')" :options="[allFilterObject, ...documentOptionsStore.berthsOption]" v-model="filter.berthId" />

         <Select
            :label="$t('jettys_list')"
            :placeholder="$t('jettys_list')"
            :options="documentOptionsStore.berthJettiesOptions"
            v-model="filter.jettyId"
            :disabled="!documentOptionsStore.berthJettiesOptions.length"
         />
      </div>

      <div class="mt-4 text-right lg:mt-0 lg:content-end">
         <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
      </div>
   </div>

   <div id="sailing-log-content" class="bg-white rounded-[20px]">
      <div class="block sm:flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between items-center gap-4">
            <h1 class="font-normal text-base text-grayy-25">
               {{ $t("vessel_import_list") }}
            </h1>
            <div
               class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-0 sm:ml-2 mt-2 sm:mt-0 whitespace-nowrap h-6 self-center"
            >
               {{ vesselImportList.length }} {{ $t("items") }}
            </div>
         </div>
         <UButton class="bg-grayy-25 text-grayy-400 hover:bg-purple-25 [&_span]:font-anuphan-semi-bold h-10" outlined size="md" @click="handleDisplayExpandItem">
            <template #default>
               <div class="flex gap-2 text-right w-full justify-center">
                  <img :src="ListIcon" alt="list-icon" class="w-5 h-5" />
                  <span>{{ $t(displayAllExpandItem ? "hide_all" : "show_all") }}</span>
               </div>
            </template>
         </UButton>
      </div>

      <div class="w-full overflow-x-auto">
         <div class="u-table-list-custom min-w-[1500px] table-auto border-collapse overflow-hidden">
            <div
               class="table-header tr grid grid-cols-[25px_31px_85px_220px_183px_103px_183px_110px_110px_100px_50px] justify-between items-center border-b bg-purple-25 text-grayy-75 font-semibold text-sm"
            >
               <div class="th text-center px-4 py-3.5">{{ $t("number_no") }}</div>
               <div class="th text-center px-4 py-3.5">{{ $t("show") }}</div>
               <div class="th text-center px-4 py-3.5">
                  <div @click="toggleSort('status')" class="cursor-pointer flex items-center">
                     <span>{{ $t("status") }}</span>
                     <div class="ml-2">
                        <span v-if="sortField === 'status' && sortOrder === 'asc'" class="w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                        <span v-else-if="sortField === 'status' && sortOrder === 'desc'" class="w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                        <span v-else class="w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                     </div>
                  </div>
               </div>
               <div class="th px-4 py-3.5">
                  <div @click="toggleSort('vesselName')" class="cursor-pointer flex items-center">
                     <span>{{ $t("vn_imo_on") }}</span>
                     <span v-if="sortField === 'vesselName' && sortOrder === 'asc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                     <span v-else-if="sortField === 'vesselName' && sortOrder === 'desc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                     <span v-else class="ml-2 w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                  </div>
               </div>
               <div class="th px-4 py-3.5">
                  <div @click="toggleSort('vesselTypeName')" class="cursor-pointer flex items-center">
                     <span>{{ $t("vessel_type") }}</span>
                     <span v-if="sortField === 'vesselTypeName' && sortOrder === 'asc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                     <span v-else-if="sortField === 'vesselTypeName' && sortOrder === 'desc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                     <span v-else class="ml-2 w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                  </div>
               </div>
               <div class="th px-4 py-3.5">
                  <div @click="toggleSort('grt')" class="cursor-pointer flex items-center">
                     <span>{{ $t("grt") }}</span>
                     <span v-if="sortField === 'grt' && sortOrder === 'asc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                     <span v-else-if="sortField === 'grt' && sortOrder === 'desc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                     <span v-else class="ml-2 w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                  </div>
               </div>
               <div class="th px-4 py-3.5">
                  <div @click="toggleSort('berthName')" class="cursor-pointer flex items-center">
                     <span>{{ $t("berth_jetty") }}</span>
                     <span v-if="sortField === 'berthName' && sortOrder === 'asc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                     <span v-else-if="sortField === 'berthName' && sortOrder === 'desc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                     <span v-else class="ml-2 w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                  </div>
               </div>
               <div class="th px-4 py-3.5">
                  <div @click="toggleSort('mooringDate')" class="cursor-pointer flex items-center">
                     <span>{{ $t("arrival_date") }}</span>
                     <span v-if="sortField === 'mooringDate' && sortOrder === 'asc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                     <span v-else-if="sortField === 'mooringDate' && sortOrder === 'desc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                     <span v-else class="ml-2 w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                  </div>
               </div>
               <div class="th px-4 py-3.5">
                  <div @click="toggleSort('unmooringDate')" class="cursor-pointer flex items-center">
                     <span>{{ $t("departure_date") }}</span>
                     <span v-if="sortField === 'unmooringDate' && sortOrder === 'asc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-up-20-solid"></span>
                     <span v-else-if="sortField === 'unmooringDate' && sortOrder === 'desc'" class="ml-2 w-5 h-5 i-heroicons-bars-arrow-down-20-solid"></span>
                     <span v-else class="ml-2 w-5 h-5 i-heroicons-arrows-up-down-20-solid"></span>
                  </div>
               </div>
               <div class="th px-4 py-3.5">{{ $t("remark") }}</div>
               <div class="th px-4 py-3.5"></div>
            </div>

            <div class="table-body">
               <template v-if="vesselImportList.length" v-for="(row, index) in vesselImportList" :key="row.id">
                  <div
                     class="tr grid grid-cols-[25px_31px_85px_220px_183px_103px_183px_110px_110px_100px_50px] justify-between border-b items-center text-grayy-900 text-sm cursor-pointer"
                     @click="() => selectRow(row)"
                  >
                     <div class="td text-center p-3">
                        <span class="relative left-3">{{ getNumCountPagination(index, filter.page, filter.limit) }}</span>
                     </div>
                     <div class="td">
                        <img
                           v-if="row.products.length"
                           :src="ArrowUpIcon"
                           alt="arrow-up-icon"
                           :class="[expandedItemIds.includes(row.id) ? 'rotate-180' : '', 'cursor-pointer transition relative left-[18px]']"
                           @click.stop="() => handleExpandItem(row)"
                        />
                     </div>
                     <div class="td text-center">
                        <div class="relative left-4">
                           <BadgeVesselImport :label="row.statusDes" :type="row.status" />
                        </div>
                     </div>
                     <div class="td p-3">
                        <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                           <img :src="row.vesselFlagImage" :alt="row.vesselFlagName" class="w-6 h-6 rounded-full" />
                           <div>
                              <h3 class="text-gray-900 font-anuphan-medium">{{ row.vesselName }}</h3>
                              <p class="text-gray-600">{{ row.imoNumber }}/{{ row.officialNumber }}</p>
                           </div>
                        </div>
                     </div>
                     <div class="td p-3">{{ row.vesselTypeName }}</div>
                     <div class="td p-3">{{ getInputDecimal(row.grt?.toString(), 3) }}</div>
                     <div class="td p-3">
                        <p class="font-anuphan-medium text-gray-900">{{ row.berthName }}</p>
                        <p class="text-gray-600">{{ row.jettyName }}</p>
                     </div>
                     <div class="td p-3">
                        <div class="font-anuphan-medium text-gray-900">
                           {{ row.mooringDate ? renderDateFormat(row.mooringDate) : null }}
                        </div>
                        <div class="text-gray-700">
                           {{ row.mooringDate ? renderTimeFormat(row.mooringDate) : null }}
                        </div>
                     </div>
                     <div class="td p-3">
                        <div class="font-anuphan-medium text-gray-400">
                           {{ row.unmooringDate ? renderDateFormat(row.unmooringDate) : null }}
                        </div>
                        <div class="text-gray-700">
                           {{ row.unmooringDate ? renderTimeFormat(row.unmooringDate) : null }}
                        </div>
                     </div>
                     <div class="td p-3">{{ row.note }}</div>
                     <div class="td text-center p-3">
                        <UDropdown :items="getMenuTable(row)" @click.stop>
                           <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                        </UDropdown>
                     </div>
                  </div>
                  <transition name="expand" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                     <div v-if="expandedItemIds.includes(row.id)" class="content relative bg-white">
                        <div class="flex items-center ml-16">
                           <div class="p-4">
                              <table class="table-auto border-collapse border border-gray-400 w-full text-left">
                                 <tbody class="divide-y divide-gray-300">
                                    <tr v-for="(item, index) in row.products" :key="index" class="divide-x divide-gray-300">
                                       <td
                                          :class="[
                                             item.purposeTypeId === 1 ? 'bg-[#4AB288]' : item.purposeTypeId === 2 ? 'bg-[#F4736A]' : 'bg-[#ED9264]',
                                             'p-2 text-left text-white font-anuphan-semi-bold',
                                          ]"
                                       >
                                          {{ item.purposeTypeName || "-" }} #{{ index + 1 }}
                                       </td>
                                       <td class="p-2 text-left">
                                          <span v-if="item.purposeType === 'Passenger'"> {{ item.passengers || "0" }} คน </span>
                                          <span v-if="item.purposeType === 'Spare Part' || item.purposeType === 'Other' || item.purposeType === 'DischargeLoading'">
                                             {{ item.detail || "-" }}
                                          </span>
                                          <span v-if="item.purposeType === 'Loading' || item.purposeType === 'Discharge'">
                                             {{ item.productName || "-" }}
                                          </span>
                                       </td>
                                       <td v-if="item.purposeType === 'Loading' || item.purposeType === 'Discharge'" class="p-2 text-right">
                                          {{ getInputDecimal(item.mTonQty?.toString(), 3) || "-" }} M/TON
                                       </td>
                                       <td v-if="item.purposeType === 'Loading' || item.purposeType === 'Discharge'" class="p-2 text-right">
                                          {{ getInputDecimal(item.rTonQty?.toString(), 3) || "-" }} R/TON
                                       </td>
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
         <EmptyNotFoundTable v-if="!vesselImportList.length" />
      </div>

      <div class="flex justify-between px-6 py-3 overflow-auto">
         <div class="flex items-center">
            <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
            <Select :options="limitRowTable" v-model="filter.limit" class="w-20" />
         </div>
         <UPagination
            :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
            :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
            v-model="filter.page"
            :total="paginationData.totalItems"
            :page-count="filter.limit"
            @update:modelValue="onPageChange"
         />
      </div>
   </div>

   <DialogConfirm
      descriptionWrapperClass="max-w-[220px] mt-5 mb-0 mx-auto"
      buttonWrapperClass="!mt-4"
      icon="danger"
      colorConfirm="red"
      :title="$t('vessel_import_cancel_title')"
      :desc="$t('vessel_import_cancel_description')"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogVesselInConfirmCancelOpen"
      :dialogCancel="dialogVesselInConfirmCancel"
      :dialogConfirm="dialogVesselInConfirm"
   />
   <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseDialogAlert"
      :btnName="$t('close')"
   />
   <VesselImportEditForm
      :isDialogOpen="isDialogVesselImportEditFormOpen"
      :dialogCancel="dialogVesselImportEditCancel"
      :dialogConfirm="dialogVesselImportEditConfirm"
      :itemData="vesselImportItem"
   />
   <VesselImportError
      :isDialogOpen="isDialogVesselImportErrorOpen"
      :dialogCancel="dialogVesselImportErrorCancel"
      :dialogConfirm="dialogVesselImportErrorConfirm"
      :itemData="vesselImportItemError"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeVesselImport from "~/components/badge/badgeVesselImport.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import VesselImportEditForm from "~/components/dialog/ship-table/vessel-import/vessel-import-edit-form.vue";
import VesselImportError from "~/components/dialog/ship-table/vessel-import/vessel-import-error.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import AddIcon from "~/assets/icons/fi-rs-add.svg";
import ListIcon from "~/assets/icons/fi-rs-list.svg";
import DownloadBrandIcon from "~/assets/icons/fi-rs-download-brand.svg";
import UploadIcon from "~/assets/icons/fi-rs-upload.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import RedoAltIcon from "~/assets/icons/fi-rs-redo-alt.svg";
import ArrowUpIcon from "~/assets/icons/fi-rs-caret-up.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";

import useMasterDataService from "~/core/services/masterDataService";
const masterDataService = useMasterDataService();
import useVesselImportService from "~/core/services/vesselImport";
const vesselImportService = useVesselImportService();
const documentOptionsStore = useDocumentOptionsStore();

import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();
const { t, locale } = useI18n();
const route: any = useRoute();
import { format } from "date-fns";
import type { IFilterVesselImportList, IVesselImportError } from "~/core/interfaces/IFilterVesselImport";
import type { IVesselImportList } from "~/core/interfaces/IVesselImport.ts";
import type { IFilterAllStatus } from "~/core/interfaces/IFilterAllStatus";
import type { IDateRange } from "~/core/interfaces/IDate";
const isLoading = ref<boolean>(false);
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<IFilterVesselImportList>({
   limit: 10,
   page: 1,
   search: "",
   status: "",
   vesselFlagId: 0,
   vesselTypeId: 0,
   berthId: 0,
   jettyId: 0,
   mooringDateBegin: "",
   mooringDateEnd: "",
   unmooringDateBegin: "",
   unmooringDateEnd: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const allFilterObject = ref<IFilterAllStatus>({ id: "", name: `${locale.value === "en" ? "All" : "ทั้งหมด"}` });
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});
const dialogAlertProps = ref({
   title: "",
   desc: "",
   type: "",
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
const statusList = ref<any>([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   { id: "PendingSend", name: `${locale.value === "en" ? "PendingSend" : "รอส่ง"}` },
   { id: "PendingEdit", name: `${locale.value === "en" ? "PendingEdit" : "รอท่าแก้ไข"}` },
   { id: "Send", name: `${locale.value === "en" ? "Send" : "ส่งแล้ว"}` },
   { id: "RequestEdit", name: `${locale.value === "en" ? "RequestEdit" : "ท่าขอแก้ไข"}` },
]);

const vesselImportId = ref<number>(0);
const vesselImportList = ref<any[]>([]);
const vesselImportItem = ref<any>();
const vesselImportItemError = ref<IVesselImportError[]>([]);
const input_file_vessel_import = ref<HTMLInputElement | null>(null);
const mooringDate = ref<IDateRange | null>(null);
const unmooringDate = ref<IDateRange | null>(null);
const selectMooringDate = ref<IDateRange>({ start: new Date(), end: new Date() });
const selectUnmooringDate = ref<IDateRange>({ start: new Date(), end: new Date() });
const displayAllExpandItem = ref<boolean>(false);
const allowFetch = ref<boolean>(true);

const handleResetFilter = () => {
   allowFetch.value = true;
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.search = "";
   filter.value.status = "";
   filter.value.vesselFlagId = 0;
   filter.value.vesselTypeId = 0;
   filter.value.berthId = 0;
   filter.value.jettyId = 0;
   filter.value.mooringDateBegin = "";
   filter.value.mooringDateEnd = "";
   filter.value.unmooringDateBegin = "";
   filter.value.unmooringDateEnd = "";
   documentOptionsStore.berthJettiesOptions = [];
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   mooringDate.value = null;
   unmooringDate.value = null;
   selectMooringDate.value = { start: new Date(), end: new Date() };
   selectUnmooringDate.value = { start: new Date(), end: new Date() };
};

onMounted(() => {
   documentOptionsStore.getVesselFlagOptions();
   documentOptionsStore.getVesselTypeOptions();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getJettiesOptions();
   if (vtmsStore.sailingLogType === "PendingSend") {
      filter.value.status = "PendingSend";
   }
   getVesselImportList();
});

onUnmounted(() => {
   setTimeout(() => {
      vtmsStore.sailingLogType = "";
   }, 1000);
});

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      created: filter.value.created,
      status: filter.value.status,
      search: filter.value.search,
      vesselFlagId: filter.value.vesselFlagId,
      vesselTypeId: filter.value.vesselTypeId,
      berthId: filter.value.berthId,
      jettyId: filter.value.jettyId,
      mooringDate: mooringDate.value,
      unmooringDate: unmooringDate.value,
   }),
   (newValue, oldValue) => {
      if (newValue.mooringDate !== oldValue.mooringDate) {
         filter.value.mooringDateBegin = newValue.mooringDate ? adjustToUTC(newValue.mooringDate.start) : "";
         filter.value.mooringDateEnd = newValue.mooringDate ? adjustToUTC(newValue.mooringDate.end) : "";
      }
      if (newValue.unmooringDate !== oldValue.unmooringDate) {
         filter.value.unmooringDateBegin = newValue.unmooringDate ? adjustToUTC(newValue.unmooringDate.start) : "";
         filter.value.unmooringDateEnd = newValue.unmooringDate ? adjustToUTC(newValue.unmooringDate.end) : "";
      }
      if (newValue.berthId !== oldValue.berthId) {
         filter.value.jettyId = 0;
         if (newValue.berthId) {
            documentOptionsStore.getBerthJettiesOptions(newValue.berthId);
         }
      }

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
watch(
   () => route.query.status,
   (newQueryStatus) => {
      if (newQueryStatus) {
         filter.value.status = newQueryStatus;
      } else {
         filter.value.status = "";
      }
   }
);

const handleFilterSearch = debounceFilterSearch(() => {
   filter.value.page = 1;
   getVesselImportList();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getVesselImportList();
};

const onMooringDateChange = (newDate: IDateRange) => {
   mooringDate.value = newDate;
};
const onUnmooringDateChange = (newDate: IDateRange) => {
   unmooringDate.value = newDate;
};

const getVesselImportTemplate = async (fileTemplate: string) => {
   isLoading.value = true;
   let resp: any = null;
   try {
      resp = await vesselImportService.getVesselImportTemplate(fileTemplate);
      const isSuccess = resp.statusCode === 200;
      if (isSuccess) {
         const fileResponse = await fetch(resp.data.filePath);
         const blob = await fileResponse.blob();
         const blobUrl = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = blobUrl;
         link.download = resp.data.fileName;
         link.click();
         window.URL.revokeObjectURL(blobUrl);
      } else {
         dialogAlertProps.value = {
            title: locale.value === "th" ? resp.message : resp.translation,
            desc: "",
            type: "danger",
         };
      }
   } catch (error) {
      dialogAlertProps.value = {
         title: locale.value === "th" ? resp.message : resp.translation,
         desc: "",
         type: "danger",
      };
   } finally {
      isLoading.value = false;
   }
};

const getVesselImportList = async () => {
   isLoading.value = true;
   const resp = await vesselImportService.getVesselImportList(filter.value);
   if (resp.statusCode === 200) {
      vesselImportList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

const deleteVesselImport = async () => {
   isLoading.value = true;
   const resp = await vesselImportService.deleteVesselImport(vesselImportId.value);
   const isSuccess = resp.statusCode === 200;
   dialogAlertProps.value = {
      title: t(isSuccess ? "vessel_import_cancel_title" : "error_title"),
      desc: t(isSuccess ? "vessel_import_cancel_success" : "error_try_again"),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogVesselInConfirmCancelOpen.value = false;
   isLoading.value = false;
};

const getMenuTable = (row: IVesselImportList) => {
   if (row.status === "PendingSend" || row.status === "PendingEdit") {
      const items = [
         [
            {
               label: t("edit"),
               avatar: {
                  src: EditIcon,
               },
               click: () => {
                  navigateTo(`/ship-entry/vessel-import/edit?id=${row.id}`);
               },
            },
            {
               label: t("cancel"),
               avatar: {
                  src: CrossCircleIcon,
               },
               click: () => {
                  vesselImportId.value = row.id;
                  isDialogVesselInConfirmCancelOpen.value = true;
               },
            },
         ],
      ];
      return items;
   } else if (row.status === "Send") {
      const items = [
         [
            {
               label: t("view"),
               avatar: {
                  src: ViewIcon,
               },
               click: () => {
                  navigateTo(`/ship-entry/vessel-import/view?id=${row.id}`);
               },
            },
            {
               label: t("request_edit"),
               avatar: {
                  src: RedoAltIcon,
               },
               click: () => {
                  vesselImportItem.value = row;
                  isDialogVesselImportEditFormOpen.value = true;
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
                  navigateTo(`/ship-entry/vessel-import/view?id=${row.id}`);
               },
            },
         ],
      ];
      return items;
   }
};

const isDialogVesselInConfirmCancelOpen = ref(false);
const dialogVesselInConfirm = async () => {
   deleteVesselImport();
};
const dialogVesselInConfirmCancel = () => {
   isDialogVesselInConfirmCancelOpen.value = false;
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
   getVesselImportList();
};

const isDialogVesselImportEditFormOpen = ref(false);
const handleVesselImportEditForm = (status: boolean, mode: string) => {
   isDialogVesselImportEditFormOpen.value = status;
};
const dialogVesselImportEditCancel = () => {
   isDialogVesselImportEditFormOpen.value = false;
};
const dialogVesselImportEditConfirm = (status: boolean, type: string = "") => {
   isDialogVesselImportEditFormOpen.value = status;
   if (type === "refresh") {
      getVesselImportList();
   }
};

const isDialogVesselImportErrorOpen = ref(false);
const handleVesselImportError = (status: boolean, mode: string) => {
   isDialogVesselImportErrorOpen.value = status;
};
const dialogVesselImportErrorCancel = () => {
   isDialogVesselImportErrorOpen.value = false;
};
const dialogVesselImportErrorConfirm = (status: boolean, type: string = "") => {
   isDialogVesselImportErrorOpen.value = status;
};

const selectFile = () => {
   if (input_file_vessel_import.value) {
      input_file_vessel_import.value.value = "";
      input_file_vessel_import.value.click();
   }
};
const handleImportVessel = async (e: Event) => {
   isLoading.value = true;
   const target = e.target as HTMLInputElement;
   const file = target.files?.[0];
   const respUpload = await masterDataService.uploadVesselImport(file!);
   if (respUpload.statusCode === 200) {
      const fileId = respUpload.data.id;
      const respSend = await vesselImportService.sendVesselImport(fileId);
      if (respSend.statusCode === 200) {
         if (respSend.data?.length) {
            vesselImportItemError.value = respSend.data;
            isDialogVesselImportErrorOpen.value = true;
         } else {
            dialogAlertProps.value = {
               title: t("vessel_import"),
               desc: t("vessel_import_send_success"),
               type: "success",
            };
            isDialogAlertOpen.value = true;
         }
      } else {
         dialogAlertProps.value = {
            title: t("error_title"),
            desc: t("error_try_again"),
            type: "danger",
         };
         isDialogAlertOpen.value = true;
      }
   } else {
      dialogAlertProps.value = {
         title: t("error_title"),
         desc: t("error_try_again"),
         type: "danger",
      };
      isDialogAlertOpen.value = true;
   }
   isLoading.value = false;
};

const expandedItemIds = ref<number[]>([]);
const handleExpandItem = (row: IVesselImportList) => {
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
      expandedItemIds.value = vesselImportList.value.map((row) => row.id);
   }
   displayAllExpandItem.value = !displayAllExpandItem.value;
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

const toggleSort = (field: string) => {
   if (sortField.value !== field) {
      sortField.value = field;
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
   getVesselImportList();
};
</script>

<style scoped lang="scss">
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
