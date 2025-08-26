<template>
   <main class="relative h-screen bg-[url('~/assets/images/login/bg.jpg')] bg-cover bg-center">
      <div class="lang absolute top-4 right-4 flex gap-1">
         <ToggleLanguage />
      </div>
      <div :class="`h-screen flex p-5 md:p-10 justify-center overflow-auto`">
         <div v-if="!isErrorVerifyTokenEMail" class="w-full lg:w-[667px]">
            <div class="rounded-[20px] bg-white m-auto p-[24px]">
               <div @click="onClickBackToLogin" id="forget-password"
                  class="cursor-pointer mb-6 text-[#704A9E] flex items-center">
                  <NuxtIcon name="angle-left" />
                  <div class="ml-2">{{ $t('back_to_login') }}</div>
               </div>
               <div class="text-center flex flex-col items-center">
                  <img :src="Logo" alt="SWU Logo" class="w-[48px]" />
                  <h1 class="font-anuphan-semi-bold text-[30px] my-6">{{ $t('create_an_account') }}</h1>
               </div>

               <div class="mb-6">
                  <Stepper :currentStep="currentStep" :steps="steps" />
               </div>
               <UForm :state="formRegister" @submit="onSubmit">
                  <InfoFormDetail v-if="currentStep === 0" :formGroup="formRegister" :is-other-country="isOtherCountry"
                     :validate="validate" :getError="getError" />
                  <UButton v-if="currentStep === 0" size="xl" variant="solid" label="ต่อไป" block
                     class="rounded-lg mt-6 font-anuphan-semi-bold" type="submit" />
               </UForm>

               <!-- <UploadYourDocument :required="isRequiredFile" :files-value="filesUpload"
                  :getFiles="(value: any) => filesUpload = value" /> -->
               <div v-if="currentStep === 1" class="mt-6">
                  <h2 class="font-bold text-grayy-400">{{ $t('document_content.title2') }}</h2>
                  <div class="flex justify-between">
                     <span class="text-grayy-500 mr-2 my-3">{{ $t('document_content.upload_caption_2') }}</span>
                     <a :href="downloadUrl" class="flex items-center cursor-pointer" target="_blank">
                        <span class="text-primaryy-500 mr-2 my-3">{{ $t('document_content.download_example') }}</span>
                        <NuxtIcon name="download" />
                     </a>
                  </div>
                  <div v-if="formRegister.personType === 'corporate'" class="grid gap-4 mt-4">
                     <FileUpload uploadType="register" id="legalEntityCert"
                        :label="$t('document_content.legal_entity_cert_text')" name="legalEntityCert" required
                        v-model="legalEntityCert" :type="FileRegisterTypeEnum.legalEntityCert"
                        :value-file="legalEntityCert" is-document-type :onFileUpload="onFileUpload"
                        :file-name="legalEntityCertFileName" :file-preview="legalEntityCertFilePreview"
                        :is-required="isRequiredFilelegalEntityCert"
                        :onRemoveFile="(value: any) => legalEntityCert = value" />
                     <FileUpload uploadType="register" id="powerOfAttorney"
                        :label="$t('document_content.power_of_attorney_text_2')" name="powerOfAttorney" required
                        v-model="powerOfAttorney" :type="FileRegisterTypeEnum.powerOfAttorney"
                        :value-file="powerOfAttorney" is-document-type :onFileUpload="onFileUpload"
                        :file-name="powerOfAttorneyFileName" :file-preview="powerOfAttorneyFilePreview"
                        :is-required="isRequiredFilepowerOfAttorney"
                        :onRemoveFile="(value: any) => powerOfAttorney = value" />
                     <FileUpload uploadType="register" id="powerOfAttorneyNationId"
                        :label="$t('document_content.power_of_attorney_national_id_text')"
                        name="powerOfAttorneyNationId" required v-model="powerOfAttorneyNationId"
                        :type="FileRegisterTypeEnum.powerOfAttorneyNationId" :value-file="powerOfAttorneyNationId"
                        is-document-type :onFileUpload="onFileUpload" :file-name="powerOfAttorneyNationIdFileName"
                        :file-preview="powerOfAttorneyNationIdFilePreview"
                        :is-required="isRequiredFilepowerOfAttorneyNationId"
                        :onRemoveFile="(value: any) => powerOfAttorneyNationId = value" />
                  </div>
                  <div v-else class="grid gap-4 mt-4">
                     <FileUpload uploadType="register" id="nationalId"
                        :label="$t('document_content.national_id_upload_text')" name="nationalId" required
                        v-model="nationalId" :type="FileRegisterTypeEnum.nationalId" :value-file="nationalId"
                        is-document-type :onFileUpload="onFileUpload" :file-name="nationalIdFileName"
                        :file-preview="nationalIdFilePreview" :is-required="isRequiredFilenationalId"
                        :onRemoveFile="(value: any) => nationalId = value" />
                     <FileUpload uploadType="register" id="powerOfAttorney"
                        :label="$t('document_content.power_of_attorney_text')" name="powerOfAttorney" required
                        v-model="powerOfAttorney" :type="FileRegisterTypeEnum.powerOfAttorney"
                        :value-file="powerOfAttorney" is-document-type :onFileUpload="onFileUpload"
                        :file-name="powerOfAttorneyFileName" :file-preview="powerOfAttorneyFilePreview"
                        :is-required="isRequiredFilepowerOfAttorney"
                        :onRemoveFile="(value: any) => powerOfAttorney = value" />

                  </div>
               </div>

               <TermAndCondition v-if="currentStep === 2" :onChangeAcceptTerm="(value: any) => isAcceptTerm = value" />

               <div v-if="[1, 2].includes(currentStep)" class="grid grid-cols-2 mt-6 gap-4">
                  <UButton @click="handleClickBack(currentStep)" size="xl" color="gray" variant="outline"
                     :label="$t('back')" block type="button" icon="i-heroicons-chevron-left-solid" />
                  <UButton @click="handleClickNextStep(currentStep)" size="xl" variant="solid"
                     :disabled="!isAcceptTerm && currentStep === 2"
                     :label="currentStep === 2 ? $t('submit') : $t('next')" block type="button" />
               </div>
               <div v-if="isRegisterSuccess" class="text-center flex flex-col items-center justify-center">
                  <div class="w-full lg:w-3/5">
                     <p class="text-primaryy-500 font-bold">{{ $t('register_success_title') }}</p>
                     <p>
                        {{ $t('register_success_message') }}
                     </p>
                  </div>

               </div>
            </div>

         </div>
         <div v-else class="w-1/2 flex items-center">
            <div class="rounded-[20px] bg-white m-auto p-[24px] max-w-[414px]">
               <div @click="onClickBackToLogin" id="forget-password"
                  class="cursor-pointer mb-6 text-primaryy-500 flex items-center">
                  <!-- <img :src="AngleLeft" alt="UserIcon" /> -->
                  <NuxtIcon name="angle-left" />
                  <div class="ml-2">{{ $t('back_to_login') }}</div>
               </div>
               <div class="text-center flex flex-col items-center">
                  <img :src="Logo" alt="SWU Logo" class="w-[48px]" />
                  <h1 class="font-anuphan-semi-bold text-[30px] my-6">{{ $t('create_an_account') }}</h1>
               </div>
               <p class="mb-10 text-error-500 text-center">
                  {{ $t(errorVerifyTokenEMail) }}
               </p>
            </div>

         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">

