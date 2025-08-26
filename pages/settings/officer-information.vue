<template>
<div id="ship-agent-information">
   <UForm :schema="shipAgentInformationSchema" :state="formGroup" @submit="onSubmit">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6">
         <div>
            <h1 class="font-anuphan-semi-bold text-lg text-grayy-400">{{ $t("officer_information_title") }}</h1>
            <div class="mt-1 text-[#667085] text-sm">{{ $t("officer_information_subtitle") }}</div>
         </div>
         <SaveButton type="submit" class="mt-4 sm:mt-0" />
      </div>
      <div class="mt-6">
         <div class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
            <div class="sm:mt-2">
               <span class="text-grayy-400 text-sm font-anuphan-semi-bold">{{ $t("contact_fullname") }}</span>
               <span class="text-[#F00]">*</span>
            </div>
            <Input name="fullName" class="w-full max-w-full sm:max-w-[512px]" :placeholder="$t('settings_ship_agent_information_contact_name')" v-model="formGroup.fullName" required />
         </div>
         <div class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
            <div class="sm:mt-2">
               <span class="text-grayy-400 text-sm font-anuphan-semi-bold">{{ $t("settings_ship_agent_information_tel_number") }}</span>
               <span class="text-[#F00]">*</span>
            </div>
            <Input
               name="phone"
               class="w-full max-w-full sm:max-w-[512px]"
               @input="(e) => onInputNumber(e, 'phone')"
               :placeholder="$t('settings_ship_agent_information_tel_number')"
               v-model="formGroup.phone"
               required
            />
         </div>
         <div class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid pt-5">
            <div class="font-anuphan-semi-bold text-sm text-grayy-400 sm:mt-2">{{ $t("phone_number_backup") }}</div>
            <input
               type="text"
               class="w-full max-w-full sm:max-w-[512px] p-[8px_14px] h-[36px] border border-solid border-[#9477B6] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-md text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9477B6]"
               v-model="formGroup.mobilePhone"
               @input="(e) => onInputNumber(e, 'mobilePhone')"
               maxlength="11"
               :placeholder="$t('phone_number_backup')"
            />
         </div>
      </div>
   </UForm>
</div>
   <DialogConfirm
      icon="warning"
      :title="$t('save_title')"
      :desc="$t('save_description')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogOpen"
      :dialogCancel="dialogCancel"
      :dialogConfirm="handleFormSubmit"
   />
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import FileDropzoneSettings from "~/components/settings/fileDropzoneSettings.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import SaveButton from "~/components/button/save.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";

import type { IFileUploadSetting, IUpdateUser } from "~/core/interfaces/ISetting";
import useAdminService from "~/core/services/adminService";
import useSettingService from "~/core/services/settingService";

const { t } = useI18n();
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const shipAgentInformationSchema = z.object({
   fullName: z.string().min(1, { message: t("required") }),
   phone: z.string().min(1, { message: t("required") }),
});

import { ref } from "vue";
interface FileDropzoneSettingsInstance {
   clearController: () => void;
}
const fileDropzoneSettingRef = ref<FileDropzoneSettingsInstance | null>(null);

const { locale } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const adminService = useAdminService();
const { getUserDetail, updateUser } = useSettingService();

const formGroup = ref<IUpdateUser>({
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

onMounted(() => {
   const profileUser = typeof authStore.profileUser === "string" ? JSON.parse(authStore.profileUser) : authStore.profileUser;

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
         //uploadFiles: resp.data?.uploadFiles || [],
      };
   }
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof shipAgentInformationSchema>>) {
   setDialog(true);
}

const handleFormSubmit = async () => {
   const filteredArray = formGroup.value.uploadFiles
      ?.filter((item: IFileUploadSetting) => {
         if (item.id) {
            return true;
         }
         if (item.mockId) {
            return item.progress === 100 && item.isError === false;
         }
         return false;
      })
      .map((item: IFileUploadSetting) => {
         if (item.mockId) {
            const { mockId, progress, ...rest } = item;
            return rest;
         }
         return item;
      });

   formGroup.value = {
      ...formGroup.value,
      uploadFiles: filteredArray,
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
};

const getFiles = (value: any) => {
   formGroup.value.uploadFiles = value.map(({ isError, ...i }: { isError: boolean }) => ({ ...i, extension: "application/xml" }));
};

const onInputNumber = (event: any, type: string) => {
   const value = event.target.value;
   const numericValue = value.replace(/\D/g, "");
   if (type === "phone") {
      formGroup.value.phone = numericValue.slice(0, 11);
   }
   if (type === "mobilePhone") {
      formGroup.value.mobilePhone = numericValue.slice(0, 11);
   }
};
</script>
