<template>
   <h1 class="font-anuphan-semi-bold text-2xl sm:text-[30px] text-black mb-6">
      {{ $t("sailing_log") }}
   </h1>
   <div id="vessel-out-form" class="bg-white p-6">
      <UForm :schema="vesselOutSchema" :state="formGroup" @submit="onSubmit" v-on:error="handleFormError">
         <header class="flex flex-col sm:flex-row items-center sm:items-center justify-between">
            <div class="mb-4 sm:mb-0">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("vessel_departure_info") }}</h1>
               <div class="mt-1 text-[#667085] text-sm">{{ $t("specify_vessel_departure_details") }}</div>
            </div>
            <div class="flex gap-1">
               <UButton
                  class="mx-2 border border-grayy-100 w-[67px] h-[36px] justify-center"
                  size="md"
                  color="gray"
                  :label="$t('cancel')"
                  @click="
                     () => {
                        vtmsStore.setSailingLogType('navigation');
                        navigateTo(`/vtms/sailing-log/log/${Number(route.params.vessel)}`);
                     }
                  "
               />
               <SaveButton type="submit" />
            </div>
         </header>
         <UDivider class="my-6" />
         <section id="vessel-out-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-8">
            <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("dock_info") }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
               <Select
                  :label="$t('berth')"
                  name="berth_id"
                  :placeholder="$t('search')"
                  :options="berthList"
                  v-model="formGroup.berth_id"
                  required
                  @change="(berthId: number) => getJetty(berthId, 'change')"
               />
               <Select
                  :label="$t('berthing_purpose')"
                  name="purpose_id"
                  :placeholder="$t('search')"
                  :options="purposeList"
                  v-model="formGroup.purpose_id"
                  required
               />
               <Select
                  :label="$t('sub_berth')"
                  name="jetty_id"
                  :placeholder="$t('search')"
                  :options="jettyList"
                  v-model="formGroup.jetty_id"
                  required
                  :disabled="!formGroup.berth_id"
               />
            </div>
            <UDivider class="my-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
               <UFormGroup :label="$t('entry_date')" required>
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input
                        name="mooring_date"
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.mooring_date"
                        :value="formGroup.mooring_date ? format(new Date(formGroup.mooring_date), 'd MMM, yyyy, HH:mm') : ''"
                        :placeholder="$t('search')"
                        :error="isDateError('mooring_date') ? dateValidation.mooring_date.message : ''"
                        :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                     />
                     <template #panel="{ close }">
                        <Datepicker v-model="mooringDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onMooringDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>

               <UFormGroup :label="$t('vessel_departure_date')" required>
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input
                        name="departure_date"
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.departure_date"
                        :value="formGroup.departure_date ? format(new Date(formGroup.departure_date), 'd MMM, yyyy, HH:mm') : ''"
                        :placeholder="$t('search')"
                        :error="isDateError('departure_date') ? dateValidation.departure_date.message : ''"
                        :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                     />
                     <template #panel="{ close }">
                        <Datepicker
                           v-model="departureDate"
                           @close="close"
                           is-required
                           is24hr
                           type="normal"
                           mode="dateTime"
                           v-on:date-change="onDepartureDateChange"
                        />
                     </template>
                  </UPopover>
               </UFormGroup>
            </div>
         </section>
      </UForm>
      <section id="vessel-out-section2" class="border rounded-xl border-solid border-[#D0D5DD] p-8 mt-6">
         <div>
            <div class="flex flex-col sm:flex-row items-center justify-between">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("tug_boat") }}</h1>
               <UButton icon="i-heroicons-plus-circle" size="md" :label="$t('add_tug_boat')" @click="() => handleTugBoatForm(true, 'create', 'vessel-out')" />
            </div>
            <div class="overflow-x-auto mt-4">
               <UTable
                  :columns="columnsTugListTable"
                  :rows="tugList"
                  :ui="{
                     wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                     thead: 'bg-primary-50',
                     tbody: 'border-none',
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
            <div class="flex flex-col sm:flex-row items-center justify-between">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("navigate") }}</h1>
               <UButton icon="i-heroicons-plus-circle" size="md" :label="$t('add_navigation')" @click="() => handleNavigateForm(true, 'create', 'vessel-out')" />
            </div>
            <div class="overflow-x-auto mt-4">
               <UTable
                  :columns="columnsPilotListTable"
                  :rows="pilotList"
                  :ui="{
                     wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                     thead: 'bg-primary-50',
                     tbody: 'border-none',
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
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import SaveButton from "~/components/button/save.vue";

import AnchorDroppingForm from "~/components/dialog/sailing-log/anchor-dropping-form.vue";
import TugBoatForm from "~/components/dialog/sailing-log/vessel/tug-boat-form.vue";
import NagivateForm from "~/components/dialog/sailing-log/vessel/navigate-form.vue";
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

