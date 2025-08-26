<template>
   <div class="mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("request_form_list") }}</h1>
   </div>

   <div id="ship-agent-form-content" class="bg-white rounded-[0px_0px_20px_20px]">
      <div class="flex justify-between mb-5 px-8 pt-6 flex-col md:flex-row">
         <div>
            <div class="flex space-x-4">
               <h1 class="font-semibold text-lg text-grayy-400">{{ isEdit ? $t("edit_request_form") : $t("create_request_form") }}</h1>
               <BadgeCr v-if="!isLoading && documentData.statusDescription" :label="documentData.statusDescription" :type="documentData.status" class="min-w-[67px] h-[28px] text-nowrap justify-center" />
               <BadgeCr v-if="!isLoading && documentData.vesselStatusDes" :label="documentData.vesselStatusDes" :type="documentData.vesselStatus" class="min-w-[67px] h-[28px] text-nowrap justify-center" />
            </div>
            <div class="mt-1 text-grayy-75 text-sm">{{ $t("request_form_detail") }}</div>
            <div class="mt-5 space-y-2">
               <div v-if="documentData.rejectedNote?.length > 0" v-for="data in documentData.rejectedNote" class="text-red-500 text-sm">
                  <span class="font-bold">ความคิดเห็นจากเจ้าหน้าที่ ({{ data.date ? renderDateFormat(data.date, DATE_FORMAT_WITH_TIME) : "" }})</span> :
                  {{ data.message }}
               </div>
            </div>
         </div>
         <div class="flex items-start flex-wrap md:flex-nowrap gap-y-4">
            <UButton @click="handleCancel" class="mx-1 border border-grayy-100" size="md" :label="$t('cancel_request_form')" color="red" variant="outline" />
            <UButton
               v-if="currentStep > 0"
               @click="handleClickBackStep"
               class="mx-1 bg-purple-25 font-bold text-primaryy-500 hover:bg-purple-50"
               icon="i-heroicons-arrow-left-20-solid"
               size="md"
               :label="$t('back')"
            />
            <UButton
               class="ml-1"
               @click="handleClickNextStepRequestForm"
               size="md"
               :disabled="currentStep === 1 && berths.length === 0"
               :label="currentStep === 3 ? (isEdit ? 'บันทึก' : 'ยื่นคำร้อง') : $t('next')"
               :icon="currentStep === 3 ? '' : 'i-heroicons-arrow-right-20-solid'"
               :trailing="true"
            />
         </div>
      </div>
      <UDivider />
      <div class="flex flex-col lg:flex-row">
         <div class="px-8 py-6 bg-grayy-25 lg:w-80">
            <h2 class="font-semibold text-grayy-400 mb-3">{{ $t("ขั้นตอนการยื่นคำร้อง") }}</h2>
            <div class="mt-1 text-grayy-75 text-sm">{{ $t("โปรดระบุข้อมูลให้ครบถ้วน") }}</div>
            <Stepper :currentStep="currentStep" :steps="steps" :direction="stepperDirection" />
         </div>
         <div class="px-4 py-6 w-full overflow-x-auto mobile:px-8">
            <UForm v-if="currentStep === 0" ref="formVesselRef" :state="formVesselGroup" @submit="onSubmit">
               <VesselForm
                  :formGroup="formVesselGroup"
                  :isOtherCountry="isOtherCountry"
                  :setCountryChange="(value: boolean) => isOtherCountry = value"
                  :getFilesUpload="getFileFromUploadVessel"
                  :filesUpload="filesUpload"
                  :validate="validate"
                  :getError="getError"
                  :isSelectedVesselTrigger="isSelectedVesselTrigger"
                  :isRequiredFile="isRequiredFile"
                  :vesselId="vesselId"
                  :shipParticulars="shipParticulars"
                  :shipRegistry="shipRegistry"
                  :internationTonnageCert="internationTonnageCert"
                  :last10Ports="last10Ports"
                  :powerOfAttorney="powerOfAttorney"
                  :shipParticularsFileName="shipParticularsFileName"
                  :shipRegistryFileName="shipRegistryFileName"
                  :internationTonnageCertFileName="internationTonnageCertFileName"
                  :last10PortsFileName="last10PortsFileName"
                  :powerOfAttorneyFileName="powerOfAttorneyFileName"
                  :isRequiredFileShipsPaticulars="isRequiredFileShipsPaticulars"
                  :isRequiredFileShipRegistry="isRequiredFileShipRegistry"
                  :isRequiredFileShipInternation="isRequiredFileShipInternation"
                  :isRequiredFileLast10Ports="isRequiredFileLast10Ports"
                  :isRequiredFilePowerOfAttorney="isRequiredFilePowerOfAttorney"
                  :onRemoveShipParticulars="(value: any) => shipParticulars = value"
                  :onRemoveShipRegistry="(value: any) => shipRegistry = value"
                  :onRemoveShipInternation="(value: any) => internationTonnageCert = value"
                  :onRemoveLast10Ports="(value: any) => last10Ports = value"
                  :onRemovePowerOfAttorney="(value: any) => powerOfAttorney = value"
                  :shipParticularsFilePreview="shipParticularsFilePreview"
                  :shipRegistryFilePreview="shipRegistryFilePreview"
                  :internationTonnageCertFilePreview="internationTonnageCertFilePreview"
                  :last10PortsFilePreview="last10PortsFilePreview"
                  :powerOfAttorneyFilePreview="powerOfAttorneyFilePreview"
               />
            </UForm>
            <DockingVessel
               v-if="currentStep === 1"
               :documentId="documentId"
               :confirmAddDockingVessel="confirmAddDockingVessel"
               :berths="berths"
               :confirmAddProduct="confirmAddProduct"
               :confirmDeleteProduct="confirmDeleteProduct"
               :confirmDeleteBerth="confirmDeleteBerth"
               :confirmUploadBerthFile="confirmUploadBerthFile"
               :onDeleteFileBerthSuccess="onDeleteFileBerthSuccess"
               :berthsErrors="berthsErrors"
            />
            <UForm v-if="currentStep === 2" ref="formInvoiceRef" :state="formInvoiceGroup" @submit="onInvoiceSubmit">
               <InvoiceForm
                  :formGroup="formInvoiceGroup"
                  :setCountryChange="(value: boolean) => isOtherInvoiceCountry = value"
                  :isOtherInvoiceCountry="isOtherInvoiceCountry"
                  :validate="validate"
                  :getError="getError"
               />
            </UForm>

            <VerifyInformation
               v-if="currentStep === 3"
               :formVesselGroup="formVesselGroup"
               :vesselFilesUpload="filesUpload"
               :berths="berths"
               :formInvoiceGroup="formInvoiceGroup"
               :documentData="documentData"
            />
         </div>
      </div>
   </div>
   <DialogConfirm
      :title="isEdit ? $t('แก้ไขคำร้อง') : $t('ยื่นคำร้อง')"
      :desc="$t('กรุณาตรวจสอบที่อยู่ใบแจ้งหนี้ด้านล่าง ก่อนยืนยันคำร้อง')"
      icon="warning"
      :labelConfirm="isCounting ? `${countdown}` : $t('confirm')"
      :isDialogOpen="isConfirmDialogOpen"
      :dialogCancel="dialogCancel"
      :dialogConfirm="dialogConfirm"
      :disabledConfirm="isCounting"
   >
      <template #customNodeContent>
         <div class="border border-grayy-100 p-3 rounded-xl mt-6 text-left">
            <h2 class="font-semibold text-grayy-400 mb-3">{{ $t("invoice_address") }}</h2>
            <div class="grid grid-cols-1 gap-4">
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ชื่อลูกค้า/บริษัท") }}</h3>
                  <div class="text-grayy-75">{{ documentData.invoice.name || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("taxpayer_identification_no") }}</h3>
                  <div class="text-grayy-75">{{ documentData.invoice.taxId || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ชื่อผู้ติดต่อ") }}</h3>
                  <div class="text-grayy-75">{{ documentData.invoice.contactName || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("วิธีการชำระเงิน") }}</h3>
                  <div class="text-grayy-75">{{ documentData.invoice.paymentMethodName || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("เงื่อนไขการชำระเงิน") }}</h3>
                  <div class="text-grayy-75">{{ documentData.invoice.paymentTermName || "-" }}</div>
               </div>
               <div>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ที่อยู่") }}</h3>
                  <div class="text-grayy-75">{{ documentData.invoice.address || "-" }}</div>
               </div>
            </div>
         </div>
      </template>
   </DialogConfirm>
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
      :title="$t('cancel_request_form')"
      :desc="$t('คุณต้องการยกเลิกใบคำร้องนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก')"
      icon="error"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)"
      :dialogConfirm="handleConfirmCancelDocument"
      colorConfirm="red"
      :label-cancel="$t('cancel')"
   />
   <DialogAlert
      :isOpen="isAlertDialogOpen"
      :desc="modalAlertMessage"
      :title="modalAlertTitle"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialog"
      :btnName="$t('close')"
   />
   <DialogAlert
      :isOpen="isAlertDialogUpdateOpen"
      :desc="modalAlertMessage"
      :title="$t('save_vessel_agent')"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialogUpdate"
      :btnName="$t('close')"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import VesselForm from "~/components/request-form/vesselForm.vue";
import Stepper from "~/components/ui/Stepper.vue";
import DockingVessel from "~/components/request-form/dockingVessel.vue";
import InvoiceForm from "~/components/request-form/invoiceForm.vue";
import VerifyInformation from "~/components/request-form/verifyInformation.vue";
import type { IVesselDocumentRequest } from "~/core/interfaces/IVesselDocumentRequest";
import useDocumentService from "~/core/services/documentService";
import type { IDocumentData } from "~/core/interfaces/IDocumentData";
import type { IBerthDocumentList } from "~/core/interfaces/IBerthDocumentList";
import type { IInvoiceDocumentRequest } from "~/core/interfaces/IInvoiceDocumentRequest";
import Badge from "~/components/badge/badge.vue";
import BadgeCr from "~/components/badge/badgeCr.vue";
import { DocumentStatusEnum } from "~/utils/enums/DocumentStatusEnum";
import { VesselDocStatusEnum } from "~/utils/enums/VesselDocStatusEnum";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";
import { FileVesselTypeEnum } from "~/utils/enums/FileVesselTypeEnum";
import { PurposeType } from "~/core/utils/enum";
import { useDocumentStore } from "~/stores/documentStore";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === "edit";
const documentStore = useDocumentStore();
const vesselOptionsStore = useVesselOptionsStore();
const vesselStore = useVesselStore();
const documentService = useDocumentService();
const authStore = useAuthStore();
const query: any = route.query;
const isAgency = authStore.profileUser.type === "Agency";
const vesselId = vesselStore.vesselId;
const isLoading = ref(false);

const isConfirmDialogOpen = ref(false);
const isConfirmLeaveDialogOpen = ref(false);
const isConfirmCancelDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const isAlertDialogUpdateOpen = ref(false);
const modalAlertTitle = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");
const nextRoute = ref<any>(null);
const notAllowNavigate = ref(true);

const isRequiredFile = ref(false);

const filesUpload = ref<IFileUpload[]>([]);
const documentId = ref((isEdit && +query.id) || 0);
const berths = ref<IBerthDocumentList[]>([]);
const berthsErrors = ref<any[]>([]);
const documentData = ref<IDocumentData>({
   id: 0,
   requestDate: "",
   docNumber: "",
   estimatedArrival: "",
   estimatedDeparture: "",
   status: "",
   statusDescription: "",
   vessel: {
      documentVesselId: 0,
      vesselFlagId: 0,
      vesselTypeId: 0,
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
      vesselLicenseExpiredDate: null,
      vesselUploadFiles: [],
      vesselFlagName: "",
      vesselFlagPath: "",
      vesselFlag: "",
   },
   invoice: {
      id: 0,
      customerId: null,
      name: "",
      taxId: "",
      contactName: "",
      paymentMethodId: 0,
      paymentTermId: 0,
      countryId: 0,
      subDistrictId: 0,
      districtId: 0,
      provinceId: 0,
      postCode: "",
      stageProvince: "",
      address: "",
      paymentMethodName: "",
      paymentTermName: "",
   },
   berths: [],
   vesselStatus: "",
   vesselStatusDes: "",
   rejectedNote: [],
   vesselDocuments: [],
   canApprove: false,
   isNewShip: false
});

const currentStep = ref(0);
const formVesselRef = ref<any>(null);
const formInvoiceRef = ref<any>(null);
const steps = computed(() => [
   {
      label: t("ข้อมูลเรือ"),
   },
   {
      label: t("การเทียบท่า"),
   },
   {
      label: t("ใบแจ้งหนี้"),
   },
   {
      label: t("ตรวจสอบข้อมูล"),
   },
]);

const isOtherCountry = ref(true);
const isOtherInvoiceCountry = ref(true);

const shipParticulars = ref<IFileUpload>({ document_file_type: "", extension: "", fileName: "", filePath: "", preview: "", size: 0 });
const shipRegistry = ref<IFileUpload>({ document_file_type: "", extension: "", fileName: "", filePath: "", preview: "", size: 0 });
const internationTonnageCert = ref<IFileUpload>({ document_file_type: "", extension: "", fileName: "", filePath: "", preview: "", size: 0 });
const last10Ports = ref<IFileUpload>({ document_file_type: "", extension: "", fileName: "", filePath: "", preview: "", size: 0 });
const powerOfAttorney = ref<IFileUpload>({ document_file_type: "", extension: "", fileName: "", filePath: "", preview: "", size: 0 });
const shipParticularsFileName = ref<string>("");
const shipRegistryFileName = ref<string>("");
const internationTonnageCertFileName = ref<string>("");
const last10PortsFileName = ref<string>("");
const powerOfAttorneyFileName = ref<string>("");

const shipParticularsFilePreview = ref<string>("");
const shipRegistryFilePreview = ref<string>("");
const internationTonnageCertFilePreview = ref<string>("");
const last10PortsFilePreview = ref<string>("");
const powerOfAttorneyFilePreview = ref<string>("");

const isRequiredFileShipsPaticulars = ref<boolean>(false);
const isRequiredFileShipRegistry = ref<boolean>(false);
const isRequiredFileShipInternation = ref<boolean>(false);
const isRequiredFileLast10Ports = ref<boolean>(false);
const isRequiredFilePowerOfAttorney = ref<boolean>(false);

const errors = ref<FormError[]>([]);

const validate = (field: string, valueSelected: any = 0) => {
   const validationErrors: FormError[] = [];

   // Vessel Name validation
   if (field === "vesselName") {
      if (!formVesselGroup.vesselName) {
         validationErrors.push({ path: "vesselName", message: t("please_enter_a_value") });
      }
   }

   // Vessel Call Sign validation (dependent on isOtherCountry)
   // if (field === 'vesselCallSign') {
   //     if (isOtherCountry.value && !formVesselGroup.vesselCallSign) {
   //         validationErrors.push({ path: 'vesselCallSign', message: t('please_enter_a_value') });
   //     }
   // }

   // Vessel IMO Number validation (dependent on isOtherCountry)
   if (field === "vesselImoNumber") {
      if (isOtherCountry.value && !formVesselGroup.vesselImoNumber) {
         validationErrors.push({ path: "vesselImoNumber", message: t("please_enter_a_value") });
      } else if (isOtherCountry.value && !regxNumber7Degit.test(formVesselGroup.vesselImoNumber)) {
         // Replace with desired phone number validation
         validationErrors.push({ path: "vesselImoNumber", message: t("imo_number_not_correct") });
      }
   }

   if (field === "vesselMMSiNumber") {
      if (formVesselGroup.vesselMMSiNumber) {
         if (!regxNumber10Degit.test(formVesselGroup.vesselMMSiNumber)) {
            validationErrors.push({ path: "vesselMMSiNumber", message: t("mmsi_number_not_correct") });
         }
      }
   }

   // Vessel Owner validation
   if (field === "vesselOwner") {
      if (!formVesselGroup.vesselOwner) {
         validationErrors.push({ path: "vesselOwner", message: t("please_enter_a_value") });
      }
   }

   // Numeric fields validation (vesselBreadthExtreme, vesselDepth, etc.)
   const numericFields = [
      "vesselBreadthExtreme",
      "vesselDepth",
      "vesselGrossTonnage",
      "vesselLengthOverall",
      "vesselLoadWeight",
      "vesselNetTonnage",
      "vesselFlagId",
   ];

   if (numericFields.includes(field)) {
      if (formVesselGroup[field] <= 0) {
         validationErrors.push({ path: field, message: t("please_enter_a_value") });
      } else if (typeof formVesselGroup[field] !== "number") {
         validationErrors.push({ path: field, message: t("กรณุากรอกเป็นตัวเลข") });
      }
   }

   // Vessel Type ID validation (dependent on isOtherCountry)
   if (field === "vesselTypeId") {
      if (isOtherCountry.value && !formVesselGroup.vesselTypeId && !valueSelected) {
         validationErrors.push({ path: "vesselTypeId", message: t("please_enter_a_value") });
      }
   }

   // Vessel vesselFlagId validation (dependent on isOtherCountry)
   if (field === "vesselFlagId") {
      if (!formVesselGroup.vesselFlagId && !valueSelected) {
         validationErrors.push({ path: "vesselFlagId", message: t("please_enter_a_value") });
      }
   }

   // Vessel License Expired Date validation (dependent on isOtherCountry)
   if (field === "vesselLicenseExpiredDate") {
      if (!formVesselGroup.vesselLicenseExpiredDate && !isOtherCountry.value) {
         validationErrors.push({ path: "vesselLicenseExpiredDate", message: t("please_enter_a_value") });
      }
   }

   // Add other field validations (vesselMainEngine, vesselBandAndModel, etc.)
   if (["vesselMainEngine", "vesselBandAndModel", "vesselOfficialNumber"].includes(field) && !formVesselGroup[field]) {
      validationErrors.push({ path: field, message: t("please_enter_a_value") });
   } else if (field === "vesselOfficialNumber" && !regxNumber9Degit.test(formVesselGroup.vesselOfficialNumber)) {
      // Replace with desired phone number validation
      validationErrors.push({ path: "vesselOfficialNumber", message: t("official_number_not_correct") });
   }

   // Name validation
   if (field === "name") {
      if (!formInvoiceGroup.name) {
         validationErrors.push({ path: "name", message: t("please_enter_a_value") });
      }
   }

   // Tax ID validation
   if (field === "taxId") {
      if (!formInvoiceGroup.taxId) {
         validationErrors.push({ path: "taxId", message: t("please_enter_a_value") });
      } else if (!regxNumber13Degit.test(formInvoiceGroup.taxId)) {
         // Replace with desired phone number validation
         validationErrors.push({ path: "taxId", message: t("taxpayer_identification_not_correct") });
      }
   }

   // Contact Name validation
   if (field === "contactName") {
      if (!formInvoiceGroup.contactName) {
         validationErrors.push({ path: "contactName", message: t("please_enter_a_value") });
      }
   }

   // Payment Method ID validation
   if (field === "paymentMethodId") {
      formInvoiceGroup.paymentMethodId = valueSelected || formInvoiceGroup.paymentMethodId;
      if (!formInvoiceGroup.paymentMethodId || formInvoiceGroup.paymentMethodId < 1) {
         validationErrors.push({ path: "paymentMethodId", message: t("please_enter_a_value") });
      }
   }

   // Payment Term ID validation
   if (field === "paymentTermId") {
      formInvoiceGroup.paymentTermId = valueSelected || formInvoiceGroup.paymentTermId;
      if (!formInvoiceGroup.paymentTermId || formInvoiceGroup.paymentTermId < 1) {
         validationErrors.push({ path: "paymentTermId", message: t("please_enter_a_value") });
      }
   }

   // Country ID validation
   if (field === "countryId") {
      formInvoiceGroup.countryId = valueSelected || formInvoiceGroup.countryId;
      if (!formInvoiceGroup.countryId || formInvoiceGroup.countryId < 1) {
         validationErrors.push({ path: "countryId", message: t("please_enter_a_value") });
      }
   }

   // Province ID validation (dependent on isOtherInvoiceCountry)
   if (field === "provinceId") {
      formInvoiceGroup.provinceId = valueSelected || formInvoiceGroup.provinceId;
      if (!isOtherInvoiceCountry.value && (!formInvoiceGroup.provinceId || formInvoiceGroup.provinceId < 1)) {
         validationErrors.push({ path: "provinceId", message: t("please_enter_a_value") });
      }
   }

   // District ID validation (dependent on isOtherInvoiceCountry)
   if (field === "districtId") {
      formInvoiceGroup.districtId = valueSelected || formInvoiceGroup.districtId;
      if (!isOtherInvoiceCountry.value && (!formInvoiceGroup.districtId || formInvoiceGroup.districtId < 1)) {
         validationErrors.push({ path: "districtId", message: t("please_enter_a_value") });
      }
   }

   // SubDistrict ID validation (dependent on isOtherInvoiceCountry)
   if (field === "subDistrictId") {
      formInvoiceGroup.subDistrictId = valueSelected || formInvoiceGroup.subDistrictId;
      if (!isOtherInvoiceCountry.value && (!formInvoiceGroup.subDistrictId || formInvoiceGroup.subDistrictId < 1)) {
         validationErrors.push({ path: "subDistrictId", message: t("please_enter_a_value") });
      }
   }

   // Post Code validation
   if (field === "postCode") {
      if (!formInvoiceGroup.postCode) {
         validationErrors.push({ path: "postCode", message: t("please_enter_a_value") });
      }
   }

   // Stage Province validation (dependent on isOtherInvoiceCountry)
   if (field === "stageProvince") {
      if (isOtherInvoiceCountry.value && !formInvoiceGroup.stageProvince) {
         validationErrors.push({ path: "stageProvince", message: t("please_enter_a_value") });
      }
   }

   // Address Validation
   if (field === "address") {
      if (!formInvoiceGroup.address) {
         validationErrors.push({ path: "address", message: t("please_enter_a_value") });
      }
   }

   // Clear previous errors for the specific field and add the new error if any
   errors.value = errors.value.filter((err) => err.path !== field);
   if (validationErrors.length) {
      errors.value.push(...validationErrors);
   }
};

const getError = (field: string) => {
   const error = errors.value.find((err) => err.path === field);
   return error ? error.message : null;
};

const formVesselGroup = reactive<any>({
   documentVesselId: 0,
   vesselId: 0,
   vesselName: "",
   vesselCallSign: "",
   vesselImoNumber: "",
   vesselOwner: "",
   vesselOwnerId: 0,
   vesselBreadthExtreme: 0,
   vesselDepth: 0,
   vesselGrossTonnage: 0,
   vesselLengthOverall: 0,
   vesselLoadWeight: 0,
   vesselMainEngine: "",
   vesselBandAndModel: "",
   vesselMMSiNumber: "",
   vesselNetTonnage: 0,
   vesselOfficialNumber: "",
   vesselFlagId: 0,
   vesselTypeId: 0,
   vesselLicenseExpiredDate: "",
});

const formInvoiceGroup = reactive<any>({
   customerId: 0,
   name: "",
   taxId: "",
   contactName: "",
   paymentMethodId: 0,
   paymentTermId: 0,
   countryId: 0,
   subDistrictId: 0,
   districtId: 0,
   provinceId: 0,
   postCode: "",
   stageProvince: "",
   address: "",
});

const payload = ref<IVesselDocumentRequest>({
   documentVesselId: 0,
   vesselFlagId: 0,
   vesselTypeId: 0,
   vesselId: 0,
   vesselOwner: "",
   vesselName: "",
   vesselImoNumber: "",
   vesselMMSiNumber: "",
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
});

const invoicePayload = ref<IInvoiceDocumentRequest>({
   customerId: null,
   name: "",
   taxId: "",
   contactName: "",
   paymentMethodId: 0,
   paymentTermId: 0,
   countryId: 0,
   subDistrictId: 0,
   districtId: 0,
   provinceId: 0,
   postCode: "",
   stageProvince: "",
   address: "",
});

const addressOptionsStore = useAddressOptionsStore();
const documentOptionsStore = useDocumentOptionsStore();

onMounted(() => {
   addressOptionsStore.getCountriesOptions();
   addressOptionsStore.getProvincesOptions();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getPurposesOptions();
   documentOptionsStore.getCargoTypesOptions();
   documentOptionsStore.getCargoWharfageOptions();
   documentOptionsStore.getPaymentMethodOptions();
   documentOptionsStore.getPaymentTermsOptions();
   documentOptionsStore.getPurposeTypeOptions();
   getDocumentDraftOrDetail(+documentId.value);
});

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

const getDocumentDraftOrDetail = async (docId: number = 0) => {
   const getDocumentDetailService = documentService.getDocumentDetail(docId);
   const resp = isEdit ? await getDocumentDetailService : await documentService.getDraft();
   if (resp.statusCode === 200) {
      const data: IDocumentData = resp.data;
      documentData.value = data;
      formVesselGroup.documentVesselId = data.vessel.documentVesselId;
      formVesselGroup.vesselId = data.vessel.vesselId;
      formVesselGroup.vesselName = data.vessel.vesselName;
      formVesselGroup.vesselCallSign = data.vessel.vesselCallSign;
      formVesselGroup.vesselImoNumber = data.vessel.vesselImoNumber;
      formVesselGroup.vesselOwner = data.vessel.vesselOwner;
      formVesselGroup.vesselBreadthExtreme = data.vessel.vesselBreadthExtreme;
      formVesselGroup.vesselDepth = data.vessel.vesselDepth;
      formVesselGroup.vesselGrossTonnage = data.vessel.vesselGrossTonnage;
      formVesselGroup.vesselLengthOverall = data.vessel.vesselLengthOverall;
      formVesselGroup.vesselLoadWeight = data.vessel.vesselLoadWeight;
      formVesselGroup.vesselMainEngine = data.vessel.vesselMainEngine;
      formVesselGroup.vesselBandAndModel = data.vessel.vesselBandAndModel;
      formVesselGroup.vesselMMSiNumber = data.vessel.vesselMMSiNumber;
      formVesselGroup.vesselNetTonnage = data.vessel.vesselNetTonnage;
      formVesselGroup.vesselOfficialNumber = data.vessel.vesselOfficialNumber;
      formVesselGroup.vesselFlagId = data.vessel.vesselFlagId || 0;
      formVesselGroup.vesselTypeId = data.vessel.vesselTypeId || 0;
      formVesselGroup.vesselLicenseExpiredDate = data.vessel.vesselLicenseExpiredDate || "";
      filesUpload.value = data.vesselDocuments || [];
      setFileUploadToEachType(data.vesselDocuments || []);
      documentId.value = data.id;

      berths.value = data.berths || [];

      // invoice
      formInvoiceGroup.customerId = data.invoice.customerId;
      formInvoiceGroup.name = data.invoice.name;
      formInvoiceGroup.taxId = data.invoice.taxId;
      formInvoiceGroup.contactName = data.invoice.contactName;
      formInvoiceGroup.paymentMethodId = data.invoice.paymentMethodId;
      formInvoiceGroup.paymentTermId = data.invoice.paymentTermId;
      formInvoiceGroup.countryId = data.invoice.countryId;
      formInvoiceGroup.subDistrictId = data.invoice.subDistrictId;
      formInvoiceGroup.districtId = data.invoice.districtId;
      formInvoiceGroup.provinceId = data.invoice.provinceId;
      formInvoiceGroup.postCode = data.invoice.postCode;
      formInvoiceGroup.stageProvince = data.invoice.stageProvince;
      formInvoiceGroup.address = data.invoice.address;
      isOtherInvoiceCountry.value = data.invoice.countryId !== 219 ? true : false;
   }
};

const setFileUploadToEachType = (value: IFileUpload[]) => {
   for (let index = 0; index < value.length; index++) {
      const dataFile: IFileUpload = value[index] as IFileUpload;
      if (dataFile.fileType === FileVesselTypeEnum.shipParticulars) {
         shipParticulars.value = dataFile;
      }
      if (dataFile.fileType === FileVesselTypeEnum.shipRegistry) {
         shipRegistry.value = dataFile;
      }
      if (dataFile.fileType === FileVesselTypeEnum.internationTonnageCert) {
         internationTonnageCert.value = dataFile;
      }
      if (dataFile.fileType === FileVesselTypeEnum.last10Ports) {
         last10Ports.value = dataFile;
      }
      if (dataFile.fileType === FileVesselTypeEnum.powerOfAttorney) {
         powerOfAttorney.value = dataFile;
      }
   }
};

onBeforeRouteLeave((to, from, next) => {
   if (notAllowNavigate.value) {
      isConfirmLeaveDialogOpen.value = true;
      nextRoute.value = to;
      next(false); // Prevent navigation until confirmed
   } else {
      next(); // Allow navigation
   }
});

const countdown = ref(5); // Countdown duration (seconds)
const isCounting = ref(false);
let timer: string | number | NodeJS.Timeout | null | undefined = null;
const startCountdown = () => {
   if (isCounting.value) return; // Prevent multiple clicks
   isCounting.value = true;
   countdown.value = 5; // Reset countdown

   timer = setInterval(() => {
      if (countdown.value > 0) {
         countdown.value--;
      } else {
         if (timer !== null) {
            clearInterval(timer);
         }
         isCounting.value = false; // Enable button
      }
   }, 1000);
};
watch(
   () => formVesselGroup.vesselFlagId,
   (value) => {
      const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value);
      if (findVesselFlag) {
         isOtherCountry.value = findVesselFlag.name === "Thailand" ? false : true;
      }
   }
);

