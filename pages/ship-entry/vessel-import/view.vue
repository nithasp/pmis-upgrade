<template>
   <h1 class="font-anuphan-semi-bold text-2xl md:text-[30px] text-black py-4">
     {{ $t("vessel_import_list") }}
   </h1>
   <div id="vessel-import-view" class="bg-white p-6">
     <header class="flex flex-col md:flex-row items-center justify-between">
       <div>
         <div class="flex gap-4 flex-wrap">
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
             {{ $t("vessel_import_data") }}
           </h1>
           <Badge 
             :label="formGroup.statusDes" 
             :type="formGroup.status === 'PendingSend'
                       ? 'warning'
                       : formGroup.status === 'PendingEdit'
                          ? 'error'
                          : formGroup.status === 'Send'
                             ? 'success'
                             : formGroup.status === 'RequestEdit'
                                ? 'white-gray'
                                : ''
                   " 
           />
         </div>
         <p class="mt-1 text-[#667085] text-sm">
           {{ $t("vessel_import_specify_details") }}
         </p>
       </div>
       <div class="flex gap-3 mt-4 md:mt-0">
         <UButton 
           class="mx-2 border border-grayy-100 w-[46px] h-[36px] justify-center" 
           size="md" 
           color="gray"
           :label="$t('close')" 
           @click="$router.push('/ship-entry/vessel-import')" 
         />
         <UButton 
           v-if="formGroup.status === 'Send'" 
           class="bg-purple-25 text-primaryy-500 hover:bg-purple-25 [&_span]:font-anuphan-semi-bold w-auto h-10" 
           outlined 
           size="md" 
           @click="isDialogVesselImportEditFormOpen = true"
         >
           <template #default>
             <div class="flex gap-2 w-full justify-center">
               <img :src="RedoAltIcon" alt="redo-alt-icon" class="w-5 h-5" />
               <span>{{ $t("request_edit") }}</span>
             </div>
           </template>
         </UButton>
       </div>
     </header>
 
     <div v-if="formGroup.notes.length" class="notes mt-5">
       <p 
         v-for="(note, indexMenu) in formGroup.notes" 
         :key="`note-${indexMenu}`" 
         class="mb-2 text-error-500"
       >
         {{ note.note }}
       </p>
     </div>
 
     <UDivider class="m-[22px_0_24px_0]" />

     <section id="request-form-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-8">
       <div class="ship-info-title">
         <h2 class="font-anuphan-semi-bold text-base text-gray-400">
           {{ $t("ship_info") }}
         </h2>
       </div>
       <div class="ship-info-content mt-4">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4">
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">
               {{ $t("ship_name") }}
             </h3>
             <div class="text-grayy-75">
               {{ formGroup.vesselName || "-" }}
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">
               {{ $t("ship_type") }}
             </h3>
             <div class="text-grayy-75">
               {{ formGroup.vesselTypeName || "-" }}
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">
               {{ $t("ship_registration_number") }}
             </h3>
             <div class="text-grayy-75">
               {{ formGroup.officialNumber || "-" }}
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">
               {{ $t("imo_number") }}
             </h3>
             <div class="text-grayy-75">
               {{ formGroup.imoNumber || "-" }}
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">
               {{ $t("ship_nationality_flag") }}
             </h3>
             <div class="text-grayy-75 flex gap-2 mt-1">
               <img 
                 :src="formGroup.vesselFlagImage" 
                 :alt="formGroup.vesselFlagName"
                 class="w-6 h-6 rounded-full" 
               />
               <span>
                 {{ formGroup.vesselFlagName || "-" }}
               </span>
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">
               {{ $t("gross_tonnage_title") }}
             </h3>
             <div class="text-grayy-75">
               <span v-if="formGroup.grossTonnage">
                 {{ formGroup.grossTonnage }} t
               </span>
               <span v-else>-</span>
             </div>
           </div>
         </div>
 
         <UDivider class="my-4" />

         <div>
           <h2 class="font-anuphan-semi-bold text-base text-gray-400 mb-4">
             {{ $t("port_info") }}
           </h2>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4">
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">
                 {{ $t("port") }}
               </h3>
               <div class="text-grayy-75">
                 {{ formGroup.berthName || "-" }}
               </div>
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">
                 {{ $t("jetty") }}
               </h3>
               <div class="text-grayy-75">
                 {{ formGroup.jettyName || "-" }}
               </div>
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">
                 {{ $t("vessel_date_and_time_mooring") }}
               </h3>
               <div class="text-grayy-75">
                 {{ formatISOToCustomDate(formGroup.mooringDate, true) || "-" }}
               </div>
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">
                 {{ $t("vessel_date_and_time_departure") }}
               </h3>
               <div class="text-grayy-75">
                 {{ formatISOToCustomDate(formGroup.unmooringDate, true) || "-" }}
               </div>
             </div>
           </div>
         </div>
 
         <UDivider class="my-4" />

         <div id="product-list">
           <div class="flex flex-col sm:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
              {{ $t("cargo_list") }}
             </h1>
           </div>
           <UTable 
             :rows="formGroup.products" 
             :columns="[
               { key: 'id', label: $t('id'), class: 'min-w-[65px] text-center' },
               { key: 'purposeTypeName', label: $t('purpose') },
               { key: 'cargoTypeId', label: $t('berth_position') },
               { key: 'cargoWharfageId', label: $t('cargo_wharfage') },
               { key: 'productName', label: $t('product_name') },
               { key: 'productGroupName', label: $t('product_group') },
               { key: 'productTypeName', label: $t('product_kind') },
               { key: 'mTonQty', label: $t('mt') },
               { key: 'rTonQty', label: $t('rt') },
               { key: 'blProduct', label: $t('B/L') },
               { key: 'cargoOwnerName', label: $t('cargo_owner') },
               { key: 'countryId', label: t('ประเทศต้นทาง/ปลายทาง') }
             ]" 
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template
               v-for="key in ['purposeTypeId', 'cargoTypeId', 'cargoWharfageId', 'productGroupId', 'productTypeId', 'countryId']"
               #[`${key}-data`]="{ row }"
             >
               <div>{{ renderOption(key, row[key]) }}</div>
             </template>
           </UTable>
         </div>
 
         <UDivider class="my-4" />

         <section id="passanger-table" class="mt-6">
           <div class="flex flex-col sm:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("รายการผู้โดยสาร") }}
             </h1>
           </div>
           <UTable 
             :columns="[
               { key: 'id', label: t('order'), class: 'w-[60px] text-center' },
               { key: 'purposeTypeId', label: t('วัตถุประสงค์') },
               { key: 'detail', label: t('รายละเอียด') },
               { key: 'passengers', label: t('จำนวนผู้โดยสาร') },
               { key: 'actions', sortable: false }
             ]" 
             :rows="passengerList" 
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #purposeTypeId-data="{ row }">
               <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
             </template>
           </UTable>
         </section>
 
         <UDivider class="my-4" />
 
         <section id="sparepart-table" class="mt-6">
           <div class="flex flex-col sm:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("รายการ Spare Part") }}
             </h1>
           </div>
           <UTable 
             :columns="[
               { key: 'id', label: t('order'), class: 'w-[60px] text-center' },
               { key: 'purposeTypeId', label: t('วัตถุประสงค์') },
               { key: 'detail', label: t('รายละเอียด') },
               { key: 'actions', sortable: false }
             ]" 
             :rows="sparePartList" 
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #purposeTypeId-data="{ row }">
               <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
             </template>
           </UTable>
         </section>
 
         <UDivider class="my-4" />

         <section id="other-table" class="mt-6">
           <div class="flex flex-col sm:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("รายการอื่นๆ") }}
             </h1>
           </div>
           <UTable 
             :columns="[
               { key: 'id', label: t('order'), class: 'w-[60px] text-center' },
               { key: 'purposeTypeId', label: t('วัตถุประสงค์') },
               { key: 'detail', label: t('รายละเอียด') },
               { key: 'actions', sortable: false }
             ]" 
             :rows="otherList" 
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #purposeTypeId-data="{ row }">
               <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
             </template>
           </UTable>
         </section>
 
         <UDivider class="my-4" />

         <div class="mb-4">
           <h2 class="font-bold text-grayy-400">เอกสารแนบ</h2>
         </div>
         <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <template v-for="fileType in fileTypes" :key="fileType.key">
             <div v-if="fileType.isDisplay" :class="`file-info w-full min-h-[36px] rounded ${false ? 'border-red-500' : ''}`">
               <div class="font-anuphan-medium mb-1 text-sm">{{ fileType.name }}</div>
               <div v-if="formGroup[fileType.key] && formGroup[fileType.key].id !== 0"
                    class="mr-2 bg-white p-3 border rounded-xl border-solid border-[#E7E7E7] w-full">
                 <div class="flex items-center">
                   <NuxtIcon name="document" size="3xl" />
                   <div>
                     <a :href="formGroup[fileType.key]?.filePath" target="_blank"
                        class="pl-2 pr-1 rounded text-grayy-400 text-sm">
                       {{ formGroup[fileType.key]?.fileName }}
                     </a>
                     <div class="text-grayy-75 text-sm ml-2">
                       {{ formatFileSize(formGroup[fileType.key].size) }}
                     </div>
                   </div>
                 </div>
               </div>
               <p v-else>-</p>
             </div>
           </template>
         </div>
       </div>
     </section>
   </div>
 
   <VesselImportEditForm 
     :isDialogOpen="isDialogVesselImportEditFormOpen" 
     :dialogCancel="dialogVesselImportEditCancel"
     :dialogConfirm="dialogVesselImportEditConfirm" 
     :itemData="formGroup" 
   />
   <Loading v-if="isLoading" />
 </template>
 