import Loading from "~/components/loading.vue";
import Logo from "~/assets/images/logo-mini.png";

import InfoFormDetail from "~/components/register-form/infoFormDetail.vue";

const { t, locale } = useI18n();

const config = useRuntimeConfig();
const downloadUrl = config.public.apiBaseUrl + '/downloads/agent-template';
definePageMeta({
   layout: false,
});

const isLoading = ref(false);
const currentStep = ref(0);
const steps = computed(() => [
   {
      label: t('register_step[0].step'),
      detail: t('register_step[0].detail'),
   },
   {
      label: t('register_step[1].step'),
      detail: t('register_step[1].detail'),
   },
   {
      label: t('register_step[2].step'),
      detail: t('register_step[2].detail'),
   }
])

import type { FormError, FormSubmitEvent } from "#ui/types";
import UploadYourDocument from "~/components/register-form/uploadYourDocument.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import TermAndCondition from "~/components/register-form/termAndCondition.vue";
import type { IRegisterRequest } from "~/core/interfaces/IRegisterRequest";
import type { IVerifyEmailRequest } from "~/core/interfaces/IVerifyEmailRequest";
import useAuthService from "~/core/services/authService";
import ToggleLanguage from "~/components/ui/toggleLanguage.vue";
import Stepper from "~/components/ui/Stepper.vue";
import FileUpload from "~/components/form/FileUpload.vue";
import { FileRegisterTypeEnum } from "~/utils/enums/FileRegisterTypeEnum";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";

