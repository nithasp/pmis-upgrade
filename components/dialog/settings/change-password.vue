<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[400px]',
         rounded: 'rounded-xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <img :src="LockVariantIcon" alt="lock-variant-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("change_password_title") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("change_password_subtitle") }}</div>
         </div>

         <div class="mt-5">
            <div v-if="stepChangePassword === 1">
               <UForm :schema="changePasswordSchemaStep1" :state="form" @submit="onSubmitStep1">
                  <InputPassword
                     :label="$t('settings_password_current')"
                     name="passwordCurrent"
                     :placeholder="$t('password')"
                     v-model="form.passwordCurrent"
                     customIcon="unlock"
                     required
                     class="mb-5"
                     :error="loginMessageError"
                  />
                  <UButton class="btnSubmitStep1 hidden" type="submit" />
               </UForm>
            </div>

            <div v-if="stepChangePassword === 2">
               <UForm :schema="changePasswordSchemaStep2" :state="form" @submit="onSubmitStep2">
                  <InputPassword
                     :label="$t('settings_password_new')"
                     name="passwordNew"
                     :placeholder="$t('new_password')"
                     v-model="form.passwordNew"
                     customIcon="unlock"
                     required
                     class="mb-5"
                  />
                  <InputPassword
                     :label="$t('settings_password_confirm')"
                     name="passwordNewConfirm"
                     :placeholder="$t('confirm_new_password')"
                     v-model="form.passwordNewConfirm"
                     customIcon="unlock"
                     required
                     class="mb-5"
                  />
                  <UButton class="btnSubmitStep2 hidden" type="submit" />
               </UForm>
            </div>
         </div>

         <div class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton
               size="lg"
               color="white"
               variant="solid"
               :label="$t('cancel')"
               block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
               @click="() => dialogCancel!(false)"
               ref="removeAutoFocus"
            />
            <UButton
               size="lg"
               color="primary"
               variant="solid"
               :label="$t('confirm')"
               block
               class="rounded-lg w-full sm:w-[170px]"
               type="button"
               @click="handleBtnSubmit"
            />
         </div>
      </div>
   </UModal>
   <DialogAlert :title="dialogProp.title" :desc="dialogProp.desc" :type="dialogProp.type" :isOpen="isDialogAlertOpen" :setDialog="handleCloseAlertDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import InputPassword from "~/components/form/u-input-password.vue";
import LockVariantIcon from "~/assets/icons/dialog/lock-variant.png";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";

import useSettingService from "~/core/services/settingService";
const { verifyPassword, resetPassword } = useSettingService();
const { t } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const changePasswordSchemaStep1 = z.object({
   passwordCurrent: z.string().min(1, t("required")),
});
const changePasswordSchemaStep2 = z
   .object({
      passwordNew: z.string().min(1, t("required")).regex(regxPassword, t("password_regex")),
      passwordNewConfirm: z.string().min(1, t("required")),
   })
   .refine((data) => data.passwordNew === data.passwordNewConfirm, {
      message: t("password_not_match"),
      path: ["passwordNewConfirm"],
   });

const props = defineProps({
   isDialogOpen: Boolean,
   title: String,
   desc: String,
   icon: String,
   labelCancel: String,
   labelConfirm: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   setDialogChangePassword: Function,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      resetForm();
   }
);

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const stepChangePassword = ref<Number>(1);
const loginMessageError = ref("");
const dialogProp = ref({
   title: "",
   type: "",
   desc: "",
});

const form = ref({
   passwordCurrent: "",
   passwordNew: "",
   passwordNewConfirm: "",
});

const resetForm = () => {
   stepChangePassword.value = 1;
   form.value.passwordCurrent = "";
   form.value.passwordNew = "";
   form.value.passwordNewConfirm = "";
};

async function onSubmitStep1(event: FormSubmitEvent<z.output<typeof changePasswordSchemaStep1>>) {
   isLoading.value = true;
   loginMessageError.value = "";
   const resp = await verifyPassword({ old_password: form.value.passwordCurrent });
   if (resp.statusCode === 200) {
      stepChangePassword.value = 2;
   } else {
      console.error("verify password error:", resp);
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("password_not_correct"),
         desc: "",
         type: "danger",
      };
   }
   isLoading.value = false;
}

async function onSubmitStep2(event: FormSubmitEvent<z.output<typeof changePasswordSchemaStep2>>) {
   isLoading.value = true;
   loginMessageError.value = "";
   const resp = await resetPassword({ password: form.value.passwordNew, confirm_password: form.value.passwordNewConfirm });
   if (resp.statusCode === 200) {
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("change_password_title"),
         desc: t("change_password_success"),
         type: "success",
      };
      props.setDialogChangePassword!(false);
      stepChangePassword.value = 1;
   } else {
      console.error("reset password error:", resp);
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("password_not_correct"),
         desc: "",
         type: "danger",
      };
   }
   isLoading.value = false;
}

const handleBtnSubmit = () => {
   if (stepChangePassword.value === 1) {
      const btnSubmitStep1 = document.querySelector(".btnSubmitStep1") as HTMLButtonElement;
      btnSubmitStep1?.click();
   }
   if (stepChangePassword.value === 2) {
      const btnSubmitStep2 = document.querySelector(".btnSubmitStep2") as HTMLButtonElement;
      btnSubmitStep2?.click();
   }
};

const isDialogAlertOpen = ref(false);
const handleCloseAlertDialog = (status: boolean) => {
   isDialogAlertOpen.value = status;
};
</script>
