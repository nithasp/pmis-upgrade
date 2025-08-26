<template>
   <div id="general">
      <UForm :schema="generalSchema" :state="formGroup" @submit="onSubmit">
         <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 mb-5">
            <div>
               <h1 class="font-anuphan-semi-bold text-lg text-grayy-400">{{ $t("settings_general_title") }}</h1>
               <div class="mt-1 text-[#667085] text-sm">{{ $t("settings_general_subtitle") }}</div>
            </div>
            <SaveButton type="submit" class="mt-4 sm:mt-0" />
         </div>
         <div class="mt-6">
            <div
               class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-grayy-400">{{ $t("email") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               
               <div
                  class="w-full max-w-full sm:max-w-[512px]">
                  <Input name="email" class="w-full" placeholder="me@example.com" v-model="formGroup.email"
                     customIcon="user" />
               </div>
            </div>
            <div
               class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] items-center border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="font-anuphan-semi-bold text-sm text-grayy-400">{{ $t("password") }}</div>
               <ButtonChangePassword @click="setDialogChangePassword(true)" class="w-full sm:w-auto" type="button" />
            </div>
            <div
               class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] items-center border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="font-anuphan-semi-bold text-sm text-grayy-400">{{ $t("settings_general_type_of_usage_rights")
                  }}</div>
               <div class="text-sm text-grayy-400">{{ formGroup?.rightsType }}</div>
            </div>
            <div
               class="sm:grid sm:grid-cols-2 lg:grid-cols-[280px_1fr] items-center border-y-[#E4E7EC] border-t border-solid pt-5">
               <div class="font-anuphan-semi-bold text-sm text-grayy-400">{{ $t("settings_general_application_version")
                  }}</div>
               <div class="text-sm text-grayy-400">PMIS Version {{ deployment.version }}</div>
            </div>
         </div>
      </UForm>
   </div>
   <DialogChangePassword :isDialogOpen="isDialogChangePasswordOpen" :dialogCancel="dialogCancel"
      :dialogConfirm="dialogConfirm" :setDialogChangePassword="setDialogChangePassword" />
   <DialogChangeEmail :isDialogOpen="isDialogChangeEmailOpen" :dialogCancel="dialogChangeEmailCancel"
      :dialogConfirm="dialogChangeEmailConfirm" :newEmail="newEmail" :userInfo="formGroup" />
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen"
      :setDialog="handleCloseSuccessDialog" />
   <DialogAlert :title="'เกิดข้อผิดพลาด'" :desc="'มีอีเมลนี้ในระบบแล้ว กรุณาลองใหม่อีกครั้ง'" type="danger"
      :isOpen="isDialogErrorsOpen" :setDialog="handleCloseErrorDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import DialogChangePassword from "~/components/dialog/settings/change-password.vue";
import ButtonChangePassword from "~/components/button/changePassword.vue";
import SaveButton from "~/components/button/save.vue";
import Input from "~/components/form/u-input.vue";
import DialogChangeEmail from "~/components/dialog/settings/change-email.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";

import useAdminService from "~/core/services/adminService";
import useSettingService from "~/core/services/settingService";
import type { IUpdateUser } from "~/core/interfaces/ISetting";

import deployment from "~/deployment.config.js";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const { t } = useI18n();
const generalSchema = z.object({ email: z
    .string()
    .min(1, { message: t("required") })
    .email({ message: t("email_invalid") })
});

const toast = useToast();
const authStore = useAuthStore();
const adminService = useAdminService();
const { getUserDetail, updateUser } = useSettingService();
const defaultEmail = ref<string>("");
const newEmail = ref<string | undefined>("");
const isLoading = ref<boolean>(false);

const formGroup = ref<IUpdateUser>({
   email: "",
   personType: "",
   rightsType: "",
});
const profileUser = ref<any>(null);

onMounted(() => {
   getProfileUser();
   fetchUserDetail(profileUser.value?.id);
});

// const getVesselAgenciesDetail = async (userId: number) => {
//    const resp = await adminService.getVesselAgenciesDetail(userId);
//    if (resp.statusCode === 200) {
//       formGroup.value = {
//          ...resp?.data,
//       };
//       defaultEmail.value = resp.data?.email;
//    }
// };

const fetchUserDetail = async (userId: number) => {
   const resp = await getUserDetail(userId);
   if (resp.statusCode === 200) {
      formGroup.value = {
         ...resp?.data,
         zipCodeTemp: resp.data?.zipCode,
      };
   }
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof generalSchema>>) {
   handleEmailUpdate();
}

const isDialogChangePasswordOpen = ref(false);
const setDialogChangePassword = (status: boolean) => {
   isDialogChangePasswordOpen.value = status;
};
const dialogCancel = () => {
   setDialogChangePassword(false);
};
const dialogConfirm = () => {
   setDialogChangePassword(false);
};

const isDialogChangeEmailOpen = ref(false);
const setDialogChangeEmail = (status: boolean) => {
   isDialogChangeEmailOpen.value = status;
};
const dialogChangeEmailCancel = () => {
   setDialogChangeEmail(false);
   fetchUserDetail(profileUser.value?.id);

};
const dialogChangeEmailConfirm = () => {
   setDialogChangeEmail(false);
};

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

const isDialogErrorsOpen = ref(false);
const handleCloseErrorDialog = (status: boolean) => {
   isDialogErrorsOpen.value = status;
};
const handleEmailUpdate = async () => {
   isLoading.value = true;
   const resp = await updateUser(formGroup.value);
   if (resp.statusCode === 200) {
      if (resp.data?.isChangeEmail) {
         newEmail.value = formGroup.value.email;
         setDialogChangeEmail(true);
      } else {
         isDialogSuccessOpen.value = true;
      }
   } else {
      toast.add({ title: resp?.message, color: "red" });
      if (resp?.translation === "duplicate") {
         handleCloseErrorDialog(true)
      }
   }
   isLoading.value = false;
};

const getProfileUser = () => {
   profileUser.value = typeof authStore.profileUser === "string" ? JSON.parse(authStore.profileUser) : authStore.profileUser;
};
</script>
