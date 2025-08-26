<template>
   <h1 class="font-anuphan-semi-bold text-2xl sm:text-[30px] text-black mb-6">
     {{ $t("vessel_log") }}
   </h1>
   <div id="vessel-shift-form" class="bg-white p-6">
     <UForm :schema="vesselShiftSchema" :state="formGroup" @submit="onSubmit" v-on:error="handleFormError">
       <header class="flex flex-col sm:flex-row items-center sm:items-start justify-between">
         <div class="mb-4 sm:mb-0">
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
             {{ $t("vessel_info_shift") }}
           </h1>
           <div class="mt-1 text-[#667085] text-sm">
             {{ $t("vessel_info_shift_details") }}
           </div>
         </div>
         <div class="flex gap-1">
           <UButton
             class="mx-2 border border-grayy-100 w-[67px] h-[36px] justify-center"
             size="md"
             color="gray"
             :label="$t('cancel')"
             @click="() => {
               vtmsStore.setSailingLogType('navigation');
               navigateTo(`/vtms/sailing-log/log/${Number(route.params.vessel)}`);
             }"
           />
           <SaveButton type="submit" />
         </div>
       </header>
 
       <UDivider class="my-6" />

       <section id="vessel-shift-section1 vessel-out" class="border rounded-xl border-solid border-[#D0D5DD] p-8 mt-6">
         <h2 class="font-anuphan-semi-bold text-base text-gray-400">
           {{ $t("vessel_berth_out") }}
         </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
           <Select
             :label="$t('berth')"
             name="vessel_out.berth_id"
             :placeholder="$t('search')"
             :options="berthList"
             v-model="formGroup.vessel_out.berth_id"
             required
             @change="(berthId: number) => getJetty(berthId, 'vessel-out', 'change')"
           />
           <Select
             :label="$t('berthing_purpose')"
             name="vessel_out.purpose_id"
             :placeholder="$t('search')"
             :options="purposeList"
             v-model="formGroup.vessel_out.purpose_id"
             required
           />

           <Select
             :label="$t('sub_berth')"
             name="vessel_out.jetty_id"
             :placeholder="$t('search')"
             :options="jettyListVesselOut"
             v-model="formGroup.vessel_out.jetty_id"
             required
             :disabled="!formGroup.vessel_out.berth_id"
           />
         </div>
         <UDivider class="my-4" />
         <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
           <UFormGroup :label="$t('vessel_entry_date')" required>
             <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                 name="vessel_out.mooring_date"
                 size="md"
                 variant="outline"
                 color="purple"
                 custom-icon="calendar"
                 v-model="formGroup.vessel_out.mooring_date"
                 :value="formGroup.vessel_out.mooring_date ? format(new Date(formGroup.vessel_out.mooring_date), 'd MMM, yyyy, HH:mm') : ''"
                 :placeholder="$t('vessel_entry_date')"
                 :error="isDateError('vessel_out.mooring_date') ? dateValidation.vessel_out_mooring_date.message : ''"
                 :ui="{ wrapper: 'w-full rounded-md bg-white' }"
               />
               <template #panel="{ close }">
                 <Datepicker
                   v-model="vesselOutMooringDate"
                   @close="close"
                   is-required
                   is24hr
                   type="normal"
                   mode="dateTime"
                   v-on:date-change="onVesselOutMooringDateChange"
                 />
               </template>
             </UPopover>
           </UFormGroup>
 
           <UFormGroup :label="$t('vessel_departure_date')" required>
             <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                 name="vessel_out.departure_date"
                 size="md"
                 variant="outline"
                 color="purple"
                 custom-icon="calendar"
                 v-model="formGroup.vessel_out.departure_date"
                 :value="formGroup.vessel_out.departure_date ? format(new Date(formGroup.vessel_out.departure_date), 'd MMM, yyyy, HH:mm') : ''"
                 :placeholder="$t('vessel_departure_date')"
                 :error="isDateError('vessel_out.departure_date') ? dateValidation.vessel_out_departure_date.message : ''"
                 :ui="{ wrapper: 'w-full rounded-md bg-white' }"
               />
               <template #panel="{ close }">
                 <Datepicker
                   v-model="vesselOutDepartureDate"
                   @close="close"
                   is-required
                   is24hr
                   type="normal"
                   mode="dateTime"
                   v-on:date-change="onVesselOutDepartureDateChange"
                 />
               </template>
             </UPopover>
           </UFormGroup>
         </div>
       </section>

       <section id="vessel-shift-section2 vessel-in" class="border rounded-xl border-solid border-[#D0D5DD] p-8 mt-8">
         <h2 class="font-anuphan-semi-bold text-base text-gray-400">
           {{ $t("vessel_berth_in") }}
         </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
           <Select
             :label="$t('berth')"
             name="vessel_in.berth_id"
             :placeholder="$t('search')"
             :options="berthList"
             v-model="formGroup.vessel_in.berth_id"
             required
             @change="(berthId: number) => getJetty(berthId, 'vessel-in', 'change')"
           />
           <Select
             :label="$t('berthing_purpose')"
             name="vessel_in.purpose_id"
             :placeholder="$t('search')"
             :options="purposeList"
             v-model="formGroup.vessel_in.purpose_id"
             required
           />

           <Select
             :label="$t('sub_berth')"
             name="vessel_in.jetty_id"
             :placeholder="$t('search')"
             :options="jettyListVesselIn"
             v-model="formGroup.vessel_in.jetty_id"
             required
             :disabled="!formGroup.vessel_in.berth_id"
           />
         </div>
         <UDivider class="my-4" />
         <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
           <UFormGroup :label="$t('vessel_entry_date')" required>
             <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                 name="vessel_in.mooring_date"
                 size="md"
                 variant="outline"
                 color="purple"
                 custom-icon="calendar"
                 v-model="formGroup.vessel_in.mooring_date"
                 :value="formGroup.vessel_in.mooring_date ? format(new Date(formGroup.vessel_in.mooring_date), 'd MMM, yyyy, HH:mm') : ''"
                 :placeholder="$t('vessel_entry_date')"
                 :error="isDateError('vessel_in.mooring_date') ? dateValidation.vessel_in_mooring_date.message : ''"
                 :ui="{ wrapper: 'w-full rounded-md bg-white' }"
               />
               <template #panel="{ close }">
                 <Datepicker
                   v-model="vesselInMooringDate"
                   @close="close"
                   is-required
                   is24hr
                   type="normal"
                   mode="dateTime"
                   v-on:date-change="onVesselInMooringDateChange"
                 />
               </template>
             </UPopover>
           </UFormGroup>

         </div>
       </section>
 

       <section id="vessel-shift-section3" class="border rounded-xl border-solid border-[#D0D5DD] p-8 mt-6">
         <div>
           <div class="flex flex-col sm:flex-row items-center sm:items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("tug_boat") }}
             </h1>
             <UButton
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('add_tug_boat')"
               @click="() => handleTugBoatForm(true, 'create', 'vessel-shift')"
             />
           </div>

           <div class="overflow-x-auto mt-4">
             <UTable
               :columns="columnsTugListTable"
               :rows="tugList"
               :ui="{
                 wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                 thead: 'bg-primary-50',
                 tbody: 'border-none'
               }"
             >
               <template #id-data="{ index }">
                 <div class="text-center">{{ index + 1 }}</div>
               </template>
               <template #actions-data="{ row, index }">
                 <div class="text-right">
                   <UDropdown :items="getTugListMenuTable(row, index)">
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                   </UDropdown>
                 </div>
               </template>
             </UTable>
           </div>
         </div>
         <UDivider class="my-6" />
         <div>
           <div class="flex flex-col sm:flex-row items-center sm:items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("pilot") }}
             </h1>
             <UButton
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('add_pilot')"
               @click="() => handleNavigateForm(true, 'create', 'vessel-shift')"
             />
           </div>
           <div class="overflow-x-auto mt-4">
             <UTable
               :columns="columnsPilotListTable"
               :rows="pilotList"
               :ui="{
                 wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                 thead: 'bg-primary-50',
                 tbody: 'border-none'
               }"
             >
               <template #id-data="{ index }">
                 <div class="text-center">{{ index + 1 }}</div>
               </template>
               <template #actions-data="{ row, index }">
                 <div class="text-right">
                   <UDropdown :items="getPilotListMenuTable(row, index)">
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                   </UDropdown>
                 </div>
               </template>
             </UTable>
           </div>
         </div>
       </section>

       <section id="vessel-shift-section4" class="border rounded-xl border-solid border-[#D0D5DD] p-8 mt-6">
         <div class="flex flex-col sm:flex-row items-center sm:items-center justify-between">
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
             {{ $t("cargo_list") }}
           </h1>
           <UButton
             icon="i-heroicons-plus-circle"
             size="md"
             :label="$t('add_cargo')"
             @click="() => handleInventoryForm(true, 'create', 'vessel-shift')"
           />
         </div>
         <div class="overflow-x-auto mt-4">
           <UTable
             :columns="columnsProductListTable"
             :rows="productList"
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
               thead: 'bg-primary-50',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #actions-data="{ row, index }">
               <div class="text-right">
                 <UDropdown :items="getProductListMenuTable(row, index)">
                   <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                 </UDropdown>
               </div>
             </template>
           </UTable>
         </div>
       </section>
     </UForm>
   </div>

   <TugBoatForm
     :isDialogOpen="isDialogTugBoatFormOpen"
     :dialogCancel="dialogTugBoatCancel"
     :dialogConfirm="dialogTugBoatConfirm"
     :addData="addTug"
     :editData="editTug"
     :mode="actionMode"
     :itemId="itemIndexTug"
     :itemData="itemDataTug"
     :vesselType="vesselType"
   />
   <NagivateForm
     :isDialogOpen="isDialogNavigateFormOpen"
     :dialogCancel="dialogNavigateCancel"
     :dialogConfirm="dialogNavigateConfirm"
     :addData="addPilot"
     :editData="editPilot"
     :mode="actionMode"
     :itemId="itemIndexPilot"
     :itemData="itemDataPilot"
     :vesselType="vesselType"
   />
   <InventoryForm
     :isDialogOpen="isDialogInventoryFormOpen"
     :dialogCancel="dialogInventoryCancel"
     :dialogConfirm="dialogInventoryConfirm"
     :addData="addProduct"
     :editData="editProduct"
     :mode="actionMode"
     :itemId="itemIndexProduct"
     :itemData="itemDataProduct"
     :vesselType="vesselType"
   />
 
   <DialogConfirm
     :title="$t('leave_this_page_title')"
     :desc="$t('leave_this_page_message')"
     icon="warning"
     :labelConfirm="$t('confirm')"
     :isDialogOpen="isConfirmLeaveDialogOpen"
     :dialogCancel="handleCancelLeave"
     :dialogConfirm="handleConfirmLeave"
   />
   <DialogConfirm
     icon="warning"
     :title="$t('save_title')"
     :desc="$t('save_description')"
     :labelConfirm="$t('confirm')"
     :isDialogOpen="isDialogConfirmOpen"
     :dialogCancel="dialogConfirmCancel"
     :dialogConfirm="dialogConfirm"
   />
   <DialogAlert
     :title="$t('save_title')"
     :desc="$t('save_success')"
     type="success"
     :isOpen="isDialogSuccessOpen"
     :setDialog="handleCloseSuccessDialog"
   />
   <Loading v-if="isLoading" />
 </template>
 

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import SaveButton from "~/components/button/save.vue";
import TugBoatForm from "~/components/dialog/sailing-log/vessel/tug-boat-form.vue";
import NagivateForm from "~/components/dialog/sailing-log/vessel/navigate-form.vue";
import InventoryForm from "~/components/dialog/sailing-log/vessel/inventory-form.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";