const route = useRoute();
const { verifyEmail, registerUser } = useAuthService();
const query: any = route.query;
const token = query.token
const isOtherCountry = ref(false)
const filesUpload = ref<IFileUpload[]>([])
const nationalId = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const powerOfAttorney = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const legalEntityCert = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const powerOfAttorneyNationId = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });

const nationalIdFileName = ref<string>("");
const powerOfAttorneyFileName = ref<string>("");
const legalEntityCertFileName = ref<string>("");
const powerOfAttorneyNationIdFileName = ref<string>("");

const nationalIdFilePreview = ref<string>("");
const powerOfAttorneyFilePreview = ref<string>("");
const legalEntityCertFilePreview = ref<string>("");
const powerOfAttorneyNationIdFilePreview = ref<string>("");

const isRequiredFilenationalId = ref<boolean>(false);
const isRequiredFilepowerOfAttorney = ref<boolean>(false);
const isRequiredFilelegalEntityCert = ref<boolean>(false);
const isRequiredFilepowerOfAttorneyNationId = ref<boolean>(false);

const formRegister = reactive({
   email: '',
   password: '',
   confirmPassword: '',
   address: '',
   company: '',
   fullName: '',
   mobilePhone: '',
   personType: 'corporate',
   phone: '',
   countryId: null,
   provinceId: null,
   stageProvince: '',
   districtId: null,
   subDistrictId: null,
   tax: '',
   zipCode: '',
});

const errors = ref<FormError[]>([]);
const validate = (field: string, valueSelected: any = 0) => {
   const validationErrors: FormError[] = [];
   // Email validation
   if (field === 'email') {
      if (!formRegister.email) {
         validationErrors.push({ path: 'email', message: t('please_enter_a_value') });
      } else if (!regxEmail.test(formRegister.email)) {
         validationErrors.push({ path: 'email', message: t('email_format_validate_message') });
      }
   }

   // Password validation
   if (field === 'password') {
      if (!formRegister.password) {
         validationErrors.push({ path: 'password', message: t('please_enter_a_value') });
      } else if (!regxPassword.test(formRegister.password)) {
         validationErrors.push({ path: 'password', message: t('password_regex') });
      }
   }

   // Confirm Password validation
   if (field === 'confirmPassword') {
      if (!formRegister.confirmPassword) {
         validationErrors.push({ path: 'confirmPassword', message: t('please_enter_a_value') });
      } else if (formRegister.confirmPassword !== formRegister.password) {
         validationErrors.push({ path: 'confirmPassword', message: t('password_not_match') });
      }
   }

   // Company validation
   if (field === 'company') {
      if (!formRegister.company) {
         validationErrors.push({ path: 'company', message: t('please_enter_a_value') });
      }
   }

   // Full Name validation
   if (field === 'fullName') {
      if (!formRegister.fullName) {
         validationErrors.push({ path: 'fullName', message: t('please_enter_a_value') });
      }
   }

   // Phone validation
   if (field === 'phone') {
      if (!formRegister.phone) {
         validationErrors.push({ path: 'phone', message: t('please_enter_a_value') });
      } else if (!regxPhone.test(formRegister.phone)) {  // Replace with desired phone number validation
         validationErrors.push({ path: 'phone', message: t('phone_format_validate_message') });
      }
   }

   if (field === 'mobilePhone') {
      if (formRegister.mobilePhone) {
         if (!regxPhone.test(formRegister.mobilePhone)) {
            validationErrors.push({ path: 'mobilePhone', message: t('phone_format_validate_message') });
         }
      }
   }

   // Person Type validation
   if (field === 'personType') {
      if (!formRegister.personType) {
         validationErrors.push({ path: 'personType', message: t('please_enter_a_value') });
      }
   }

   // Country validation
   if (field === 'countryId') {
      formRegister.countryId = valueSelected || formRegister.countryId
      if (!formRegister.countryId) {
         validationErrors.push({ path: 'countryId', message: t('please_enter_a_value') });
      }
   }

   // Province validation (dependent on isOtherCountry)
   if (field === 'provinceId') {
      formRegister.provinceId = valueSelected || formRegister.provinceId
      if (!isOtherCountry.value && (!formRegister.provinceId)) {
         validationErrors.push({ path: 'provinceId', message: t('please_enter_a_value') });
      }
   }

   // District validation (dependent on isOtherCountry)
   if (field === 'districtId') {
      formRegister.districtId = valueSelected || formRegister.districtId
      if (!isOtherCountry.value && (!formRegister.districtId)) {
         validationErrors.push({ path: 'districtId', message: t('please_enter_a_value') });
      }
   }

   // SubDistrict validation (dependent on isOtherCountry)
   if (field === 'subDistrictId') {
      formRegister.subDistrictId = valueSelected || formRegister.subDistrictId
      if (!isOtherCountry.value && (!formRegister.subDistrictId)) {
         validationErrors.push({ path: 'subDistrictId', message: t('please_enter_a_value') });
      }
   }

   // Tax validation
   if (field === 'tax') {
      if (!formRegister.tax) {
         validationErrors.push({ path: 'tax', message: t('please_enter_a_value') });
      } else if (!regxNumber13Degit.test(formRegister.tax)) {  // Replace with desired phone number validation
         validationErrors.push({ path: 'tax', message: t('taxpayer_identification_not_correct') });
      }
   }

   // Zip Code validation
   if (field === 'zipCode') {
      if (!formRegister.zipCode) {
         validationErrors.push({ path: 'zipCode', message: t('please_enter_a_value') });
      }
   }

   // Stage Province validation (dependent on isOtherCountry)
   if (field === 'stageProvince') {
      if (isOtherCountry.value && !formRegister.stageProvince) {
         validationErrors.push({ path: 'stageProvince', message: t('please_enter_a_value') });
      }
   }

   // Full Name address
   if (field === 'address') {
      if (!formRegister.address) {
         validationErrors.push({ path: 'address', message: t('please_enter_a_value') });
      }
   }
   // Clear previous errors for the specific field and add the new error if any
   errors.value = errors.value.filter(err => err.path !== field);
   if (validationErrors.length) {
      errors.value.push(...validationErrors);
   }
}

