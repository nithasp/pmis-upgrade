<template>
   <main class="relative h-screen bg-[url('~/assets/images/login/bg.jpg')] bg-cover bg-center">
      <div class="lang absolute top-4 right-4 flex gap-1">
         <ToggleLanguage />
      </div>
      <div class="h-screen flex items-center justify-center">
         <div class="w-1/2">
            <div class="rounded-[20px] bg-white m-auto p-[24px] max-w-[414px]">
               <UForm :schema="formSchema" :state="formNewPassword" @submit="onSubmit">
                  <div class="text-center flex flex-col items-center">
                     <img :src="Logo" alt="SWU Logo" class="w-[48px]" />
                     <h1 class="font-bold text-[30px] my-3">สร้างรหัสผ่านใหม่</h1>
                     <p class="mb-6 text-grayy-75">ระบุรหัสผ่านใหม่ของคุณเพื่อใช้ในการเข้าสู่ระบบ</p>
                  </div>

                  <UInputPassword label="รหัสผ่าน" name="password" class="mb-5" placeholder="Password"
                     v-model="formNewPassword.password" customIcon="unlock" />

                  <UInputPassword label="ยืนยันรหัสผ่าน" name="confirmPassword" placeholder="Password"
                     v-model="formNewPassword.confirmPassword" customIcon="unlock" />

                  <UButton size="xl" variant="solid" label="เปลี่ยนรหัสผ่าน" block class="rounded-lg mt-6"
                     type="submit" />
               </UForm>
            </div>

         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
   <DialogAlert :isOpen="isOpenModalAlert" :desc="modalAlertMessage" :title="titleModalAlert" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" />
</template>

<script setup lang="ts">
import Loading from "~/components/loading.vue";

import Logo from "~/assets/images/logo-mini.png";
import DialogAlert from "~/components/dialog/alert.vue"

const { locale, setLocale } = useI18n();

definePageMeta({
   layout: false,
});

const isLoading = ref(false);
const isOpenModalAlert = ref(false)
const modalAlertMessage = ref('')
const titleModalAlert = ref('')
const modalAlertType = ref('')

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import UInputPassword from "~/components/form/u-input-password.vue";
import type { IVerifyForgetPassword } from "~/core/interfaces/IVerifyForgetPassword";
import type { IForgotPassword } from "~/core/interfaces/IForgotPassword";
import useAuthService from "~/core/services/authService";
import ToggleLanguage from "~/components/ui/toggleLanguage.vue";
const formSchema = z.object({
   password: z.string().nonempty({ message: 'กรุณากรอกข้อมูล' }).regex(regxPassword, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 อักขระและประกอบด้วยตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก และตัวเลขผสมกัน"),
   confirmPassword: z.string().nonempty({ message: 'กรุณากรอกข้อมูล' }).regex(regxPassword, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 อักขระและประกอบด้วยตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก และตัวเลขผสมกัน"),
}).refine((data) => data.password === data.confirmPassword, {
   message: "รหัสผ่านของคุณไม่ตรงกัน",
   path: ["confirmPassword"], // This will show the error at the 'confirmPassword' field
});

const formNewPassword = ref({
   password: '',
   confirmPassword: ''
});

const { verifyTokenForgetPassword, resetPassword } = useAuthService();
const route = useRoute();
const query: any = route.query;
const token = query.token

const payload = ref({
   password_reset_token: ''
})

onMounted(async () => {
   if (token) {
      const payloadVerify: IVerifyForgetPassword = { password_reset_token: token }
      const resp = await verifyTokenForgetPassword({ ...payloadVerify })
      if (resp.statusCode === 200) {
         payload.value = {
            ...payload.value,
            password_reset_token: token
         }
      } else {
         titleModalAlert.value = 'ยืนตัวตนล้มเหลว'
         isOpenModalAlert.value = true
         modalAlertMessage.value = resp.message
      }
   } else {
      titleModalAlert.value = 'ยืนตัวตนล้มเหลว'
      isOpenModalAlert.value = true
      modalAlertMessage.value = "ไม่มี token "

   }
})

const handleCloseAlertDialog = (value: any) => {
   isOpenModalAlert.value = value
   navigateTo('/login')
}

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema>>) {
   const payloadReset: IForgotPassword = {
      password_reset_token: payload.value.password_reset_token,
      new_password: event.data.password
   }
   const resp = await resetPassword({ ...payloadReset })
   if (resp.statusCode === 200) {

      titleModalAlert.value = 'เปลี่ยนรหัสผ่านสำเร็จ'
      isOpenModalAlert.value = true
      modalAlertMessage.value = resp.message
      modalAlertType.value = 'success'
   } else {
      titleModalAlert.value = 'เปลี่ยนรหัสผ่านไม่สำเร็จสำเร็จ'
      isOpenModalAlert.value = true
      modalAlertMessage.value = resp.message
   }
}


</script>
