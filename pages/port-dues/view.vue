<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black py-4">{{ $t("port_due_invoice") }}</h1>
   <div id="vessel-import-view" class="bg-white p-6">
      <header class="flex items-center justify-between">
         <div>
            <div class="flex gap-4">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("port_due_invoice_details") }}</h1>
            </div>
            <p class="mt-1 text-[#667085] text-sm">{{ $t("port_due_invoice_details_helper_text") }}</p>
         </div>
         <div class="flex space-x-3">
            <UButton class="mx-2 border border-grayy-100 w-[46px] h-[36px] justify-center mx-0" size="md" color="gray"
               :label="$t('close')" @click="() => navigateTo('/port-dues/list')" />
         </div>
      </header>

      <UDivider class="m-[22px_0_24px_0]" />

      <section id="request-form-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-8">
         <div class="ship-info-title">
            <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("invoice_details") }}</h2>
         </div>
         <div class="ship-info-content mt-4">
            <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6">
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("request_number") }}</h3>
                  <div class="text-grayy-75">{{ formGroup.docNumber || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("request_date") }}</h3>
                  <div class="text-grayy-75">{{ formGroup.requestDate ? renderDateFormat(formGroup.requestDate,
                     DATE_FORMAT_WITH_TIME) : "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("vessel_name") }}</h3>
                  <div class="text-grayy-75">{{ formGroup.vessel.vesselName || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("date_of_ship_docking") }}</h3>
                  <div class="text-grayy-75">{{ formGroup.berthAt ? renderDateFormat(formGroup.berthAt,
                     DATE_FORMAT_WITH_TIME) : "-" }}</div>
               </div>

               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">Gross Tonnage</h3>
                  <div class="text-grayy-75">
                     <span v-if="formGroup.grossTonnage">{{ formatNumber(formGroup.grossTonnage, 3) }} t</span>
                     <span v-else>-</span>
                  </div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("port") }}</h3>
                  <div class="text-grayy-75">
                     <span v-if="formGroup.berthName">{{ formGroup.berthName }} t</span>
                     <span v-else>-</span>
                  </div>
               </div>
            </div>

            <UDivider class="my-4" />

            <div>
               <h2 class="font-anuphan-semi-bold text-base text-gray-400 mb-4">{{ $t("invoice_address") }}</h2>

               <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6">
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("client_no") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.customerCode || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("name_company") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.name || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("customer_reference") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.customerReference || "-" }}</div>
                  </div>
               </div>
               <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6 mt-4">
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{
                        $t("settings_ship_agent_information_tax_id") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.taxId || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("invoice_contact_name") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.contactName || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("telephone_no") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.phoneNumber || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("mobile_phone_no") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.secondaryPhoneNumber || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("address") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.address || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("subdistrict") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.subDistrictName || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("district") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.districtName || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("province") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.provinceName || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("zipcode") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.postCode || "-" }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("country") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.countryName || "-" }}</div>
                  </div>
               </div>
            </div>

            <UDivider class="my-4" />

            <div>
               <h2 class="font-anuphan-semi-bold text-base text-gray-400 mb-4">{{ $t("service_fee") }}</h2>
               <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6">
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("service_rate") }}</h3>
                     <!-- <div class="text-grayy-75">
                        {{ formGroup.invoice.rate ? `฿ ${formatNumber(formGroup.invoice.rate)}` : "-" }}
                     </div> -->
                     <div class="text-grayy-75">
                        {{ `฿ ${formatNumber(formGroup.invoice.rate)}` }}
                     </div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("service_fee") }}</h3>
                     <!-- <div class="text-grayy-75">{{ formGroup.invoice.fee ? `฿ ${formatNumber(formGroup.invoice.fee)}` : "-" }}</div> -->
                     <div class="text-grayy-75">{{ `฿ ${formatNumber(formGroup.invoice.fee)}` }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("tax_rate") }}</h3>
                     <div class="text-grayy-75">{{ `${formGroup.invoice.vat} %` }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("vat") }}</h3>
                     <!-- <div class="text-grayy-75">
                        {{
                           formGroup.invoice.vatTotal
                              ? `฿
                        ${formatNumber(formGroup.invoice.vatTotal)}`
                              : "-"
                        }}
                     </div> -->
                     <div class="text-grayy-75">
                        {{ `฿ ${formatNumber(formGroup.invoice.vatTotal)}` }}
                     </div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("payment_period") }}</h3>
                     <div class="text-grayy-75">
                        {{
                           formGroup.invoice.paymentPeriod
                              ? `${formGroup.invoice.paymentPeriod}
                        วัน`
                              : "-"
                        }}
                     </div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("service_fee_total") }}</h3>
                     <div class="text-grayy-75">{{ `฿ ${formatNumber(formGroup.invoice.total)}` }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("payment_method") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.paymentMethodName }}</div>
                  </div>
                  <div>
                     <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("payment_due_date") }}</h3>
                     <div class="text-grayy-75">{{ formGroup.invoice.dueDate ?
                        renderDateFormat(formGroup.invoice.dueDate) : "-" }}</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   </div>

   <DialogConfirm title="บันทึกใบแจ้งหนี้" desc="คุณยืนยันการบันทึกใบแจ้งหนี้ใช่หรือไม่" icon="warning"
      labelConfirm="ยืนยัน" :isDialogOpen="isConfirmDialogOpen" :dialogCancel="dialogCancel" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import DialogConfirm from "~/components/dialog/confirm.vue";