<script setup lang="ts">
import Select from "~/components/form/u-select.vue";
import Badge from "~/components/badge/badge.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import Loading from "~/components/loading.vue";
import RedoAltIcon from "~/assets/icons/fi-rs-redo-alt.svg";
import VesselImportEditForm from "~/components/dialog/ship-table/vessel-import/vessel-import-edit-form.vue";

const addressOptionsStore = useAddressOptionsStore();
const documentOptionsStore = useDocumentOptionsStore();
import useVesselImportService from "~/core/services/vesselImport";
const vesselImportService = useVesselImportService();

const { t } = useI18n();
const route = useRoute();
const query: any = route.query;
const vesselImportId = ref(query.id);
const isLoading = ref<boolean>(false);
const passengerList = ref<any>([]);
const sparePartList = ref<any[]>([]);
const otherList = ref<any[]>([]);
const deletedFiles = ref([]);
const formGroup = ref<any>({
   id: 0,
   vesselName: "",
   imoNumber: "",
   officialNumber: "",
   vesselFlagId: 0,
   vesselFlagName: "",
   vesselFlagImage: "",
   vesselTypeId: 0,
   vesselTypeName: "",
   grossTonnage: 0,
   mooringDate: null,
   unmooringDate: null,
   berthId: 0,
   berthName: "",
   jettyId: 0,
   jettyName: "",
   note: "",
   notes: [],
   status: "",
   statusDes: "",
   files: [],
   products: [],
   logBook: {
      id: 0,
      status: "",
      voyage: "",
      gross_tonnage: 0,
      depth: 0,
      port_id_next: 0,
      port_name_next: "",
      port_id_last: 0,
      port_name_last: "",
      document_berth_id: null,
      document_number: "",
      vessel: {
         id: 0,
         owner: "",
         vessel_flag: {
            id: 0,
            name: "",
            image_path: "",
         },
         name: "",
         vessel_type: "",
         imo_number: "",
         mmsi_number: "",
         official_number: "",
         call_sign: "",
         license_expired_date: null,
         load_weight: 0,
         gross_tonnage: 0,
         net_tonnage: 0,
         length_overall: 0,
         breadth_extreme: 0,
         depth: 0,
         main_engine: "",
         band_and_model: "",
      },
      details: {
         berth_id: 0,
         berth_name: "",
         purpose_id: 0,
         purpose_name: "",
         cargo_type_id: 0,
         cargo_type_name: "",
         cargo_wharfage_id: 0,
         cargo_wharfage_name: "",
         jetty_id: 0,
         jetty_name: "",
         mooring_date: null,
         departure_date: null,
      },
      create_date: null,
      tugs: null,
      pilots: null,
      products: null,
      agency_name: "",
   },

   statementFile: null,
   shipFile: null,
   cargoManifestFile: null,
   surveyorFile: null,
   certificateQuantityFile: null,
   berthBookingRequestFile: null,
   otherFile: null,
});
const authStore = useAuthStore();
const isDocumentBerthOfficer = authStore.profileUser?.roleType === "DocumentBerthOfficer";
const isDocumentBerthOfficerMIT = authStore.profileUser?.roleType === "DocumentBerthOfficerMIT";
const isDocumentBerthOfficerTCT = authStore.profileUser?.roleType === "DocumentBerthOfficerTCT";
const isDocumentBerthOfficerTTT = authStore.profileUser?.roleType === "DocumentBerthOfficerTTT";