import useLogBookService from "~/core/services/vtms/logBookService";
const logBookService = useLogBookService();

import usePortService from "~/core/services/masterDataShipService/port/portService";
const { getPort } = usePortService();

import useBerthService from "~/core/services/masterDataShipService/port/berthService";
const { getBerth, getBerthDetail } = useBerthService();

import usePurposeService from "~/core/services/masterDataShipService/port/purposeService";
const { getPurpose } = usePurposeService();

import useCargoTypeService from "~/core/services/masterDataShipService/product/cargoTypeService";
const cargoTypeService = useCargoTypeService();

import useCargoWharfageService from "~/core/services/masterDataShipService/product/cargoWharfageService";
const cargoWharfageService = useCargoWharfageService();

import useDocumentService from "~/core/services/documentService";
const documentService = useDocumentService();

import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();

const toast = useToast();
const { t, locale } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import type { IFilterBerth } from "~/core/interfaces/IFilterBerth";
import type { IFilterPurpose } from "~/core/interfaces/IFilterPurpose";
import type { IBerthGet } from "~/core/interfaces/IBerth";
import type { IPurposeGet } from "~/core/interfaces/IPurpose";
import type { IPortGet } from "~/core/interfaces/IPort";
import type { DateValidationAnchorDroppingForm, IFormGroupValid } from "~/core/interfaces/IAnchordropping";
const route = useRoute();

