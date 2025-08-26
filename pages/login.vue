<template>
   <main class="relative h-screen bg-[url('~/assets/images/login/login-bg.png')] bg-cover bg-center">
      <div class="lang absolute top-4 right-4 flex gap-1">
         <ToggleLanguage />
      </div>

      <div class="h-full items-center justify-items-center grid grid-cols-[1fr_1fr]">
         <div class="justify-self-start pl-5 sm:pl-10 md:pl-40">
            <div class="flex w-full items-center justify-center space-y-4">
               <div>
                  <img v-if="locale === 'th'" :src="Logo" alt="SWU Logo" class="w-[222px]" />
                  <img v-else :src="LogoEN" alt="SWU Logo" class="w-[222px]" />
                  <p class="text-xl text-[#1f1f1f] text-left font-bold mt-10">
                     {{ $t("welcome") }}
                  </p>
                  <h1 class="text-3xl font-bold text-[#6F4A9E] mt-2 whitespace-break-spaces">{{ $t("pims_text") }}</h1>
                  <ul class="text-[#6F4A9E] text-left space-y-2 my-10">
                     <li @click="redirectToRegister()" class="flex mb-8 cursor-pointer">
                        <div
                           class="cursor-pointer flex items-center justify-center w-[58px] h-[58px] bg-[#6F4A9E] rounded-full border border-[#6F4A9E]">
                           <NuxtIcon name="user-add" size="2xl" class="text-white" />
                        </div>
                        <div class="flex items-center justify-center ml-5 font-bold text-md">
                           <p class="inline-block align-middle">{{ $t("new_register") }}</p>
                        </div>
                     </li>
                     <li class="flex cursor-pointer">
                        <div
                           class="flex items-center justify-center w-[58px] h-[58px] bg-[#6F4A9E] rounded-full border border-[#6F4A9E]">
                           <NuxtIcon name="book-alt" size="2xl" class="text-white" />
                        </div>
                        <div class="flex items-center justify-center ml-5 font-bold">
                           <p class="inline-block align-middle">{{ $t("register_manual") }}</p>
                        </div>
                     </li>
                  </ul>
                  <p class="text-xs text-gray-500 mt-4 text-sm text-[#344054] whitespace-break-spaces">
                     {{ $t("contact_text") }}
                  </p>
               </div>
            </div>
            <div class="version text-center text-[10px] text-[#B7A4CE]"
               style="position: absolute; left: 0px; bottom: 10px">
               {{ deployment.version }}
            </div>
         </div>
         <div class="w-[414px] mx-7 lg:mx-0">
            <div class="rounded-[20px] bg-white m-auto p-[24px] max-w-[414px]">
               <UForm :state="formLogin" @submit="onSubmit">
                  <h1 class="font-anuphan-semi-bold text-[30px] text-center mb-8">{{ $t("login_title") }}</h1>
                  <Input :label="$t('email')" name="email" class="mb-5" placeholder="me@example.com"
                     v-model="formLogin.email" customIcon="user" :error="getError('email') || loginMessageError"
                     @blur="validate('email')" @input="validate('email')" />
                  <InputPassword :label="$t('password')" name="password" placeholder="Password"
                     v-model="formLogin.password" custom-icon="unlock"
                     :error="getError('password') || loginMessageError" @blur="validate('email')"
                     @input="validate('password')" />
                  <div class="text-right mt-6 text-primaryy-500 text-sm">
                     <span class="cursor-pointer" @click="onClickNavigateToForgetPassword" id="forget-password">{{
                        $t("forget_password") }} ?</span>
                  </div>

                  <UButton size="xl" variant="solid" :label="$t('login_form_submit')" block
                     class="rounded-lg mt-6 font-anuphan-semi-bold" type="submit" />
               </UForm>
            </div>
         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import LogoEN from "~/assets/images/logo-en.png";
import Logo from "~/assets/images/logo.svg";
import Loading from "~/components/loading.vue";

import NuxtIcon from "../components/ui/nuxtIcon.vue";

import InputPassword from "~/components/form/u-input-password.vue";
import Input from "~/components/form/u-input.vue";
import deployment from "~/deployment.config.js";

const { locale, t } = useI18n();

definePageMeta({
   layout: false,
});

const isLoading = ref(false);
const loginMessageError = ref("");

import type { FormError, FormSubmitEvent } from "#ui/types";
import ToggleLanguage from "~/components/ui/toggleLanguage.vue";
import useAuthService from "~/core/services/authService";
import useRoleService from "~/core/services/roleService";
import { UserTypeEnum } from "~/utils/enums/UserTypeEnum";

const { login } = useAuthService();
const roleService = useRoleService();
const authStore = useAuthStore();
const formLogin = reactive({
   email: undefined,
   password: undefined,
});

const errors = ref<FormError[]>([]);
const validate = (field: string) => {
   const validationErrors: FormError[] = [];

   if (field === "email") {
      if (!formLogin.email) {
         validationErrors.push({ path: "email", message: t("please_enter_a_value") });
      } else if (!regxEmail.test(formLogin.email)) {
         validationErrors.push({ path: "email", message: t("email_format_validate_message") });
      }
   }

   if (field === "password") {
      if (!formLogin.password) {
         validationErrors.push({ path: "password", message: t("please_enter_a_value") });
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
   return error ? error.message : undefined;
};

async function onSubmit(event: FormSubmitEvent<any>) {
   const { email, password } = event.data;
   validate("email");
   validate("password");
   if (errors.value.length === 0) {
      isLoading.value = true;
      loginMessageError.value = "";
      const resp = await login({ email, password });
      if (resp.statusCode === 200) {
         authStore.accessToken = resp.data.token.access_token;
         authStore.refreshToken = resp.data.token.refresh_token;
         const userData = resp.data.user;
         authStore.profileUser = userData;
         if (userData.type === UserTypeEnum.User) {
            if (userData.roleId) {
               const roleResp = await roleService.getRoleDetail(userData.roleId);
               if (resp.statusCode === 200) {
                  const permissions = roleResp.data.permissions;
                  authStore.permissions = permissions;
               }
            }
         }
         localStorage.setItem("firstLogin", "true");

         if (userData.roleType === 'Agency') {
            navigateTo("/manage-ship/list?status=false");
         } else if (userData.roleType === 'DocumentReviewer') {
            navigateTo("/request-form/list");
         } else if (userData.roleType === 'StatApprove') {
            navigateTo("/request-form/list");
         }
         else if (userData.roleType === 'VTMS') {
            navigateTo("/vt");
         }
         else if (userData.roleType === 'StatOfficer') {
            navigateTo("/vessel-awaiting-import/list");
         }
         else {
            navigateTo("/request-form/list");
         }
      } else {
         console.error("Login error:", resp);
         loginMessageError.value = t("email_password_not_correct");
      }
      isLoading.value = false;
   }
}

const onClickNavigateToForgetPassword = () => {
   navigateTo("/forget-password");
};

const redirectToRegister = () => {
   navigateTo("/verify-email");
};

watch(
   () => locale.value,
   () => {
      if (getError("email")) {
         validate("email");
      }
      if (getError("password")) {
         validate("password");
      }
   }
);
</script>