watch(
   () => filesUpload.value.length,
   (files) => {
      isRequiredFile.value = files > 0 ? false : true;
   }
);

const navigateToRequestFormList = () => {
   if (documentStore.requestFormQueryType === "PendingReview") {
      navigateTo("/request-form/list?status=PendingReview");
   } else if (documentStore.requestFormQueryType === "PendingApproval") {
      navigateTo("/request-form/list?status=PendingApproval");
   } else if (documentStore.requestFormQueryType === "PendingEdit") {
      navigateTo("/request-form/list?status=PendingEdit");
   } else if (documentStore.requestFormQueryType === "PendingConfirmation") {
      navigateTo("/request-form/list?status=PendingConfirmation,PendingConfirmation1,PendingConfirmation2");
   } else if (documentStore.requestFormQueryType === "PendingEdit") {
      navigateTo("/request-form/list?status=PendingEdit");
   } else if (documentStore.requestFormQueryType === "Approved") {
      navigateTo("/request-form/list?status=Approved");
   } else {
      if (isAgency) {
         navigateTo("/request-form/list");
      } else {
         navigateTo("/request-form/list?status=");
      }
   }
   documentStore.triggerRefresh();
};

const isSelectedVesselTrigger = (isTrigger: boolean) => {
   if (isTrigger) {
      const fieldsToValidate = [
         "vesselName",
         "vesselCallSign",
         "vesselImoNumber",
         "vesselOwner",
         "vesselBreadthExtreme",
         "vesselDepth",
         "vesselGrossTonnage",
         "vesselLengthOverall",
         "vesselLoadWeight",
         // 'vesselMainEngine', 'vesselBandAndModel',
         "vesselOfficialNumber",
         "vesselFlagId",
         "vesselTypeId",
         "vesselLicenseExpiredDate",
         "vesselNetTonnage",
      ];

      fieldsToValidate.forEach((field) => {
         validate(field);
      });
   }
};

