<template>
   <main class="relative h-screen bg-[url('~/assets/images/login/bg.jpg')] bg-cover bg-center">
      <div class="lang absolute top-4 right-4 flex gap-1">
         <ToggleLanguage />
      </div>
      <div class="h-screen flex items-center justify-center">
         <div class="w-1/2">
            <div class="rounded-[20px] bg-white m-auto p-[24px] max-w-[414px]">
               <UForm :state="formForgetPassword" @submit="onSubmit">
                  <div @click="onClickBackToLogin" id="forget-password"
                     class="cursor-pointer mb-6 text-primaryy-500 flex items-center">
                     <!-- <img :src="AngleLeft" alt="UserIcon" /> -->
                     <NuxtIcon name="angle-left" />
                     <div class="ml-2">{{ $t('back_to_login') }}</div>
                  </div>
                  <div class="text-center flex flex-col items-center">
                     <img :src="Logo" alt="SWU Logo" class="w-[48px]" />
                     <h1 class="font-bold text-[30px] my-3">{{ $t('forget_password') }}</h1>
                     <p class="mb-6 text-grayy-75" v-if="!isSendEmail">{{ $t('forget_password_message') }}</p>
                  </div>
                  <div v-if="!isSendEmail">
                     <Input :label="$t('email')" name="email" class="mb-5" placeholder="me@example.com"
                        v-model="formForgetPassword.email" customIcon="user" @blur="validate('email')"
                        @input="validate('email')" :error="getError('email') || ''" />
                     <UButton size="xl" variant="solid" :label="$t('confirm')" block class="rounded-lg mt-6"
                        type="submit" />
                  </div>
                  <div v-else>
                     <p v-if="isErrorSendEmail" class="mb-10 text-error-500 text-center">
                        {{ $t(`${messageError}`) }}
                     </p>
                     <p v-else class="mb-10 text-[#E76E31] text-center">
                        {{ $t('forget_alert_message') }}
                     </p>
                  </div>
               </UForm>
            </div>

         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Loading from "~/components/loading.vue";

import Logo from "~/assets/images/logo-mini.png";

definePageMeta({
   layout: false,
});

const isLoading = ref(false);
const isSendEmail = ref(false);
const isErrorSendEmail = ref(false);
const messageError = ref('false');
const { t, locale } = useI18n()

import type { FormError, FormSubmitEvent } from "#ui/types";
import Input from "~/components/form/u-input.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import useAuthService from "~/core/services/authService";
import ToggleLanguage from "~/components/ui/toggleLanguage.vue";
const authService = useAuthService();

const formForgetPassword = reactive({
   email: '',
});

const errors = ref<FormError[]>([]);
const validate = (field: string) => {
   const validationErrors: FormError[] = [];
   if (field === 'email') {
      if (!formForgetPassword.email) {
         validationErrors.push({ path: 'email', message: t('please_enter_a_value') });
      } else if (!regxEmail.test(formForgetPassword.email)) {
         validationErrors.push({ path: 'email', message: t('email_format_validate_message') });
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
   const { email } = event.data
   validate('email');
   if (errors.value.length === 0) {
      isLoading.value = true
      const resp = await authService.sendEmailForgetPassword({ email })
      if (resp.statusCode === 200) {
         isSendEmail.value = true
         isErrorSendEmail.value = false
      } else {
         isSendEmail.value = true
         isErrorSendEmail.value = true
         messageError.value = resp.translation
      }
      isLoading.value = false
   }
}
const onClickBackToLogin = () => {
   navigateTo("/login");
}

watch(
   () => locale.value,
   () => {
      if (getError('email')) {
         validate('email')
      }
   }
);
</script>