onMounted(() => {
   getVesselImportDetail();
   getMasterData();
});

const getMasterData = () => {
   documentOptionsStore.getPurposeTypeOptions();
   documentOptionsStore.getCargoTypesOptions();
   documentOptionsStore.getCargoWharfageOptions();
   documentOptionsStore.getProductGroupOptions();
   documentOptionsStore.getProductTypesOptions();
   documentOptionsStore.getProductOptions();
   addressOptionsStore.getCountriesOptions();
};

const getVesselImportDetail = async () => {
   isLoading.value = true;
   const resp = await vesselImportService.getVesselImportDetail(vesselImportId.value);
   if (resp.statusCode === 200) {
      formGroup.value = resp.data;
      passengerList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Passenger")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Passenger")[0].details
         : [];

      sparePartList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Spare Part")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Spare Part")[0].details
         : [];

      otherList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Other")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Other")[0]
         : [];

      formGroup.value.products = resp.data.products.filter((p: any) => !["Passenger", "Spare Part", "Other"].includes(p.purposeTypeName))[0]
         ? resp.data.products
            .filter((p: any) => !["Passenger", "Spare Part", "Other"].includes(p.purposeTypeName))
            .map((item: any) => ({
               ...item,
               mTonQty: getInputDecimal(item.details?.[0]?.mTonQty?.toString(), 3),
               rTonQty: getInputDecimal(item.details?.[0]?.rTonQty?.toString(), 3),
            }))[0].details
         : [];
   }
   isLoading.value = false;
};