onMounted(() => {
   getDocumentDetail();
   getVtmsDocumentBerthDetail();
   getVtmsLogBookDocumentDetail();
   getVtmsLogBookBerthDetail();
   getMasterDataList();
});

const vesselShiftSchema = z.object({
   vessel_out: z.object({
      berth_id: z.number().min(1, { message: t("required") }),
      purpose_id: z.number().min(1, { message: t("required") }),
      //cargo_type_id: z.number().min(1, { message: t("required") }),
      //cargo_wharfage_id: z.number().min(1, { message: t("required") }),
      jetty_id: z.number().min(1, { message: t("required") }),
   }),

   vessel_in: z.object({
      berth_id: z.number().min(1, { message: t("required") }),
      purpose_id: z.number().min(1, { message: t("required") }),
      //cargo_type_id: z.number().min(1, { message: t("required") }),
      //cargo_wharfage_id: z.number().min(1, { message: t("required") }),
      jetty_id: z.number().min(1, { message: t("required") }),
   }),
});

const props = defineProps({
   sailingLogId: {
      type: Number || String,
      default: 0,
   },
});
const formGroup = ref<any>({
   gross_tonnage: 0,
   depth: 0,
   port_id_last: 0,
   port_id_next: 0,
   voyage: "",
   document_berth_id: 0,
   vessel_id: 0,

   // Details
   vessel_out: {
      berth_id: 0,
      purpose_id: 0,
      cargo_type_id: 0,
      cargo_wharfage_id: 0,
      jetty_id: 0,
      departure_date: null,
      mooring_date: null,
      type_doc: "Departure",
   },
   vessel_in: {
      berth_id: 0,
      purpose_id: 0,
      cargo_type_id: 0,
      cargo_wharfage_id: 0,
      jetty_id: 0,
      //departure_date: null,
      mooring_date: null,
      type_doc: "Arrival",
   },

   tugs: [],
   pilots: [],
   products: [],
});
//const vesselInDepartureDate = ref<any>(new Date());
const vesselInMooringDate = ref<any>(new Date());
const vesselOutDepartureDate = ref<any>(new Date());
const vesselOutMooringDate = ref<any>(new Date());