const getError = (field: string) => {
   const error = errors.value.find(err => err.path === field);
   return error ? error.message : null;
};

const payload = ref<IRegisterRequest>({
   token: "",
   email: "",
   password: "",
   confirmPassword: "",
   address: "",
   company: "",
   fullName: "",
   mobilePhone: "",
   personType: "",
   phone: "",
   provinceId: null,
   stageProvince: "",
   districtId: null,
   subDistrictId: null,
   tax: "",
   zipCode: "",
   uploadFiles: [],
   countryId: null
})
const isAcceptTerm = ref(false)
const isRegisterSuccess = ref(false)
const isErrorVerifyTokenEMail = ref(false)
const errorVerifyTokenEMail = ref('')
const isRequiredFile = ref(false)

onMounted(async () => {
   if (token) {
      const payloadVerify: IVerifyEmailRequest = { token }
      const resp = await verifyEmail({ ...payloadVerify })
      if (resp.statusCode === 200) {
         payload.value = {
            ...payload.value,
            token: resp.data.token,
            email: resp.data.email
         }
         formRegister.email = resp.data.email
      } else {
         isErrorVerifyTokenEMail.value = true
         errorVerifyTokenEMail.value = 'email_verification_failed'
      }
   } else {
      isErrorVerifyTokenEMail.value = true
      errorVerifyTokenEMail.value = 'email_verification_failed'
   }
})


async function onSubmit(event: FormSubmitEvent<any>) {
   validate('email')
   validate('password')
   validate('confirmPassword')
   validate('company')
   validate('fullName')
   validate('phone')
   validate('mobilePhone')
   validate('personType')
   validate('countryId')
   validate('provinceId')
   validate('districtId')
   validate('subDistrictId')
   validate('tax')
   validate('zipCode')
   validate('stageProvince')
   validate('address')
   if (errors.value.length === 0) {
      const newPayload: IRegisterRequest = {
         ...payload.value,
         ...event.data,
      }
      payload.value = { ...newPayload }
      currentStep.value = 1
   }
}

const onClickBackToLogin = () => {
   navigateTo("/login");
}

