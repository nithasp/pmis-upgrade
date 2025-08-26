<template>
  <div id="ship-agent-information">
    <UForm :schema="shipAgentInformationSchema" :state="formGroup" @submit="onSubmit">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 mb-5">
        <div>
          <h1 class="font-anuphan-semi-bold text-lg text-grayy-400">
            {{ $t("settings_ship_agent_information_title") }}
          </h1>
          <div class="mt-1 text-[#667085] text-sm">
            {{ $t("settings_ship_agent_information_subtitle") }}
          </div>
        </div>
        <SaveButton type="submit" class="mt-4 sm:mt-0" />
      </div>
      <div class="mt-[21px]">
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
          <div class="sm:mt-2">
            <span class="font-anuphan-semi-bold text-sm text-grayy-400">{{
              $t("settings_ship_agent_information_person_type") }}</span>
            <span class="text-[#F00]">*</span>
          </div>
          <USelectMenu class="max-w-[512px]" variant="outline" color="purple" v-model="formGroup.personType"
            :options="personTypeOption" value-attribute="id" option-attribute="name" placeholder="เลือก" :ui="{
              base: 'h-[36px]',
            }" />
        </div>
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
          <div class="sm:mt-2">
            <span class="font-anuphan-semi-bold text-sm text-grayy-400"> {{ $t("taxpayer_identification_no") }} </span>
            <span class="text-[#F00]">*</span>
          </div>
          <Input name="tax" class="max-w-[512px]" :placeholder="$t('taxpayer_identification_no')"
            v-model="formGroup.tax" />
        </div>
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
          <div class="sm:mt-2">
            <span class="font-anuphan-semi-bold text-sm text-grayy-400">{{
              $t("settings_ship_agent_information_company_name") }}</span>
            <span class="text-[#F00]">*</span>
          </div>
          <Input name="company" class="max-w-[512px]" placeholder="ชื่อบริษัท" v-model="formGroup.company" />
        </div>
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
          <div class="sm:mt-2">
            <span class="font-anuphan-semi-bold text-sm text-grayy-400">{{
              $t("settings_ship_agent_information_contact_name") }}</span>
            <span class="text-[#F00]">*</span>
          </div>
          <Input name="fullName" class="max-w-[512px]" placeholder="ชื่อ-สกุลผู้ติดต่อ" v-model="formGroup.fullName" />
        </div>
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
          <div class="sm:mt-2">
            <span class="font-anuphan-semi-bold text-sm text-grayy-400">{{
              $t("settings_ship_agent_information_tel_number") }}</span>
            <span class="text-[#F00]">*</span>
          </div>
          <Input name="phone" class="max-w-[512px]" :placeholder="$t('settings_ship_agent_information_tel_number')"
            v-model="formGroup.phone" />
        </div>
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid pt-5">
          <div class="sm:mt-2">
            <span class="font-anuphan-semi-bold text-sm text-grayy-400">{{ $t("phone_number_backup") }}</span>
            <span class="text-[#F00]">*</span>
          </div>
          <Input name="mobilePhone" class="mb-5 max-w-[512px]" :placeholder="$t('phone_number_backup')"
            v-model="formGroup.mobilePhone" />
        </div>
        <div class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid pt-5">
          <div>
            <h2 class="font-anuphan-semi-bold text-sm text-grayy-400">
              {{ $t("document_content.title") }}
            </h2>
            <!-- <ul class="text-sm list-decimal pl-6 space-y-0.5 text-grayy-500 mt-1">
              <li>{{ $t("document_content.list[0]") }}</li>
              <li>{{ $t("document_content.list[1]") }}</li>
              <li>{{ $t("document_content.list[2]") }}</li>
              <li>{{ $t("document_content.list[3]") }}</li>
              <li>{{ $t("document_content.list[4]") }}</li>
            </ul> -->
            <div class="flex justify-start">
              <div class="flex items-center cursor-pointer">
                <a :href="downloadUrl" class="text-sm text-primaryy-500 mr-2 my-3" target="_blank">
                  {{ $t("document_content.download_example") }}
                </a>
                <NuxtIcon name="download" />
              </div>
            </div>
          </div>
          <div class="max-w-[512px]">
            <!-- <FileDropzoneSettings :error="errorMessageUploadFile" :getFiles="getFiles"
              :filesValue="formGroup?.uploadFiles"
              :errorFromUpload="(message: string) => errorMessageUploadFile = message" ref="fileDropzoneSettingRef" /> -->
            <div id="containerUpload">
              <div class="flex justify-end">
                <span class="font-anuphan-semi-bold text-sm text-grayy-500">{{
                  $t('document_content.upload_caption_2') }}</span>
              </div>
              <div v-if="formGroup.personType === 'corporate'" class="grid gap-4 mt-4">
                <FileUpload uploadType="register" id="legalEntityCert"
                  :label="$t('document_content.legal_entity_cert_text')" name="legalEntityCert" required
                  v-model="legalEntityCert" :type="FileRegisterTypeEnum.legalEntityCert" :value-file="legalEntityCert"
                  is-document-type :onFileUpload="onFileUpload" :file-name="legalEntityCertFileName"
                  :file-preview="legalEntityCertFilePreview" :is-required="isRequiredFilelegalEntityCert"
                  :onRemoveFile="(value: any) => legalEntityCert = value" />
                <FileUpload uploadType="register" id="powerOfAttorney"
                  :label="$t('document_content.power_of_attorney_text_2')" name="powerOfAttorney" required
                  v-model="powerOfAttorney" :type="FileRegisterTypeEnum.powerOfAttorney" :value-file="powerOfAttorney"
                  is-document-type :onFileUpload="onFileUpload" :file-name="powerOfAttorneyFileName"
                  :file-preview="powerOfAttorneyFilePreview" :is-required="isRequiredFilepowerOfAttorney"
                  :onRemoveFile="(value: any) => powerOfAttorney = value" />
                <FileUpload uploadType="register" id="powerOfAttorneyNationId"
                  :label="$t('document_content.power_of_attorney_national_id_text')" name="powerOfAttorneyNationId"
                  required v-model="powerOfAttorneyNationId" :type="FileRegisterTypeEnum.powerOfAttorneyNationId"
                  :value-file="powerOfAttorneyNationId" is-document-type :onFileUpload="onFileUpload"
                  :file-name="powerOfAttorneyNationIdFileName" :file-preview="powerOfAttorneyNationIdFilePreview"
                  :is-required="isRequiredFilepowerOfAttorneyNationId"
                  :onRemoveFile="(value: any) => powerOfAttorneyNationId = value" />
              </div>
              <div v-else class="grid gap-4 mt-4">
                <FileUpload uploadType="register" id="nationalId"
                  :label="$t('document_content.national_id_upload_text')" name="nationalId" required
                  v-model="nationalId" :type="FileRegisterTypeEnum.nationalId" :value-file="nationalId" is-document-type
                  :onFileUpload="onFileUpload" :file-name="nationalIdFileName" :file-preview="nationalIdFilePreview"
                  :is-required="isRequiredFilenationalId" :onRemoveFile="(value: any) => nationalId = value" />
                <FileUpload uploadType="register" id="powerOfAttorney"
                  :label="$t('document_content.power_of_attorney_text')" name="powerOfAttorney" required
                  v-model="powerOfAttorney" :type="FileRegisterTypeEnum.powerOfAttorney" :value-file="powerOfAttorney"
                  is-document-type :onFileUpload="onFileUpload" :file-name="powerOfAttorneyFileName"
                  :file-preview="powerOfAttorneyFilePreview" :is-required="isRequiredFilepowerOfAttorney"
                  :onRemoveFile="(value: any) => powerOfAttorney = value" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </div>
  <DialogConfirm icon="warning" :title="$t('save_title')" :desc="$t('save_description')" :labelConfirm="$t('confirm')"
    :isDialogOpen="isDialogOpen" :dialogCancel="dialogCancel" :dialogConfirm="dialogConfirmSubmit" />
  <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen"
    :setDialog="handleCloseSuccessDialog" />
  <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Loading from "~/components/loading.vue";