const actionMode = ref<string>("");
const vesselType = ref<string>("");
const isLoading = ref<boolean>(false);
const portList = ref<IPortGet[]>([]);
const berthList = ref<IBerthGet[]>([]);
const purposeList = ref<IPurposeGet[]>([]);
const jettyListVesselOut = ref<any[]>([]);
const jettyListVesselIn = ref<any[]>([]);
const cargoTypeList = ref<any[]>([]);
const cargoWharfageList = ref<any[]>([]);

const itemIndexTug = ref(0);
const itemIndexPilot = ref(0);
const itemIndexProduct = ref(0);
const itemDataTug = ref();
const itemDataPilot = ref();
const itemDataProduct = ref();

const documentBerthIdArrival = ref(Number(route.params.vesselId));
const documentBerthIdDeparture = ref(0);

const tugList = ref<any>([]);
const tugListDeletedItem = ref<any>([]);

const pilotList = ref<any>([]);
const pilotListDeletedItem = ref<any>([]);

const productList = ref<any>([]);
const productListDeletedItem = ref<any>([]);

const filterPort = ref<any>({
   country_id: "",
   limit: -1,
   page: 1,
   search: "",
   status: "",
});
const filterBerth = ref<IFilterBerth>({
   limit: -1,
   page: 1,
   search: "",
   vessel_type_id: "",
   personType: "",
});
const filterPurpose = ref<IFilterPurpose>({
   limit: -1,
   page: 1,
   search: "",
   status: "",
});
const filterCargoType = ref<any>({
   limit: -1,
   page: 1,
   search: "",
   status: "",
});
const filterCargoWharfage = ref<any>({
   limit: -1,
   page: 1,
   search: "",
   status: "",
});

const getVtmsLogBookBerthDetail = async () => {
   const res = await logBookService.getVtmsLogBookBerthDetail(Number(route.params.vessel));
   if (res.statusCode === 200) {
      formGroup.value.document_berth_id = res.data[0]?.doc_berth_id;
   }
};

const getDocumentDetail = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentDetail(Number(route.params.vessel));
   if (resp.statusCode === 200) {
      formGroup.value.vessel_id = resp.data.vessel.vesselId;
      formGroup.value.gross_tonnage = resp.data.vessel.vesselGrossTonnage;
      formGroup.value.depth = resp.data.vessel.vesselDepth;
      getJetty(resp.data.berths[0]?.berthId, "all-vessel-out", "fetch");
   }
   isLoading.value = false;
};

const getVtmsDocumentBerthDetail = async () => {
   const resp = await logBookService.getVtmsDocumentBerthDetail(Number(route.params.vessel), Number(route.params.vesselId));
   if (resp.statusCode === 200) {
      formGroup.value.vessel_in.berth_id = resp.data.berthId ? resp.data.berthId : 0;
      formGroup.value.vessel_in.purpose_id = resp.data.purposeId ? resp.data.purposeId : 0;
      // formGroup.value.vessel_in.cargo_type_id = resp.data.cargoTypeId ? resp.data.cargoTypeId : 0;
      // formGroup.value.vessel_in.cargo_wharfage_id = resp.data.cargoWharfageId ? resp.data.cargoWharfageId : 0;
      // formGroup.value.vessel_in.jetty_id = resp.data.jettyId ? resp.data.jettyId : 0;
      // formGroup.value.vessel_in.mooring_date = resp.data?.estimatedArrival ? resp.data?.estimatedArrival : null;
      // formGroup.value.vessel_in.departure_date = resp.data?.estimatedDeparture ? resp.data?.estimatedDeparture : null;
      formGroup.value.vessel_in.jetty_id = resp.data.selectedJettyId ? resp.data.selectedJettyId : 0;
      getJetty(resp.data.berthId ? resp.data.berthId : 0, "all-vessel-in", "fetch");
   }
};

