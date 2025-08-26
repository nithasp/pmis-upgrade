<template>
   <div id="request-form" class="bg-white p-4 md:p-6">
     <header class="flex flex-col md:flex-row items-center justify-between">
       <div>
         <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("request_form") }}</h1>
         <div class="mt-1 text-[#667085] text-sm">{{ $t("request_form_details") }}</div>
       </div>
       <div class="flex mt-4 md:mt-0">
         <UButton
           class="mx-2 border border-grayy-100 w-[46px] h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('close')"
           @click="$router.push('/vtms/sailing-log')"
         />
         <UButton
           v-if="formGroupRequest.vesselStatus === 'Berth'"
           class="bg-purple-25 text-primaryy-500 hover:bg-purple-25 [&_span]:font-anuphan-semi-bold w-auto h-auto"
           outlined
           size="md"
           @click="handleRequestFormEditForm(true)"
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
 
     <UDivider class="my-6" />
 
     <!-- Section 1: Ship Information and Documents -->
     <section id="request-form-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-6">
       <div class="ship-info-title">
         <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("ship_info") }}</h2>
       </div>
       <div class="ship-info-content mt-4">
         <!-- Grid for basic ship details -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("request_number") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.docNumber || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("request_date") }}</h3>
             <div class="text-grayy-75">{{ formatISOToCustomDate(formGroupRequest.requestDate, true) || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_owner") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselOwner || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_nationality_flag") }}</h3>
             <div class="text-grayy-75 flex gap-2 mt-1">
               <img :src="vesselFlagData?.path" :alt="vesselFlagData?.name" class="w-6 h-6 rounded-full" />
               <span>{{ vesselFlagData?.name || "-" }}</span>
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_name") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselName || "-" }}</div>
           </div>
           <div>
             <Select
               is-view
               :label="$t('ship_type')"
               name="vesselTypeId"
               v-model="formGroupRequest.vessel.vesselTypeId"
               :options="vesselOptionsStore.vesselTypeOption"
             />
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("imo_number") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselImoNumber || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("mmsi_number") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselMMSiNumber || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_registration_number") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselOfficialNumber || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_call_sign") }}</h3>
             <div class="text-grayy-75">
               {{ formGroupRequest.vessel.vesselCallSign || "-" }}
             </div>
           </div>
           <div v-if="formGroupRequest.vessel.vesselFlagId === 218">
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_registration_expiry") }}</h3>
             <div class="flex gap-1">
               <span class="text-grayy-75">{{ formatISOToCustomDate(formGroupRequest.vessel.vesselLicenseExpiredDate) || "-" }}</span>
               <span v-if="compareDateWithToday(formGroupRequest.vessel.vesselLicenseExpiredDate, true) === 'behind'" class="text-error-500">
                 ({{ $t("registration_expired") }})
               </span>
             </div>
           </div>
         </div>
 
         <UDivider class="my-4" />
 
         <!-- Grid for additional ship measurements -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("cargo_weight") }}</h3>
             <div class="text-grayy-75">{{ getInputDecimal(formGroupRequest.vessel.vesselLoadWeight?.toString(), 2) }} t</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("gross_tonnage") }}</h3>
             <div class="text-grayy-75">{{ getInputDecimal(formGroupRequest.vessel.vesselGrossTonnage?.toString(), 3) }} t</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("net_tonnage") }}</h3>
             <div class="text-grayy-75">{{ getInputDecimal(formGroupRequest.vessel.vesselNetTonnage?.toString(), 2) }} t</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_length") }}</h3>
             <div class="text-grayy-75">{{ getInputDecimal(formGroupRequest.vessel.vesselLengthOverall?.toString(), 2) }} m</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_width") }}</h3>
             <div class="text-grayy-75">{{ getInputDecimal(formGroupRequest.vessel.vesselBreadthExtreme?.toString(), 2) }} m</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_draft") }}</h3>
             <div class="text-grayy-75">{{ getInputDecimal(formGroupRequest.vessel.vesselDepth?.toString(), 2) }} m</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("main_engine") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselMainEngine || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("engine_brand_model") }}</h3>
             <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselBandAndModel || "-" }}</div>
           </div>
         </div>
 
         <UDivider class="my-4" />
 
         <!-- Attached Documents -->
         <div>
           <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("attached_documents") }}</h2>
           <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4" v-if="formGroupRequest.vessel.vesselUploadFiles.length">
             <div
               v-for="(file, index) in formGroupRequest.vessel.vesselUploadFiles"
               :key="index"
               class="flex gap-2 p-4 items-center border rounded-xl border-solid border-[#E7E7E7]"
             >
               <div>
                 <NuxtIcon name="document" size="3xl" />
               </div>
               <div>
                 <a :href="file.preview ? file.preview : file.filePath" target="_blank" class="text-grayy-400 text-sm filename">
                   {{ file.fileName }}
                 </a>
                 <div class="text-grayy-75 text-sm">{{ formatFileSize(file.size) }}</div>
               </div>
             </div>
           </div>
           <p v-else>{{ $t("no_document") }}</p>
         </div>
       </div>
     </section>
 
     <!-- Section 2: Estimated Entry and Exit Times -->
     <section id="request-form-section2" class="border rounded-xl border-solid border-[#D0D5DD] p-6 mt-5">
       <div class="est-time-title">
         <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("estimated_entry_exit_time") }}</h2>
       </div>
       <div class="est-time-content mt-4">
         <!-- Grid for entry/exit dates -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("estimated_entry_date") }}</h3>
             <div class="text-grayy-75">
               {{ formatISOToCustomDate(formGroupRequest.estimatedArrival, true) || "-" }}
             </div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("estimated_exit_date") }}</h3>
             <div class="text-grayy-75">
               {{ formatISOToCustomDate(formGroupRequest.estimatedDeparture, true) || "-" }}
             </div>
           </div>
         </div>
 
         <UDivider class="my-6" />
 
         <!-- Loop through each berth -->
         <div :id="`harbour-${index}`" v-for="(berth, index) in formGroupRequest.berths" :key="index">
           <h2 class="font-anuphan-semi-bold text-base text-gray-400 mb-6">
             {{ $t("docking_vessel") }} {{ index + 1 }}
           </h2>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <Select
                 :label="$t('docking_vessel')"
                 :placeholder="$t('docking_vessel')"
                 is-view
                 :options="documentOptionsStore.berthsOption"
                 v-model="berth.berthId"
               />
             </div>
             <div>
               <Select
                 :label="$t('purpose_of_docking')"
                 :placeholder="$t('purpose_of_docking')"
                 name="purposeDocking"
                 is-view
                 :options="documentOptionsStore.purposesOptions"
                 v-model="berth.purposeId"
               />
             </div>
             <div>
               <Select
                 :label="$t('cargo_type')"
                 :placeholder="$t('cargo_type')"
                 is-view
                 :options="documentOptionsStore.cargoTypesOptions"
                 v-model="berth.cargoTypeId"
               />
             </div>
             <div>
               <Select
                 :label="$t('cargo_wharfage')"
                 :placeholder="$t('cargo_wharfage')"
                 name="cargoWharfageId"
                 is-view
                 v-model="berth.cargoWharfageId"
                 :options="documentOptionsStore.cargoWharfageOptions"
               />
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("estimated_entry_date") }}</h3>
               <div class="text-grayy-75">
                 {{ formatISOToCustomDate(berth.estimatedArrival, true) || "-" }}
               </div>
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("estimated_exit_date") }}</h3>
               <div class="text-grayy-75">
                 {{ formatISOToCustomDate(berth.estimatedDeparture, true) || "-" }}
               </div>
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("details") }}</h3>
               <div class="text-grayy-75">{{ berth.note || "-" }}</div>
             </div>
           </div>
 
           <UDivider v-if="berth.products.length" class="my-4" />
 
           <!-- Cargo List -->
           <div v-if="berth.products.length" id="cargo-list">
             <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("cargo_list") }}</h2>
             <UTable
               :columns="[
                 { key: 'id', label: $t('id'), class: 'min-w-[65px] text-center' },
                 { key: 'productTypeId', label: $t('product_type') },
                 { key: 'productGroupId', label: $t('product_kind') },
                 { key: 'amount', label: $t('quantity') },
                 { key: 'packageAmount', label: $t('package') },
                 { key: 'receiver', label: $t('receiver') },
               ]"
               :rows="berth.products"
               :ui="{
                 wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                 thead: 'bg-primary-50',
                 tbody: 'border-none',
               }"
             >
               <template #id-data="{ index }">
                 <div class="text-center">
                   {{ index + 1 }}
                 </div>
               </template>
               <template #productTypeId-data="{ row }">
                 <div>
                   {{ renderProductType(row.productTypeId) }}
                 </div>
               </template>
               <template #productGroupId-data="{ row }">
                 <div>
                   {{ renderProductGroup(row.productGroupId) }}
                 </div>
               </template>
               <template #amount-data="{ row }">
                 <p class="text-grayy-600">{{ row.mTonQty }} M/Ton</p>
                 <p class="text-grayy-600">{{ row.rTonQty }} R/Ton</p>
               </template>
             </UTable>
 
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
               <div>
                 <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("total_mt_cargo") }}</h3>
                 <div class="text-grayy-75">{{ totalMTonQty(berth.products) }} M/Ton</div>
               </div>
               <div>
                 <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("total_rt_cargo") }}</h3>
                 <div class="text-grayy-75">{{ totalRTonQty(berth.products) }} R/Ton</div>
               </div>
             </div>
           </div>
 
           <!-- Attached Documents for Each Berth -->
           <div id="documents-container">
             <div
               id="attached-documents"
               class="mt-6"
               v-if="berth.files.filter((i: any) => i.document_file_type === 'other').length"
             >
               <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("attached_documents") }}</h2>
               <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                 <div
                   v-for="(fileOther, fileOtherIndex) in berth.files.filter((i: any) => i.document_file_type === 'other')"
                   :key="fileOtherIndex"
                   class="flex gap-2 p-4 items-center border rounded-xl border-solid border-[#E7E7E7]"
                 >
                   <div>
                     <NuxtIcon name="document" size="3xl" />
                   </div>
                   <div>
                     <a
                       :href="fileOther.preview ? fileOther.preview : fileOther.filePath"
                       target="_blank"
                       class="text-grayy-400 text-sm filename"
                     >
                       {{ fileOther.fileName }}
                     </a>
                     <div class="text-grayy-75 text-sm">{{ formatFileSize(fileOther.size) }}</div>
                   </div>
                 </div>
               </div>
             </div>
 
             <div
               id="attached-documents-manifest"
               class="mt-6"
               v-if="berth.files.filter((i: any) => i.document_file_type === 'manifest').length"
             >
               <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("attached_documents_cargo_manifest") }}</h2>
               <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                 <div
                   v-for="(fileManifest, fileManifestIndex) in berth.files.filter((i: any) => i.document_file_type === 'manifest')"
                   :key="fileManifestIndex"
                   class="flex gap-2 p-4 items-center border rounded-xl border-solid border-[#E7E7E7]"
                 >
                   <NuxtIcon name="document" size="3xl" />
                   <div>
                     <a
                       :href="fileManifest.preview ? fileManifest.preview : fileManifest.filePath"
                       target="_blank"
                       class="text-grayy-400 text-sm filename"
                     >
                       {{ fileManifest.fileName }}
                     </a>
                     <div class="text-grayy-75 text-sm">{{ formatFileSize(fileManifest.size) }}</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
 
           <UDivider v-if="berth.products.length" class="my-6" />
         </div>
       </div>
     </section>
 
     <RequestFormEdit 
       :isDialogOpen="isDialogRequestFormEditFormOpen" 
       :dialogCancel="dialogRequestFormEditCancel" 
       :dialogConfirm="dialogRequestFormEditConfirm" 
       :documentId="props.documentId"
     />
     <Loading v-if="isLoading" />
   </div>
 </template>
 