const daysRemaining = computed(() => {
   const currentDate = new Date();
   if (formVesselGroup.vesselLicenseExpiredDate && !new Date(formVesselGroup.vesselLicenseExpiredDate)) return 0;
   const diffTime = new Date(formVesselGroup.vesselLicenseExpiredDate).getTime() - currentDate.getTime();
   return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
});

async function onSubmit(event: FormSubmitEvent<z.output<any>>) {
   const fieldsToValidate = [
      "vesselName",
      "vesselCallSign",
      "vesselImoNumber",
      "vesselOwner",
      "vesselBreadthExtreme",
      "vesselDepth",
      "vesselGrossTonnage",
      "vesselLengthOverall",
      "vesselLoadWeight",
      // 'vesselMainEngine', 'vesselBandAndModel',
      "vesselOfficialNumber",
      "vesselFlagId",
      "vesselTypeId",
      "vesselLicenseExpiredDate",
      "vesselNetTonnage",
   ];

   fieldsToValidate.forEach((field) => {
      validate(field);
   });
   // Check if there are any errors
   if (errors.value.length === 0) {
      if (!isOtherCountry.value) {
         if (daysRemaining.value > 0) {
            createOrUpdateVesselDocument(event);
         }
      } else {
         createOrUpdateVesselDocument(event);
      }
   }
}