const getVtmsLogBookDocumentDetail = async () => {
   const resp = await logBookService.getVtmsLogBookDocumentDetail(Number(route.params.vessel));
   if (resp.statusCode === 200) {
      formGroup.value.port_id_next = resp.data.port_id_next;
      formGroup.value.port_id_last = resp.data.port_id_last;
      formGroup.value.voyage = resp.data.voyage;
      formGroup.value.vessel_out.berth_id = resp.data.details.berth_id;
      formGroup.value.vessel_out.purpose_id = resp.data.details.purpose_id;
      formGroup.value.vessel_out.cargo_type_id = resp.data.details.cargo_type_id;
      formGroup.value.vessel_out.cargo_wharfage_id = resp.data.details.cargo_wharfage_id;
      formGroup.value.vessel_out.jetty_id = resp.data.details.jetty_id;
      formGroup.value.vessel_out.mooring_date = resp.data.details.mooring_date ? resp.data.details.mooring_date : null;
      formGroup.value.vessel_out.departure_date = resp.data.details.departure_date ? resp.data.details.departure_date : null;

      vesselOutMooringDate.value = resp.data.details?.mooring_date ? new Date(resp.data.details.mooring_date) : new Date();
      vesselOutDepartureDate.value = resp.data.details?.departure_date ? new Date(resp.data.details.departure_date) : new Date();

      tugList.value = resp.data.tugs ? resp.data.tugs : [];
      pilotList.value = resp.data.pilots ? resp.data.pilots : [];
      productList.value = resp.data.products ? resp.data.products : [];

      documentBerthIdDeparture.value = resp.data.details.document_berth_id;
   }
};

const getMasterDataList = async () => {
   const respPort = await getPort(filterPort.value);
   if (respPort.statusCode === 200) {
      portList.value = respPort.data.data;
   }

   const respBerth = await getBerth(filterBerth.value);
   if (respBerth.statusCode === 200) {
      berthList.value = respBerth.data.data.map((item: IBerthGet) => ({ id: item.id, name: locale.value === "en" ? item.name_en : item.name_th }));
      //getJetty(formGroup.value?.berth_id, "all", "fetch");
   }

   const respPurpose = await getPurpose(filterPurpose.value);
   if (respPurpose.statusCode === 200) {
      purposeList.value = respPurpose.data.data.map((item: IPurposeGet) => ({ id: item.purpose_id, name: item.purpose_name }));
   }

   const respCargoType = await cargoTypeService.getCargoType(filterCargoType.value);
   if (respCargoType.statusCode === 200) {
      cargoTypeList.value = respCargoType.data.data;
   }

   const respCargoWharfage = await cargoWharfageService.getCargoWharfage(filterCargoWharfage.value);
   if (respCargoWharfage.statusCode === 200) {
      cargoWharfageList.value = respCargoWharfage.data.data;
   }
};

const getJetty = async (berthId: number, vesselType: string = "", type: string = "") => {
   const res = await getBerthDetail(berthId);
   if (res.statusCode === 200) {
      //console.log(berthId, vesselType, type);
      if (vesselType === "all-vessel-out" && type === "fetch") {
         jettyListVesselOut.value = res.data.jettys;
      }
      if (vesselType === "all-vessel-in" && type === "fetch") {
         jettyListVesselIn.value = res.data.jettys;
      }
      if (vesselType === "vessel-out" && type === "change") {
         formGroup.value.vessel_out.jetty_id = 0;
         jettyListVesselOut.value = res.data.jettys;
      }
      if (vesselType === "vessel-in" && type === "change") {
         formGroup.value.vessel_in.jetty_id = 0;
         jettyListVesselIn.value = res.data.jettys;
      }
   }
};

const handleFormError = (error: ZodError): void => {
   allDatePristine();
};
async function onSubmit(event: FormSubmitEvent<z.output<typeof vesselShiftSchema>>) {
   allDatePristine();
   if (!isFormGroupValid(formGroup.value)) {
      return;
   }
   isDialogConfirmOpen.value = true;
}

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
   notAllowNavigate.value = false;
   vtmsStore.setSailingLogType("navigation");
   navigateTo(`/vtms/sailing-log/log/${Number(route.params.vessel)}`);
};
const isDialogConfirmOpen = ref(false);