import FileDropzoneSettings from "~/components/settings/fileDropzoneSettings.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import SaveButton from "~/components/button/save.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";

import type {
  IUpdateUserAgent,
} from "~/core/interfaces/ISetting";
import useAdminService from "~/core/services/adminService";
import useSettingService from "~/core/services/settingService";

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const { t } = useI18n();
const shipAgentInformationSchema = z.object({
  personType: z.string().min(1, { message: t("required") }),
  tax: z.string().min(1, { message: t("required") }),
  company: z.string().min(1, { message: t("required") }),
  fullName: z.string().min(1, { message: t("required") }),
  phone: z.string().min(1, { message: t("required") }),
  mobilePhone: z.string().min(1, { message: t("required") }),
});

import { ref } from "vue";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";
import { FileRegisterTypeEnum } from "~/utils/enums/FileRegisterTypeEnum";
import FileUpload from "~/components/form/FileUpload.vue";
interface FileDropzoneSettingsInstance {
  clearController: () => void;
}
const fileDropzoneSettingRef = ref<FileDropzoneSettingsInstance | null>(null);

const config = useRuntimeConfig();
const downloadUrl = config.public.apiBaseUrl + '/downloads/agent-template';
const { locale } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const adminService = useAdminService();
const { getUserDetail, updateUser } = useSettingService();
const formGroup = ref<IUpdateUserAgent>({
  personType: "",
  tax: "",
  company: "",
  fullName: "",
  phone: "",
  mobilePhone: "",
  uploadFiles: [],
});
const personTypeOption = [
  {
    id: "corporate",
    name: `${locale.value === "en" ? "Corporate" : "นิติบุคคล"}`,
  },
  {
    id: "personal",
    name: `${locale.value === "en" ? "Personal" : "บุคคลธรรมดา"}`,
  },
];
const isLoading = ref<boolean>(false);
const errorMessageUploadFile = ref("");
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