const handleClickNextStep = async (step: number) => {
   switch (step) {
      case 1:
         if (formRegister.personType === 'corporate') {
            if (!legalEntityCert.value.fileName || !powerOfAttorney.value.fileName || !powerOfAttorneyNationId.value.fileName) {
               isRequiredFilelegalEntityCert.value = !legalEntityCert.value.fileName;
               isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
               isRequiredFilepowerOfAttorneyNationId.value = !powerOfAttorneyNationId.value.fileName;
            } else {
               isRequiredFilelegalEntityCert.value = false;
               isRequiredFilepowerOfAttorney.value = false;
               isRequiredFilepowerOfAttorneyNationId.value = false;
               currentStep.value = 2;
            }
         } else {
            if (!nationalId.value.fileName || !powerOfAttorney.value.fileName) {
               isRequiredFilenationalId.value = !nationalId.value.fileName;
               isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
            } else {
               isRequiredFilenationalId.value = false;
               isRequiredFilepowerOfAttorney.value = false;
               currentStep.value = 2;
            }
         }
         break;
      default:
         // finished all steps
         isLoading.value = true
         const uploadFiles = filesUpload.value.filter((e: any) => !e.isError &&
            (formRegister.personType === 'corporate'
               ? [FileRegisterTypeEnum.legalEntityCert, FileRegisterTypeEnum.powerOfAttorney, FileRegisterTypeEnum.powerOfAttorneyNationId].includes(e.fileType)
               : [FileRegisterTypeEnum.nationalId, FileRegisterTypeEnum.powerOfAttorney].includes(e.fileType))).map((file: any) => ({
                  filePath: file.filePath,
                  fileName: file.fileName,
                  extension: 'application/xml',
                  size: file.size,
                  fileType: file.fileType
               }))
         const resp = await registerUser({ ...payload.value, uploadFiles: [...uploadFiles] })
         if (resp.statusCode === 200) {
            isRegisterSuccess.value = true
            currentStep.value = 3
         }
         isLoading.value = false
         break;
   }
}

const handleClickBack = (step: number) => {
   switch (step) {
      case 2:
         // validate form here
         currentStep.value = 1;
         break;
      case 1:
         if (formRegister.personType === 'corporate') {
            isRequiredFilelegalEntityCert.value = !legalEntityCert.value.fileName;
            isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
            isRequiredFilepowerOfAttorneyNationId.value = !powerOfAttorneyNationId.value.fileName;
         } else {
            isRequiredFilenationalId.value = !nationalId.value.fileName;
            isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
         }
         currentStep.value = 0;
         break;
      default:
         // finished all steps
         break;
   }
}

const replaceByFileType = (
   referenceArray: IFileUpload[],
   newObject: IFileUpload
): IFileUpload[] =>
   referenceArray.map(item =>
      item.fileType === newObject.fileType
         ? { ...newObject }
         : item
   ).concat(referenceArray.some(item => item.fileType === newObject.fileType) ? [] : [newObject]);
const onFileUpload = (value: any) => {
   const updatedFiles = replaceByFileType(filesUpload.value as IFileUpload[], value)
   filesUpload.value = updatedFiles
}

const validateFileUpload = (field: FileRegisterTypeEnum) => {
   if (formRegister.personType === 'corporate') {
      if (field === FileRegisterTypeEnum.legalEntityCert) {
         isRequiredFilelegalEntityCert.value = !legalEntityCert.value.fileName;
      }
      if (field === FileRegisterTypeEnum.powerOfAttorney) {
         isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
      }
      if (field === FileRegisterTypeEnum.powerOfAttorneyNationId) {
         isRequiredFilepowerOfAttorneyNationId.value = !powerOfAttorneyNationId.value.fileName;
      }
   } else {
      if (field === FileRegisterTypeEnum.nationalId) {
         isRequiredFilenationalId.value = !nationalId.value.fileName;
      }
      if (field === FileRegisterTypeEnum.powerOfAttorney) {
         isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
      }
   }
};

watch(
   () => filesUpload.value.length,
   (files) => {
      isRequiredFile.value = files > 0 ? false : true
   }
);

watch(
   () => formRegister.countryId,
   (value) => {
      isOtherCountry.value = value !== 219 ? true : false
      // registerSchema.value = createSchema(value !== 219 ? true : false)
      formRegister.provinceId = value !== 219 ? null : formRegister.provinceId
      formRegister.districtId = value !== 219 ? null : formRegister.districtId
      formRegister.subDistrictId = value !== 219 ? null : formRegister.subDistrictId
      formRegister.stageProvince = value !== 219 ? formRegister.stageProvince : ''
   }
);