const dialogConfirm = async () => {
   const tugPayload = [...tugList.value, ...tugListDeletedItem.value].map(({ id, is_delete, tug_id, statusCode }) => ({ id, is_delete, tug_id, statusCode }));
   const pilotPayload = [...pilotList.value, ...pilotListDeletedItem.value].map(({ id, is_delete, pilot_id, statusCode }) => ({ id, is_delete, pilot_id, statusCode }));
   const productPayload = [...productList.value, ...productListDeletedItem.value].map(({ id, is_delete, product_type_id, mTonQty, rTonQty }) => ({
      id,
      is_delete,
      product_type_id,
      mTonQty,
      rTonQty,
   }));
   const docId = getLastSegmentFromURL(route.path);

   const payload: any = {
      gross_tonnage: formGroup.value.gross_tonnage,
      depth: formGroup.value.depth,
      port_id_last: formGroup.value.port_id_last,
      port_id_next: formGroup.value.port_id_next,
      voyage: formGroup.value.voyage,
      document_berth_id: Number(docId),
      vessel_id: formGroup.value.vessel_id,
      details: [
         {
            berth_id: formGroup.value.vessel_in.berth_id,
            purpose_id: formGroup.value.vessel_in.purpose_id,
            cargo_type_id: formGroup.value.vessel_in.cargo_type_id,
            cargo_wharfage_id: formGroup.value.vessel_in.cargo_wharfage_id,
            jetty_id: formGroup.value.vessel_in.jetty_id,
            //departure_date: convertTimezone(new Date(formGroup.value.vessel_in.departure_date), 7, false),
            mooring_date: convertTimezone(new Date(formGroup.value.vessel_in.mooring_date), 7, false),
            type_doc: "Arrival",
            document_berth_id: documentBerthIdArrival.value,
         },
         {
            berth_id: formGroup.value.vessel_out.berth_id,
            purpose_id: formGroup.value.vessel_out.purpose_id,
            cargo_type_id: formGroup.value.vessel_out.cargo_type_id,
            cargo_wharfage_id: formGroup.value.vessel_out.cargo_wharfage_id,
            jetty_id: formGroup.value.vessel_out.jetty_id,
            departure_date: convertTimezone(new Date(formGroup.value.vessel_out.departure_date), 7, false),
            mooring_date: convertTimezone(new Date(formGroup.value.vessel_out.mooring_date), 7, false),
            type_doc: "Departure",
            document_berth_id: documentBerthIdDeparture.value,
         },
      ],
      tugs: tugPayload,
      pilots: pilotPayload,
      products: productPayload,
   };

   isLoading.value = true;
   const resp = await logBookService.addVtmsLogBook(payload);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      isDialogConfirmOpen.value = false;
   } else {
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};
const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};

const columnsTugListTable = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: t("navigation_status"),
   },
   {
      key: "tug_name",
      label: t("ship_name"),
   },
   {
      key: "tug_type",
      label: t("ship_type"),
   },
   {
      key: "actions",
      sortable: false,
   },
];
const getTugListMenuTable = (row: any, index: number) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               itemIndexTug.value = index;
               itemDataTug.value = row;
               handleTugBoatForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deleteTug(row, index);
            },
         },
      ],
   ];
   return items;
};

const columnsPilotListTable = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: t("navigation_status"),
   },
   {
      key: "pilot_number",
      label: t("code"),
   },
   {
      key: "pilot_name",
      label: t("pilot_name"),
   },
   {
      key: "pilot_tel",
      label: t("phone_number"),
   },
   {
      key: "actions",
      sortable: false,
   },
];

const getPilotListMenuTable = (row: any, index: number) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               itemIndexPilot.value = index;
               itemDataPilot.value = row;
               handleNavigateForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deletePilot(row, index);
            },
         },
      ],
   ];
   return items;
};

const columnsProductListTable = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "product_group_name",
      label: t("product_group"),
   },
   {
      key: "product_type_name",
      label: t("product_kind"),
   },
   {
      key: "mTonQty",
      label: "ปริมาณ M/Ton",
   },
   {
      key: "rTonQty",
      label: "ปริมาณ R/Ton",
   },
   {
      key: "actions",
      sortable: false,
   },
];
const getProductListMenuTable = (row: any, index: number) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               itemIndexProduct.value = index;
               itemDataProduct.value = row;
               handleInventoryForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deleteProduct(row, index);
            },
         },
      ],
   ];
   return items;
};