<script setup lang="ts">
import Select from "~/components/form/u-select.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import Loading from "~/components/loading.vue";
import RedoAltIcon from "~/assets/icons/fi-rs-redo-alt.svg";
import RequestFormEdit from "~/components/dialog/sailing-log/request-form-edit.vue";
import useDocumentService from "~/core/services/documentService";
import useMasterDataShipService from "~/core/services/masterDataShipService/vesselService";
const documentService = useDocumentService();
const masterDataShipService = useMasterDataShipService();
const documentOptionsStore = useDocumentOptionsStore();
const vesselOptionsStore = useVesselOptionsStore();

import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();

const props = defineProps({
   documentId: Number || String,
});

const isLoading = ref<boolean>(false);
const formGroupRequest = ref<any>({
   id: 0,
   requestDate: "",
   status: "",
   statusDescription: "",
   rejectedNote: "",
   vessel: {
      vesselFlagId: 0,
      vesselTypeId: 0,
      id: 0,
      vesselId: 0,
      vesselOwner: "",
      vesselName: "",
      vesselImoNumber: "",
      vesselMMSiNumber: "",
      vesselDSVNumber: "",
      vesselOfficialNumber: "",
      vesselCallSign: "",
      vesselNationality: "",
      vesselCountry: "",
      vesselLoadWeight: 0,
      vesselGrossTonnage: 0,
      vesselNetTonnage: 0,
      vesselLengthOverall: 0,
      vesselBreadthExtreme: 0,
      vesselDepth: 0,
      vesselMainEngine: "",
      vesselBandAndModel: "",
      vesselLicenseExpiredDate: "",
      vesselUploadFiles: [],
   },
   berths: [],
   invoice: {
      id: 0,
      customerId: 0,
      documentId: 0,
      name: "",
      taxId: "",
      contactName: "",
      paymentMethodId: 0,
      paymentTermId: 0,
      countryId: 0,
      subDistrictId: null,
      districtId: null,
      provinceId: 0,
      postCode: "",
      stageProvince: "",
      address: "",
   },
   vesselStatus: "",
   vesselDocuments: [],
   estimatedArrival: null,
   estimatedDeparture: null,
   docNumber: "",
});