const renderOption = (type: any, id: number) => {
   const optionsMap: any = {
      purposeTypeId: documentOptionsStore.purposeTypeOptions,
      cargoTypeId: documentOptionsStore.cargoTypesOptions,
      cargoWharfageId: documentOptionsStore.cargoWharfageOptions,
      productId: documentOptionsStore.productsOptions,
      productGroupId: documentOptionsStore.productGroupOptions,
      productTypeId: documentOptionsStore.productTypesOptions,
      countryId: addressOptionsStore.countriesOption
   };
   const findData = optionsMap[type]?.find((e: any) => e.id === id);
   return findData ? findData.name : "-";
};

const isDialogVesselImportEditFormOpen = ref(false);
const handleVesselImportEditForm = (status: boolean) => {
   isDialogVesselImportEditFormOpen.value = status;
};
const dialogVesselImportEditCancel = () => {
   isDialogVesselImportEditFormOpen.value = false;
};
const dialogVesselImportEditConfirm = (status: boolean, type: string = "") => {
   isDialogVesselImportEditFormOpen.value = status;
   if (type === "refresh") {
      getVesselImportDetail();
   }
};

const fileTypes = ref([
   { key: "statementFile", name: "Statement/BL&Timesheet", isDisplay: true },
   { key: "shipFile", name: "Ship’s Particular", isDisplay: true },
   { key: "cargoManifestFile", name: "Cargo Manifest", isDisplay: isDocumentBerthOfficerTCT || isDocumentBerthOfficerMIT ? true : false },
   { key: "surveyorFile", name: "Surveyor/Invoice", isDisplay: !isDocumentBerthOfficerTCT || !isDocumentBerthOfficerMIT ? true : false },
   { key: "certificateQuantityFile", name: "Certificate of Quantity (CoQ)", isDisplay: isDocumentBerthOfficerTTT ? true : false },
   { key: "berthBookingRequestFile", name: "ใบขอจองท่าเรือ", isDisplay: isDocumentBerthOfficerTCT || isDocumentBerthOfficerMIT ? true : false },
   { key: "otherFile", name: " เอกสารอื่นๆ", isDisplay: true },
]);
</script>