const nextRoute = ref<any>(null);
const notAllowNavigate = ref<Boolean>(true);
const isConfirmLeaveDialogOpen = ref<any>(false);
const handleConfirmLeave = () => {
   isConfirmLeaveDialogOpen.value = false;
   notAllowNavigate.value = false;
   if (nextRoute.value) {
      navigateTo(nextRoute.value);
   }
};
const handleCancelLeave = () => {
   isConfirmLeaveDialogOpen.value = false;
   nextRoute.value = null;
};
onBeforeRouteLeave((to, from, next) => {
   if (notAllowNavigate.value) {
      isConfirmLeaveDialogOpen.value = true;
      nextRoute.value = to;
      next(false);
   } else {
      next();
   }
});

//tug boat
const isDialogTugBoatFormOpen = ref(false);
const handleTugBoatForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogTugBoatFormOpen.value = status;
};
const dialogTugBoatCancel = () => {
   isDialogTugBoatFormOpen.value = false;
};
const dialogTugBoatConfirm = (status: boolean, type: string = "") => {
   isDialogTugBoatFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getTugBoatList();
   }
};

// navigate
const isDialogNavigateFormOpen = ref(false);
const handleNavigateForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogNavigateFormOpen.value = status;
};
const dialogNavigateCancel = () => {
   isDialogNavigateFormOpen.value = false;
};
const dialogNavigateConfirm = (status: boolean, type: string = "") => {
   isDialogNavigateFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getNavigateList();
   }
};

// inventory
const isDialogInventoryFormOpen = ref(false);
const handleInventoryForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogInventoryFormOpen.value = status;
};
const dialogInventoryCancel = () => {
   isDialogInventoryFormOpen.value = false;
};
const dialogInventoryConfirm = (status: boolean, type: string = "") => {
   isDialogInventoryFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getproductList();
   }
};

const addTug = (tugs: any[]) => {
   tugs.forEach((tug: any) => {
      const mockupId = generateRandomId();
      const body = [
         {
            id: 0,
            mockup_id: mockupId,
            tug_id: tug.tug_id,
            tug_name: tug.name,
            tug_type: tug.type,
            status: "Vessel In",
            statusCode: "Arrival",
            is_delete: false,
         },
         {
            id: 0,
            mockup_id: mockupId,
            tug_id: tug.tug_id,
            tug_name: tug.name,
            tug_type: tug.type,
            status: "Vessel Out",
            statusCode: "Departure",
            is_delete: false,
         },
      ];

      tugList.value.push(...body);
   });
};

const editTug = (updatedTug: any, index: number) => {
   const existingTug = tugList.value[index];
   if (existingTug) {
      tugList.value[index] = {
         ...existingTug,
         tug_id: updatedTug.tug_id,
         tug_name: updatedTug.name,
         tug_type: updatedTug.type,
         is_delete: false,
      };
   }
};

const deleteTug = (tug: any, index: number) => {
   if (tug.id !== 0) {
      tugList.value.splice(index, 1);
      tugListDeletedItem.value.push({ ...tug, is_delete: true });
   } else {
      tugList.value = tugList.value.filter((item: any) => item.mockup_id !== tug.mockup_id);
   }
};

const addPilot = (pilots: any) => {
   pilots.forEach((pilot: any) => {
      const mockupId = generateRandomId();
      const body = [
         {
            id: 0,
            mockup_id: mockupId,
            pilot_id: pilot.pilot_id,
            pilot_number: pilot.number,
            pilot_name: pilot.name,
            pilot_tel: pilot.tel,
            status: "Vessel In",
            statusCode: "Arrival",
            is_delete: false,
         },
         {
            id: 0,
            mockup_id: mockupId,
            pilot_id: pilot.pilot_id,
            pilot_number: pilot.number,
            pilot_name: pilot.name,
            pilot_tel: pilot.tel,
            status: "Vessel Out",
            statusCode: "Departure",
            is_delete: false,
         },
      ];

      pilotList.value.push(...body);
   });
};

const editPilot = (updatedPilot: any, index: number) => {
   const existingPilot = pilotList.value[index];
   if (existingPilot) {
      pilotList.value[index] = {
         ...existingPilot,
         pilot_id: updatedPilot.pilot_id,
         pilot_number: updatedPilot.number,
         pilot_name: updatedPilot.name,
         pilot_tel: updatedPilot.tel,
         is_delete: false,
      };
   }
};

const deletePilot = (pilot: any, index: number) => {
   if (pilot.id !== 0) {
      pilotList.value.splice(index, 1);
      pilotListDeletedItem.value.push({ ...pilot, is_delete: true });
   } else {
      pilotList.value = pilotList.value.filter((item: any) => item.mockup_id !== pilot.mockup_id);
   }
};