const vesselFlagData = ref({
   path: "",
   name: "",
});

onMounted(async () => {
   getDocumentDetail();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getPurposesOptions();
   documentOptionsStore.getCargoTypesOptions();
   documentOptionsStore.getCargoWharfageOptions();
   documentOptionsStore.getProductTypesOptions();
   documentOptionsStore.getProductGroupOptions();
   await vesselOptionsStore.getVesselTypeOption();

   console.log(compareDateWithToday("2024-08-02T21:40:04.296+07:00", true));
});

const getDocumentDetail = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentDetail(props.documentId!);
   if (resp.statusCode === 200) {
      formGroupRequest.value = resp.data;
      const vesselFlagDetail = await masterDataShipService.getVesselFlagsOption();
      const vesselFlagId = formGroupRequest.value.vessel.vesselFlagId;
      vesselFlagData.value = vesselFlagDetail.data.find((i: any) => i.id === vesselFlagId);
      vtmsStore.setVtmsDocumentStatus(resp.data.status);
      vtmsStore.getVtmsTab();
   }
   isLoading.value = false;
};

const renderProductType = (id: number) => {
   const findData: any = documentOptionsStore.productTypesOptions.find((e: any) => e.id === id);
   if (findData) {
      return findData.name;
   }
   return "-";
};

const renderProductGroup = (id: number) => {
   const findData: any = documentOptionsStore.productGroupOptions.find((e: any) => e.id === id);
   if (findData) {
      return findData.name;
   }
   return "-";
};

const totalMTonQty = (product: any) => {
   return product?.reduce((acc: number, item: any) => (acc += item.mTonQty), 0);
};

const totalRTonQty = (product: any) => {
   return product?.reduce((acc: number, item: any) => (acc += item.rTonQty), 0);
};

const isDialogRequestFormEditFormOpen = ref(false);
const handleRequestFormEditForm = (status: boolean) => {
   isDialogRequestFormEditFormOpen.value = status;
};
const dialogRequestFormEditCancel = () => {
   isDialogRequestFormEditFormOpen.value = false;
};
const dialogRequestFormEditConfirm = (status: boolean, type: string = "") => {
   isDialogRequestFormEditFormOpen.value = status;
   if (type === "refresh") {
      navigateTo("/vtms/sailing-log");
   }
};
</script>

<style lang="scss" scoped>
.filename {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;

   @media (min-width: 1280px) {
      max-width: 10vw;
   }
}
</style>