import Loading from "~/components/loading.vue";
import type { IPortDuesSaveDetail } from "~/core/interfaces/IPortDuesSaveDetail";
import usePortDuesService from "~/core/services/portDuesService";
const documentOptionsStore = useDocumentOptionsStore();
const portDuesService = usePortDuesService();

const route = useRoute();
const query: any = route.query;
const documentId = ref(query.id);
const isLoading = ref<boolean>(false);
const dateValue = ref<any>("");
const formGroup = ref<IPortDuesSaveDetail>({
   id: 0,
   documentId: 0,
   docNumber: "",
   requestDate: "",
   status: "",
   statusKey: "",
   docType: "",
   portDueNumber: "",
   grossTonnage: 0,
   berthAt: "",
   berthId: "",
   berthName: "",
   eta: "",
   etd: "",
   createdAt: "",
   invoice: {
      id: 0,
      customerId: 0,
      customerCode: "",
      customerReference: "",
      documentId: 0,
      name: "",
      taxId: "",
      contactName: "",
      paymentMethodId: 0,
      paymentMethodName: "",
      paymentTermId: 0,
      paymentTermName: "",
      countryId: 0,
      countryName: "",
      subDistrictId: 0,
      subDistrictName: "",
      districtId: 0,
      districtName: "",
      provinceId: 0,
      provinceName: "",
      postCode: "",
      stageProvince: "",
      address: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      rate: 0,
      fee: 0,
      vat: 0,
      vatTotal: 0,
      total: 0,
      paymentPeriod: 0,
      dueDate: "",
      paidDate: null,
   },
   vessel: {
      vesselFlagId: 0,
      vesselTypeId: 0,
      id: 0,
      documentVesselId: 0,
      vesselId: 0,
      vesselOwner: "",
      vesselOwnerId: 0,
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
      vesselFlagName: "",
      vesselFlagPath: "",
      vesselTypeName: "",
      vesselUploadFiles: [],
   },
   refDocuments: []
});

onMounted(() => {
   getPortDuesDetail();
   getMasterData();
});

const getMasterData = () => {
   documentOptionsStore.getPurposesOptions();
   documentOptionsStore.getCargoTypesOptions();
   documentOptionsStore.getCargoWharfageOptions();
   documentOptionsStore.getProductGroupOptions();
   documentOptionsStore.getProductTypesOptions();
};

const getPortDuesDetail = async () => {
   isLoading.value = true;
   const resp = await portDuesService.getPortDuesDetail(documentId.value);
   if (resp.statusCode === 200) {
      formGroup.value = resp.data;
      dateValue.value = formGroup.value.invoice.dueDate ? new Date(formGroup.value.invoice.dueDate) : new Date();
   }
   isLoading.value = false;
};
const isConfirmDialogOpen = ref(false);
const dialogCancel = () => {
   isConfirmDialogOpen.value = false;
};
</script>