const addProduct = (event: any) => {
   let body = {
      id: 0,
      product_group_id: event.product_group_id,
      product_group_name: event.product_group_name,
      product_type_id: event.product_type_id,
      product_type_name: event.product_type_name,
      status: "",
      mTonQty: event.mTonQty,
      rTonQty: event.rTonQty,
      is_delete: false,
   };
   productList.value.push(body);
};
const editProduct = (event: any) => {
   let body = {
      id: event.id,
      product_group_id: event.product_group_id,
      product_group_name: event.product_group_name,
      product_type_id: event.product_type_id,
      product_type_name: event.product_type_name,
      status: "",
      mTonQty: event.mTonQty,
      rTonQty: event.rTonQty,
      is_delete: false,
   };
   productList.value[itemIndexProduct.value] = body;
   itemDataProduct.value = null;
};
const deleteProduct = (product: any, index: number) => {
   productList.value.splice(index, 1);
   if (product.id !== 0) {
      productListDeletedItem.value.push({ ...product, is_delete: true });
   }
};

["vessel_in.mooring_date", "vessel_out.mooring_date", "vessel_out.departure_date"].forEach((key) => {
   watch(
      () => key.split(".").reduce((obj, k) => obj && obj[k], formGroup.value),
      (newValue) => {
         if (newValue !== undefined) {
            dateValidation.value[key.replace(/\./g, "_")].pristine = true;
         }
      }
   );
});
const dateValidation = ref<DateValidationAnchorDroppingForm>({
   vessel_in_mooring_date: { message: t("required"), pristine: false },
   //vessel_in_departure_date: { message: t("required"), pristine: false },
   vessel_out_mooring_date: { message: t("required"), pristine: false },
   vessel_out_departure_date: { message: t("required"), pristine: false },
});
const allDatePristine = (pristineValue = true) => {
   for (const key in dateValidation.value) {
      dateValidation.value[key].pristine = pristineValue;
   }
};

const isDateError = (field: string) => {
   const value = field.split(".").reduce((obj, k) => obj && obj[k], formGroup.value);
   const validationKey = field.replace(/\./g, "_");
   const pristine = dateValidation.value[validationKey].pristine;

   if (!value && pristine) {
      dateValidation.value[validationKey].message = t("required");
      return true;
   }

   // if (field === "vessel_in.departure_date" && value && new Date(value) < new Date(formGroup.value.vessel_in.mooring_date)) {
   //    dateValidation.value[validationKey].message = t("departure_day_or_time_gte");
   //    return true;
   // }

   if (field === "vessel_out.departure_date" && value && new Date(value) < new Date(formGroup.value.vessel_out.mooring_date)) {
      dateValidation.value[validationKey].message = t("departure_day_or_time_gte");
      return true;
   }

   return false;
};
const isFormGroupValid = (formGroup: { vessel_in: { mooring_date: string }; vessel_out: { mooring_date: string; departure_date: string }; [key: string]: any }) => {
   const {
      vessel_in,
      vessel_out,
      gross_tonnage,
      depth,
      port_id_last,
      port_id_next,
      voyage,
      document_berth_id,
      vessel_id,
      tugs,
      pilots,
      products,
      ...fieldsToCheck
   } = formGroup;

   const allFieldsValid = Object.values(fieldsToCheck).every((value) => value);

   // const isVesselInValid = vessel_in.mooring_date && vessel_in.departure_date && new Date(vessel_in.departure_date) >= new Date(vessel_in.mooring_date);

   const isVesselInValid = vessel_in.mooring_date;

   const isVesselOutValid = vessel_out.mooring_date && vessel_out.departure_date && new Date(vessel_out.departure_date) >= new Date(vessel_out.mooring_date);

   return allFieldsValid && isVesselInValid && isVesselOutValid;
};

const onVesselInMooringDateChange = (newDate: any) => {
   formGroup.value.vessel_in.mooring_date = newDate ? new Date(newDate).toISOString() : "";
};
// const onVesselInDepartureDateChange = (newDate: any) => {
//    formGroup.value.vessel_in.departure_date = newDate ? new Date(newDate).toISOString() : "";
// };
const onVesselOutMooringDateChange = (newDate: any) => {
   formGroup.value.vessel_out.mooring_date = newDate ? new Date(newDate).toISOString() : "";
};
const onVesselOutDepartureDateChange = (newDate: any) => {
   formGroup.value.vessel_out.departure_date = newDate ? new Date(newDate).toISOString() : "";
};

const getLastSegmentFromURL = (url: string) => {
   const segments = url.split("/");
   return segments.pop();
};
</script>