const vesselOutSchema = z.object({
   berth_id: z.number().min(1, { message: t("required") }),
   purpose_id: z.number().min(1, { message: t("required") }),
   //cargo_type_id: z.number().min(1, { message: t("required") }),
   //cargo_wharfage_id: z.number().min(1, { message: t("required") }),
   jetty_id: z.number().min(1, { message: t("required") }),
});

const props = defineProps({
   sailingLogId: {
      type: Number || String,
      default: 0,
   },
});
const vesselInId: any = route.query.vessel_in_id;

onMounted(() => {
   getDocumentDetail();
   //getVtmsLogBookDetail();
   //getVtmsDocumentBerthDetail();
   getVtmsLogBookDocumentDetail();
   getVtmsLogBookBerthDetail();
   getMasterDataList();
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
   berth_id: 0,
   purpose_id: 0,
   cargo_type_id: 0,
   cargo_wharfage_id: 0,
   jetty_id: 0,
   // departure_date: generateDateTimeOffset(),
   // mooring_date: generateDateTimeOffset(),
   departure_date: null,
   mooring_date: null,
   type_doc: "Departure",

   tugs: [],
   pilots: [],
   products: [],
});

const departureDate = ref<any>(new Date());
const mooringDate = ref<any>(new Date());

const actionMode = ref<string>("");
const vesselType = ref<string>("");
const isLoading = ref<boolean>(false);

const portList = ref<IPortGet[]>([]);
const berthList = ref<IBerthGet[]>([]);
const purposeList = ref<IPurposeGet[]>([]);
const jettyList = ref<any[]>([]);
const cargoTypeList = ref<any[]>([]);
const cargoWharfageList = ref<any[]>([]);

const itemIndexTug = ref(0);
const itemIndexPilot = ref(0);
const itemDataTug = ref();
const itemDataPilot = ref();

const tugList = ref<any>([]);
const tugListDeletedItem = ref<any>([]);

const pilotList = ref<any>([]);
const pilotListDeletedItem = ref<any>([]);

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

const getVtmsLogBookDetail = async () => {
   const res = await logBookService.getVtmsLogBookDetail(vesselInId);
   if (res.statusCode === 200) {
      formGroup.value.berth_id = res.data.details.berth_id ? res.data.details.berth_id : 0;
      formGroup.value.purpose_id = res.data.details.purpose_id ? res.data.details.purpose_id : 0;
      formGroup.value.cargo_type_id = res.data.details.cargo_type_id ? res.data.details.cargo_type_id : 0;
      formGroup.value.cargo_wharfage_id = res.data.details.cargo_wharfage_id ? res.data.details.cargo_wharfage_id : 0;
      formGroup.value.jetty_id = res.data.details.jetty_id ? res.data.details.jetty_id : 0;
      formGroup.value.mooring_date = res.data.details?.mooring_date ? res.data.details?.mooring_date : null;
      formGroup.value.departure_date = res.data.details?.departure_date ? res.data.details?.departure_date : null;
   }
};

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
   }
   isLoading.value = false;
};

const getVtmsDocumentBerthDetail = async () => {
   const resp = await logBookService.getVtmsDocumentBerthDetail(Number(route.params.vessel), Number(route.params.vesselId));
   if (resp.statusCode === 200) {
      formGroup.value.berth_id = resp.data.berthId ? resp.data.berthId : 0;
      formGroup.value.purpose_id = resp.data.purposeId ? resp.data.purposeId : 0;
      formGroup.value.cargo_type_id = resp.data.cargoTypeId ? resp.data.cargoTypeId : 0;
      formGroup.value.cargo_wharfage_id = resp.data.cargoWharfageId ? resp.data.cargoWharfageId : 0;
      formGroup.value.jetty_id = resp.data.jettyId ? resp.data.jettyId : 0;
   }
};

