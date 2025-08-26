<template>
   <main class="relative h-screen bg-[url('~/assets/images/login/bg.jpg')] bg-cover bg-center">
      <div class="lang absolute top-4 right-4 flex gap-1">
         <ToggleLanguage />
      </div>
      <div class="h-screen flex items-center justify-center">
         <div class="w-1/2">
            <div class="rounded-[20px] bg-white m-auto p-[24px] max-w-[414px]">
               <UForm :state="formNewPassword" @submit="onSubmit">
                  <div class="text-center flex flex-col items-center">
                     <img :src="Logo" alt="SWU Logo" class="w-[48px]" />
                     <h1 class="font-bold text-[30px] my-3">{{ $t('create_new_password') }}</h1>
                     <p class="mb-6 text-grayy-75">{{ $t('please_fill_your_new_password') }}</p>
                  </div>

                  <UInputPassword :label="$t('new_password')" name="password" class="mb-5" :placeholder="$t('new_password')"
                     v-model="formNewPassword.password" customIcon="unlock" @blur="validate('password')"
                     @input="validate('password')" :error="getError('password') || ''" />

                  <UInputPassword :label="$t('confirm_new_password')" name="confirmPassword" :placeholder="$t('confirm_new_password')"
                     v-model="formNewPassword.confirmPassword" customIcon="unlock" @blur="validate('confirmPassword')"
                     @input="validate('confirmPassword')" :error="getError('confirmPassword') || ''" />

                  <UButton size="xl" variant="solid" :label="$t('change_password')" block class="rounded-lg mt-6"
                     type="submit" />
               </UForm>
            </div>

         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
   <DialogAlert :isOpen="isOpenModalAlert" :desc="$t(`${modalAlertMessage}`)" :title="$t('change_password_title')"
      :type="modalAlertType" :setDialog="handleCloseAlertDialog" />
</template>

<script setup lang="ts">
import Loading from "~/components/loading.vue";
import Logo from "~/assets/images/logo-mini.png";
import DialogAlert from "~/components/dialog/alert.vue"

const { t, locale } = useI18n();

definePageMeta({
   layout: false,
});

const settingService = useSettingService()
const authService = useAuthService()
const isLoading = ref(false);
const isOpenModalAlert = ref(false)
const modalAlertMessage = ref('')
const modalAlertType = ref('')
const authStore = useAuthStore()

import type { FormError, FormSubmitEvent } from "#ui/types";
import UInputPassword from "~/components/form/u-input-password.vue";
import ToggleLanguage from "~/components/ui/toggleLanguage.vue";
import type { IResetPassword } from "~/core/interfaces/ISetting";
import useSettingService from "~/core/services/settingService";
import useAuthService from "~/core/services/authService";

const formNewPassword = reactive({
   password: '',
   confirmPassword: ''
});

const errors = ref<FormError[]>([]);
const validate = (field: string) => {
   const validationErrors: FormError[] = [];
   // Password validation
   if (field === 'password') {
      if (!formNewPassword.password) {
         validationErrors.push({ path: 'password', message: t('please_enter_a_value') });
      } else if (!regxPassword.test(formNewPassword.password)) {
         validationErrors.push({ path: 'password', message: t('password_regex') });
      }
   }

   // Confirm Password validation
   if (field === 'confirmPassword') {
      if (!formNewPassword.confirmPassword) {
         validationErrors.push({ path: 'confirmPassword', message: t('please_enter_a_value') });
      } else if (formNewPassword.confirmPassword !== formNewPassword.password) {
         validationErrors.push({ path: 'confirmPassword', message: t('password_not_match') });
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

async function onSubmit(event: FormSubmitEvent<any>) {
   validate('password')
   validate('confirmPassword')
   if (errors.value.length === 0) {
      const payloadReset: IResetPassword = {
         password: event.data.password,
         confirm_password: event.data.confirmPassword
      }
      const resp = await settingService.resetPassword({ ...payloadReset })
      if (resp.statusCode === 200) {
         isOpenModalAlert.value = true
         modalAlertMessage.value = 'change_password_success'
         modalAlertType.value = 'success'
         const res = await authService.getUserData()
         if (res.statusCode === 200) {
            authStore.profileUser = res.data
         }
      } else {
         isOpenModalAlert.value = true
         modalAlertMessage.value = 'change_password_failed'
      }
   }
}

const handleCloseAlertDialog = (value: any) => {
   isOpenModalAlert.value = value
   navigateTo('/main')
}

watch(
   () => locale.value,
   () => {
      if (getError('password')) {
         validate('password')
      }
      if (getError('confirmPassword')) {
         validate('confirmPassword')
      }
   }
);

</script>