onMounted(() => {
  const profileUser =
    typeof authStore.profileUser === "string"
      ? JSON.parse(authStore.profileUser)
      : authStore.profileUser;

  fetchUserDetail(profileUser?.id);
});

const isDialogOpen = ref(false);
const setDialog = (status: boolean) => {
  isDialogOpen.value = status;
};
const dialogCancel = () => {
  setDialog(false);
};

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
  isDialogSuccessOpen.value = status;
};

// const getVesselAgenciesDetail = async (userId: number) => {
//    const resp = await adminService.getVesselAgenciesDetail(userId);
//    if (resp.statusCode === 200) {
//       formGroup.value = {
//          ...resp?.data,
//       };
//    }
// };

const fetchUserDetail = async (userId: number) => {
  const resp = await getUserDetail(userId);
  if (resp.statusCode === 200) {
    formGroup.value = {
      ...resp?.data,
      zipCodeTemp: resp.data?.zipCode,
      uploadFiles: resp.data?.uploadFiles ? resp.data?.uploadFiles : [],
    };
    filesUpload.value = resp.data?.uploadFiles ? resp.data?.uploadFiles : [];
  }
};

const dialogConfirmSubmit = async () => {
  // const filteredArray = formGroup.value.uploadFiles
  //   ?.filter((item: IFileUploadSetting) => {
  //     if (item.id) {
  //       return true;
  //     }
  //     if (item.mockId) {
  //       return item.progress === 100 && item.isError === false;
  //     }
  //     return false;
  //   })
  //   .map((item: IFileUploadSetting) => {
  //     if (item.mockId) {
  //       const { mockId, progress, ...rest } = item;
  //       return rest;
  //     }
  //     return item;
  //   });
  const uploadFiles = filesUpload.value.filter((e: any) => !e.isError
    && (formGroup.value.personType === 'corporate'
      ? [FileRegisterTypeEnum.legalEntityCert, FileRegisterTypeEnum.powerOfAttorney, FileRegisterTypeEnum.powerOfAttorneyNationId].includes(e.fileType)
      : [FileRegisterTypeEnum.nationalId, FileRegisterTypeEnum.powerOfAttorney].includes(e.fileType)))
    .map((file: any) => ({
      id: file.id,
      filePath: file.filePath,
      fileName: file.fileName,
      extension: file.extension ? file.extension : 'application/xml',
      size: file.size,
      fileType: file.fileType,
      document_file_type: file.document_file_type || '',
      preview: file.preview || ''
    }))
  formGroup.value = {
    ...formGroup.value,
    uploadFiles: uploadFiles,
  };

  isLoading.value = true;
  const resp = await updateUser(formGroup.value);
  if (resp.statusCode === 200) {
    fetchUserDetail(resp.data?.id);
    setDialog(false);
    isDialogSuccessOpen.value = true;
  } else {
    console.error("update user error:", resp);
    toast.add({ title: resp?.message, color: "red" });
    setDialog(false);
  }
  isLoading.value = false;
  fileDropzoneSettingRef.value?.clearController();
}

async function onSubmit(
  event: FormSubmitEvent<z.output<typeof shipAgentInformationSchema>>
) {
  setDialog(true);
}

const getFiles = (value: any) => {
  formGroup.value.uploadFiles = value.map(
    ({ isError, ...i }: { isError: boolean }) => ({
      ...i,
      extension: "application/xml",
    })
  );
};

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
  if (formGroup.value.personType === 'corporate') {
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