const getVtmsLogBookDocumentDetail = async () => {
   const resp = await logBookService.getVtmsLogBookDocumentDetail(Number(route.params.vessel));
   if (resp.statusCode === 200) {
      console.log(resp);
      formGroup.value.port_id_next = resp.data.port_id_next;
      formGroup.value.port_id_last = resp.data.port_id_last;
      formGroup.value.voyage = resp.data.voyage;
      tugList.value = resp.data.tugs ? resp.data.tugs : [];
      pilotList.value = resp.data.pilots ? resp.data.pilots : [];

      // Update Vessel Out default value 09/01/2025
      formGroup.value.berth_id = resp.data.details.berth_id ? resp.data.details.berth_id : 0;
      formGroup.value.purpose_id = resp.data.details.purpose_id ? resp.data.details.purpose_id : 0;
      formGroup.value.cargo_type_id = resp.data.details.cargo_type_id ? resp.data.details.cargo_type_id : 0;
      formGroup.value.cargo_wharfage_id = resp.data.details.cargo_wharfage_id ? resp.data.details.cargo_wharfage_id : 0;
      formGroup.value.jetty_id = resp.data.details.jetty_id ? resp.data.details.jetty_id : 0;

      formGroup.value.mooring_date = resp.data.details?.mooring_date ? resp.data.details.mooring_date : null;
      formGroup.value.departure_date = resp.data.details?.departure_date ? resp.data.details.departure_date : null;
      mooringDate.value = resp.data.details?.mooring_date ? new Date(resp.data.details.mooring_date) : new Date();
      departureDate.value = resp.data.details?.departure_date ? new Date(resp.data.details.departure_date) : new Date();
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

      getJetty(formGroup.value?.berth_id);
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

const getJetty = async (berthId: number, type: string = "fetch") => {
   const res = await getBerthDetail(berthId);
   if (res.statusCode === 200) {
      if (type === "change") {
         formGroup.value.jetty_id = 0;
      }
      jettyList.value = res.data.jettys;
   }
};

const handleFormError = (error: ZodError): void => {
   allDatePristine();
};
async function onSubmit(event: FormSubmitEvent<z.output<typeof vesselOutSchema>>) {
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
   const tugPayload = [...tugList.value, ...tugListDeletedItem.value].map(({ id, is_delete, tug_id }) => ({ id, is_delete, tug_id }));
   const pilotPayload = [...pilotList.value, ...pilotListDeletedItem.value].map(({ id, is_delete, pilot_id }) => ({ id, is_delete, pilot_id }));
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
            berth_id: formGroup.value.berth_id,
            purpose_id: formGroup.value.purpose_id,
            cargo_type_id: formGroup.value.cargo_type_id,
            cargo_wharfage_id: formGroup.value.cargo_wharfage_id,
            jetty_id: formGroup.value.jetty_id,
            departure_date: convertTimezone(new Date(formGroup.value.departure_date), 7, false),
            mooring_date: convertTimezone(new Date(formGroup.value.mooring_date), 7, false),
            type_doc: "Departure",
         },
      ],
      tugs: tugPayload,
      pilots: pilotPayload,
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

const addTug = (tugs: any[]) => {
   tugs.forEach((tug: any) => {
      const body = {
         id: 0,
         tug_id: tug.tug_id,
         tug_name: tug.name,
         tug_type: tug.type,
         status: "Vessel Out",
         is_delete: false,
      };
      tugList.value.push(body);
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
   tugList.value.splice(index, 1);
   if (tug.id !== 0) {
      tugListDeletedItem.value.push({ ...tug, is_delete: true });
   }
};

const addPilot = (pilots: any) => {
   pilots.forEach((pilot: any) => {
      const body = {
         id: 0,
         pilot_id: pilot.pilot_id,
         pilot_number: pilot.number,
         pilot_name: pilot.name,
         pilot_tel: pilot.tel,
         status: "Vessel Out",
         is_delete: false,
      };
      pilotList.value.push(body);
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
   pilotList.value.splice(index, 1);
   if (pilot.id !== 0) {
      pilotListDeletedItem.value.push({ ...pilot, is_delete: true });
   }
};

["mooring_date", "departure_date"].forEach((key) => {
   watch(
      () => formGroup.value[key],
      () => {
         dateValidation.value[key].pristine = true;
      }
   );
});

const dateValidation = ref<DateValidationAnchorDroppingForm>({
   mooring_date: { message: t("required"), pristine: false },
   departure_date: { message: t("required"), pristine: false },
});
const allDatePristine = (pristineValue: boolean = true) => {
   dateValidation.value = Object.keys(dateValidation.value).reduce((acc: DateValidationAnchorDroppingForm, key) => {
      acc[key] = { ...dateValidation.value[key], pristine: pristineValue };
      return acc;
   }, {});
};
const isDateError = (field: string) => {
   const value = formGroup.value[field];
   const pristine = dateValidation.value[field].pristine;
   if (!value && pristine) {
      dateValidation.value[field].message = t("required");
      return true;
   }
   if (field === "departure_date" && value && new Date(value) < new Date(formGroup.value.mooring_date)) {
      dateValidation.value[field].message = t("departure_day_or_time_gte");
      return true;
   }
   return false;
};
const isFormGroupValid = ({
   cargo_type_id,
   cargo_wharfage_id,
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
   mooring_date,
   departure_date,
   ...fieldsToCheck
}: IFormGroupValid) => Object.values(fieldsToCheck).every((value) => value) && mooring_date && departure_date && new Date(departure_date) >= new Date(mooring_date);

const onMooringDateChange = (newDate: any) => {
   formGroup.value.mooring_date = newDate ? new Date(newDate).toISOString() : "";
};
const onDepartureDateChange = (newDate: any) => {
   formGroup.value.departure_date = newDate ? new Date(newDate).toISOString() : "";
};

const getLastSegmentFromURL = (url: string) => {
   const segments = url.split("/");
   return segments.pop();
};
</script>
