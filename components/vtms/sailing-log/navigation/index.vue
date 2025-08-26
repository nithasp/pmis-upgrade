<template>
   <div id="navigation" class="bg-white p-4 md:p-6">
      <header class="flex flex-col md:flex-row items-center justify-between">
         <div>
            <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("navigation") }}</h1>
            <div class="mt-1 text-[#667085] text-sm">{{ $t("navigation_details") }}</div>
         </div>
         <UButton
            class="mx-2 border border-grayy-100 w-[46px] h-[36px] justify-center mt-2 md:mt-0"
            size="md"
            color="gray"
            :label="$t('close')"
            @click="$router.push('/vtms/sailing-log')"
         />
      </header>

      <UDivider class="my-6" />

      <section id="request-form-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-6">
         <div class="ship-info-title">
            <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("ship_info") }}</h2>
         </div>
         <div class="ship-info-content mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4">
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("request_number") }}</h3>
                  <div class="text-grayy-75">{{ formGroupRequest.docNumber || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_name") }}</h3>
                  <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselName || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_nationality_flag") }}</h3>
                  <div class="text-grayy-75 flex gap-2 mt-1">
                     <img :src="vesselFlagData?.path" :alt="vesselFlagData?.name" class="w-6 h-6 rounded-full" />
                     <span>{{ vesselFlagData?.name || "-" }}</span>
                  </div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_type") }}</h3>
                  <div class="text-grayy-75">OIL TANKER</div>
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
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_owner") }}</h3>
                  <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselOwner || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_registration_number") }}</h3>
                  <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselOfficialNumber || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_call_sign") }}</h3>
                  <div class="text-grayy-75">{{ formGroupRequest.vessel.vesselCallSign || "-" }}</div>
               </div>
               <div v-if="formGroupRequest.vessel.vesselFlagId === 218" class="col-span-1 md:col-span-2">
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_registration_expiry") }}</h3>
                  <div class="flex gap-1">
                     <span class="text-grayy-75">
                        {{ formatISOToCustomDate(formGroupRequest.vessel.vesselLicenseExpiredDate) || "-" }}
                     </span>
                     <span v-if="compareDateWithToday(formGroupRequest.vessel.vesselLicenseExpiredDate, true) === 'behind'" class="text-error-500">
                        ({{ $t("registration_expired") }})
                     </span>
                  </div>
               </div>
            </div>

            <UDivider class="my-4" />

            <div>
               <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("cargo_list") }}</h2>
               <div class="overflow-x-auto">
                  <UTable
                     :columns="[
                        {
                           key: 'id',
                           label: t('order'),
                           class: 'w-[60px] text-center',
                        },
                        {
                           key: 'berth_name',
                           label: t('docking_vessel'),
                           class: 'text-center',
                        },
                        {
                           key: 'jetty_name',
                           label: t('sub_jetty'),
                        },
                        {
                           key: 'purpose_name',
                           label: t('purpose'),
                        },
                        {
                           key: 'mooring_date',
                           label: t('vessel_in_date'),
                        },
                        {
                           key: 'departure_date',
                           label: t('vessel_out_date'),
                        },
                        {
                           key: 'actions',
                           sortable: false,
                        },
                     ]"
                     :rows="vtmsLogBookDetailBerth"
                     :ui="{
                        wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                        thead: 'bg-primary-50',
                        tbody: 'border-none',
                     }"
                  >
                     <template #id-data="{ index }">
                        <div class="text-center">{{ index + 1 }}</div>
                     </template>

                     <template #berth_name-data="{ row }">
                        <div class="text-center">{{ row.berth_name || "-" }}</div>
                     </template>

                     <template #jetty_name-data="{ row }">
                        <div>{{ row.jetty_name || "-" }}</div>
                     </template>

                     <template #purpose_name-data="{ row }">
                        <div>{{ row.purpose_name || "-" }}</div>
                     </template>

                     <template #mooring_date-data="{ row }">
                        <div v-if="row.mooring_date">
                           <div>{{ convertDateAndTimeStringFormat(row.mooring_date).date }}</div>
                           <div class="text-grayy-75">{{ convertDateAndTimeStringFormat(row.mooring_date).time }}</div>
                        </div>
                        <div v-else>-</div>
                     </template>

                     <template #departure_date-data="{ row }">
                        <div v-if="row.departure_date">
                           <div>{{ convertDateAndTimeStringFormat(row.departure_date).date }}</div>
                           <div class="text-grayy-75">{{ convertDateAndTimeStringFormat(row.departure_date).time }}</div>
                        </div>
                        <div v-else>-</div>
                     </template>

                     <template #actions-data="{ row }">
                        <div class="text-right" v-if="row.is_vessel_in || row.is_vessel_out || row.is_vessel_shift">
                           <UDropdown :items="getMenuTable(row)">
                              <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                           </UDropdown>
                        </div>
                     </template>
                  </UTable>
               </div>
            </div>
         </div>
      </section>
   </div>
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import SignInIcon from "~/assets/icons/fi-rs-sign-in.svg";
import SignOutIcon from "~/assets/icons/fi-rs-sign-out.svg";
import SignOutAltIcon from "~/assets/icons/adjusted_fi-rs-sign-out-alt.svg";

import useDocumentService from "~/core/services/documentService";
const documentService = useDocumentService();

import useMasterDataShipService from "~/core/services/masterDataShipService/vesselService";
const masterDataShipService = useMasterDataShipService();

import useAnchorService from "~/core/services/vtms/logBookService";
const anchorService = useAnchorService();

import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();

const vesselOptionsStore = useVesselOptionsStore();
const { t } = useI18n();
const props = defineProps({
   documentId: Number || String,
});

const isLoading = ref<boolean>(false);
const vesselId = ref<number>(0);
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
   vesselDocuments: [],
   estimatedArrival: null,
   estimatedDeparture: null,
   docNumber: "",
});
const vtmsLogBookDetailBerth = ref<any>([]);
const vesselFlagData = ref({
   path: "",
   name: "",
});

onMounted(async () => {
   getDocumentDetail();
   getVtmsLogBookBerthDetail();
   await vesselOptionsStore.getVesselTypeOption();
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

const getVtmsLogBookBerthDetail = async () => {
   const resp = await anchorService.getVtmsLogBookBerthDetail(props.documentId!);
   if (resp.statusCode === 200) {
      vtmsLogBookDetailBerth.value = resp.data;
   }
};

const getMenuTable = (row: any) => {
   const { is_vessel_in, is_vessel_out, is_vessel_shift, doc_berth_id, vessel_in_id } = row;
   const items: any[] = [[]];

   if (is_vessel_in) {
      items[0].push({
         label: t("vessel_in"),
         avatar: {
            src: SignInIcon,
         },
         click: () => {
            navigateTo(`/vtms/sailing-log/log/${props.documentId}/vessel-in/${doc_berth_id}`);
         },
      });
   }

   if (is_vessel_out) {
      items[0].push({
         label: t("vessel_out"),
         avatar: {
            src: SignOutIcon,
         },
         click: () => {
            navigateTo(`/vtms/sailing-log/log/${props.documentId}/vessel-out/${doc_berth_id}?vessel_in_id=${vessel_in_id}`);
         },
      });
   }

   if (is_vessel_shift) {
      items[0].push({
         label: t("vessel_shift"),
         avatar: {
            src: SignOutAltIcon,
         },
         click: () => {
            navigateTo(`/vtms/sailing-log/log/${props.documentId}/vessel-shift/${doc_berth_id}`);
         },
      });
   }

   return items;
};
</script>