const validateFileUpload = (field: FileVesselTypeEnum) => {
   if (field === FileVesselTypeEnum.shipParticulars) {
      isRequiredFileShipsPaticulars.value = !shipParticulars.value.fileName;
   }
   if (field === FileVesselTypeEnum.shipRegistry) {
      isRequiredFileShipRegistry.value = !shipRegistry.value.fileName;
   }
   if (field === FileVesselTypeEnum.internationTonnageCert) {
      isRequiredFileShipInternation.value = !internationTonnageCert.value.fileName;
   }
   if (field === FileVesselTypeEnum.last10Ports) {
      isRequiredFileLast10Ports.value = !last10Ports.value.fileName;
   }
   if (field === FileVesselTypeEnum.powerOfAttorney) {
      isRequiredFilePowerOfAttorney.value = !isOtherCountry.value && !powerOfAttorney.value.fileName;
   }
};

const createOrUpdateVesselDocument = async (event: FormSubmitEvent<z.output<any>>) => {
   validateFileUpload(FileVesselTypeEnum.shipParticulars);
   validateFileUpload(FileVesselTypeEnum.shipRegistry);
   validateFileUpload(FileVesselTypeEnum.internationTonnageCert);
   validateFileUpload(FileVesselTypeEnum.last10Ports);
   validateFileUpload(FileVesselTypeEnum.powerOfAttorney);
   if (
      isRequiredFileShipsPaticulars.value ||
      isRequiredFileShipRegistry.value ||
      isRequiredFileShipInternation.value ||
      isRequiredFileLast10Ports.value ||
      isRequiredFilePowerOfAttorney.value
   ) {
      const containerUpload = document.getElementById("containerUpload");
      containerUpload?.scrollIntoView({ behavior: "smooth" });
   } else {
      const newPayload: IVesselDocumentRequest = {
         ...payload.value,
         ...event.data,
         vesselLicenseExpiredDate: event.data.vesselLicenseExpiredDate || null,
      };
      const uploadFiles: IFileUpload[] = filesUpload.value
         .filter(
            (e: any) =>
               !e.isError &&
               [
                  FileVesselTypeEnum.shipParticulars,
                  FileVesselTypeEnum.shipRegistry,
                  FileVesselTypeEnum.internationTonnageCert,
                  FileVesselTypeEnum.last10Ports,
                  FileVesselTypeEnum.powerOfAttorney,
               ].includes(e.fileType)
         )
         .map((file: any) => ({
            ...file,
            document_file_type: file.document_file_type || "",
            preview: file.preview || "",
         }));

      payload.value = { ...newPayload, vesselUploadFiles: uploadFiles };
      const resp = isEdit ? await documentService.updateDocument(documentId.value, payload.value) : await documentService.createDraft(payload.value);
      if (resp.statusCode === 200) {
         currentStep.value = 1;
         getDocumentDraftOrDetail(documentId.value);
      } else {
         modalAlertTitle.value = "ข้อมูลเรือ";
         isAlertDialogOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }
};

async function onInvoiceSubmit(event: FormSubmitEvent<z.output<any>>) {
   const fieldsToValidate = [
      "name",
      "taxId",
      "contactName",
      "paymentMethodId",
      "paymentTermId",
      "countryId",
      "provinceId",
      "districtId",
      "subDistrictId",
      "postCode",
      "stageProvince",
      "address",
   ];

   fieldsToValidate.forEach((field) => {
      validate(field);
   });
   // Check if there are any errors
   if (errors.value.length === 0) {
      const newPayload: IInvoiceDocumentRequest = {
         ...invoicePayload.value,
         ...event.data,
         provinceId: isOtherInvoiceCountry.value ? 1 : event.data.provinceId || 1,
      };
      invoicePayload.value = { ...newPayload };
      const resp = await documentService.addInvoiceDocument(documentId.value, newPayload);
      if (resp.statusCode === 200) {
         await getDocumentDraftOrDetail(documentId.value);
         currentStep.value = 3;
      } else {
         modalAlertTitle.value = "ใบแจ้งหนี้";
         isAlertDialogOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }
}

const dialogCancel = () => {
   isConfirmDialogOpen.value = false;
};
const dialogConfirm = async () => {
   isLoading.value = true;
   notAllowNavigate.value = false;

   const resp = await documentService.submitToReview(documentId.value);
   if (resp.statusCode === 200) {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = isEdit ? "แก้ไขคำร้อง" : "ยื่นคำร้อง";
      modalAlertMessage.value = "เราได้ส่งคำร้องของคุณให้กับเจ้าหน้าที่แล้ว";
      modalAlertType.value = "success";
   } else {
      modalAlertTitle.value = isEdit ? "แก้ไขคำร้อง" : "ยื่นคำร้อง";
      isAlertDialogOpen.value = true;
      modalAlertMessage.value = resp.message;
      modalAlertType.value = "error";
   }
   isLoading.value = false;
   isConfirmDialogOpen.value = false;
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      navigateToRequestFormList();
   }
   isAlertDialogOpen.value = false;
};

const handleCloseAlertDialogUpdate = () => {
   isAlertDialogUpdateOpen.value = false;
};

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

const handleCancel = () => {
   isConfirmCancelDialogOpen.value = true;
};

const handleConfirmCancelDocument = async () => {
   if (documentId.value) {
      notAllowNavigate.value = false;
      const resp = await documentService.cancelDocument(documentId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ยกเลิกใบคำร้อง";
         modalAlertMessage.value = "การยกเลิกใบคำร้องของคุณสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ยกเลิกใบคำร้อง";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      notAllowNavigate.value = false;
      navigateToRequestFormList();
   }
};

const confirmAddDockingVessel = (isSuccess: true) => {
   if (isSuccess) {
      getDocumentDraftOrDetail(documentId.value);
   }
};

const confirmAddProduct = (isSuccess: true) => {
   if (isSuccess) {
      getDocumentDraftOrDetail(documentId.value);
   }
};

const confirmDeleteProduct = (isSuccess: true) => {
   if (isSuccess) {
      getDocumentDraftOrDetail(documentId.value);
   }
};

const confirmDeleteBerth = (isSuccess: true) => {
   if (isSuccess) {
      getDocumentDraftOrDetail(documentId.value);
   }
};

const confirmUploadBerthFile = (isSuccess: true) => {
   if (isSuccess) {
      getDocumentDraftOrDetail(documentId.value);
   }
};

const onDeleteFileBerthSuccess = (isSuccess: true) => {
   if (isSuccess) {
      getDocumentDraftOrDetail(documentId.value);
   }
};

const getFileFromUploadVessel = (files: any) => {
   filesUpload.value = files;
};

const handleClickNextStepRequestForm = async () => {
   switch (currentStep.value) {
      case 0:
         if (formVesselRef.value) {
            formVesselRef.value.validate().then((isValid: any) => {
               if (isValid) {
                  // All required fields are filled
                  formVesselRef.value.submit();
               } else {
                  console.log("Form is not fully filled out.");
               }
            });
         }
         // currentStep.value = 1
         break;
      case 1:
         await getDocumentDraftOrDetail(documentId.value);
         berthsErrors.value = validateBerthFile();
         if (berthsErrors.value.length === 0) {
            currentStep.value = 2;
         }

         break;
      case 2:
         if (formInvoiceRef.value) {
            formInvoiceRef.value.validate().then((isValid: any) => {
               if (isValid) {
                  // All required fields are filled
                  formInvoiceRef.value.submit();
               } else {
                  console.log("Form is not fully filled out.");
               }
            });
         }
         break;
      default:
         isConfirmDialogOpen.value = true;
         break;
   }
};

const validateBerthFile = () => {
   const errors: any[] = [];
   console.log("berths on validate ", berths.value);
   berths.value.forEach((berth) => {
      const findPurpose: any = documentOptionsStore.purposesOptions.find((e: any) => e.id === berth.purposeId);
      console.log("findPurpose on validate ", findPurpose);
      if (findPurpose) {
         if ([PurposeType.Discharge, PurposeType.DischargeLoading].includes(findPurpose.purposeType) && berth.files.length === 0) {
            errors.push({ id: berth.id });
         }
      }
   });
   return errors;
};

const handleClickBackStep = async () => {
   await getDocumentDraftOrDetail(documentId.value);
   switch (currentStep.value) {
      case 3:
         currentStep.value = 2;
         break;
      case 2:
         currentStep.value = 1;
         break;
      case 1:
         currentStep.value = 0;
         break;
      default:
         break;
   }
};


const stepperDirection = computed(() => (width.value <= 1024 ? "horizontal" : "vertical"));


watch(
   () => filesUpload.value,
   (value) => {
      for (let index = 0; index < value.length; index++) {
         const dataFile: IFileUpload = value[index] as IFileUpload;
         if (dataFile.fileType === FileVesselTypeEnum.shipParticulars) {
            console.log("dataFile on watch ", dataFile);
            shipParticulars.value = dataFile;
            shipParticularsFileName.value = dataFile.fileName;
            shipParticularsFilePreview.value = dataFile.preview;
            validateFileUpload(FileVesselTypeEnum.shipParticulars);
         }
         if (dataFile.fileType === FileVesselTypeEnum.shipRegistry) {
            shipRegistry.value = dataFile;
            shipRegistryFileName.value = dataFile.fileName;
            shipRegistryFilePreview.value = dataFile.preview;
            validateFileUpload(FileVesselTypeEnum.shipRegistry);
         }
         if (dataFile.fileType === FileVesselTypeEnum.internationTonnageCert) {
            internationTonnageCert.value = dataFile;
            internationTonnageCertFileName.value = dataFile.fileName;
            internationTonnageCertFilePreview.value = dataFile.preview;
            validateFileUpload(FileVesselTypeEnum.internationTonnageCert);
         }
         if (dataFile.fileType === FileVesselTypeEnum.last10Ports) {
            last10Ports.value = dataFile;
            last10PortsFileName.value = dataFile.fileName;
            last10PortsFilePreview.value = dataFile.preview;
            validateFileUpload(FileVesselTypeEnum.last10Ports);
         }
         if (dataFile.fileType === FileVesselTypeEnum.powerOfAttorney) {
            powerOfAttorney.value = dataFile;
            powerOfAttorneyFileName.value = dataFile.fileName;
            powerOfAttorneyFilePreview.value = dataFile.preview;
            validateFileUpload(FileVesselTypeEnum.powerOfAttorney);
         }
      }
   }
);

watch(
   () => isConfirmDialogOpen.value,
   (value) => {
      if (value) {
         startCountdown();
      }
   }
);
</script>