watch(
   () => locale.value,
   () => {
      // registerSchema.value = createSchema(isOtherCountry.value)
      if (getError('email')) {
         validate('email')
      }
      if (getError('password')) {
         validate('password')
      }
      if (getError('confirmPassword')) {
         validate('confirmPassword')
      }
      if (getError('company')) {
         validate('company')
      }
      if (getError('fullName')) {
         validate('fullName')
      }
      if (getError('phone')) {
         validate('phone')
      }
      if (getError('mobilePhone')) {
         validate('mobilePhone')
      }
      if (getError('personType')) {
         validate('personType')
      }
      if (getError('countryId')) {
         validate('countryId')
      }
      if (getError('provinceId')) {
         validate('provinceId')
      }
      if (getError('districtId')) {
         validate('districtId')
      }

      if (getError('subDistrictId')) {
         validate('subDistrictId')
      }

      if (getError('tax')) {
         validate('tax')
      }

      if (getError('zipCode')) {
         validate('zipCode')
      }

      if (getError('stageProvince')) {
         validate('stageProvince')
      }

      if (getError('address')) {
         validate('address')
      }

   }
);

watch(
   () => nationalId.value,
   (value) => {
      // remove from uploadfile
      if (value === null) {
         const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.nationalId)
         if (findFileIndex !== -1) {
            filesUpload.value.splice(findFileIndex, 1)
         }
         nationalId.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
         nationalIdFileName.value = ''
         nationalIdFilePreview.value = ''
      }
   }
);

watch(
   () => powerOfAttorney.value,
   (value) => {
      // remove from uploadfile
      if (value === null) {
         const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.powerOfAttorney)
         if (findFileIndex !== -1) {
            filesUpload.value.splice(findFileIndex, 1)
         }
         powerOfAttorney.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
         powerOfAttorneyFileName.value = ''
         powerOfAttorneyFilePreview.value = ''
      }
   }
);

watch(
   () => legalEntityCert.value,
   (value) => {
      // remove from uploadfile
      if (value === null) {
         const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.legalEntityCert)
         if (findFileIndex !== -1) {
            filesUpload.value.splice(findFileIndex, 1)
         }
         legalEntityCert.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
         legalEntityCertFileName.value = ''
         legalEntityCertFilePreview.value = ''
      }
   }
);

watch(
   () => powerOfAttorneyNationId.value,
   (value) => {
      // remove from uploadfile
      if (value === null) {
         const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.powerOfAttorneyNationId)
         if (findFileIndex !== -1) {
            filesUpload.value.splice(findFileIndex, 1)
         }
         powerOfAttorneyNationId.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
         powerOfAttorneyNationIdFileName.value = ''
         powerOfAttorneyNationIdFilePreview.value = ''
      }
   }
);

watch(
   () => filesUpload.value,
   (value) => {
      for (let index = 0; index < value.length; index++) {
         const dataFile: IFileUpload = value[index] as IFileUpload;
         if (dataFile.fileType === FileRegisterTypeEnum.nationalId) {
            nationalId.value = dataFile;
            nationalIdFileName.value = dataFile.fileName;
            nationalIdFilePreview.value = dataFile.preview;
            validateFileUpload(FileRegisterTypeEnum.nationalId);
         }
         if (dataFile.fileType === FileRegisterTypeEnum.powerOfAttorney) {
            powerOfAttorney.value = dataFile;
            powerOfAttorneyFileName.value = dataFile.fileName;
            powerOfAttorneyFilePreview.value = dataFile.preview;
            validateFileUpload(FileRegisterTypeEnum.powerOfAttorney);
         }
         if (dataFile.fileType === FileRegisterTypeEnum.legalEntityCert) {
            legalEntityCert.value = dataFile;
            legalEntityCertFileName.value = dataFile.fileName;
            legalEntityCertFilePreview.value = dataFile.preview;
            validateFileUpload(FileRegisterTypeEnum.legalEntityCert);
         }
         if (dataFile.fileType === FileRegisterTypeEnum.powerOfAttorneyNationId) {
            powerOfAttorneyNationId.value = dataFile;
            powerOfAttorneyNationIdFileName.value = dataFile.fileName;
            powerOfAttorneyNationIdFilePreview.value = dataFile.preview;
            validateFileUpload(FileRegisterTypeEnum.powerOfAttorneyNationId);
         }
      }
   }
);

</script>
