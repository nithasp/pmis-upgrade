<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[405px]',
         rounded: 'rounded-xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div id="change-email" class="p-6">
         <img :src="EmailVariantIcon" alt="email-variant-icon" class="w-12 h-12 mx-auto" />

         <div class="mt-5 text-center">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("change_email_title") }}</div>
            <div class="text-sm mt-2 text-grayy-600">
               <span>{{ $t("change_email_to") }}</span>
               <span class="ml-1 font-anuphan-semi-bold">{{ newEmail ? newEmail : "-" }}</span>
            </div>
         </div>

         <div class="mt-5 flex gap-3 justify-between">
            <input
               ref="input1"
               class="text-5xl text-primaryy-500 rounded-lg border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border-solid border-[#B7A4CE] px-[25px] py-[15.5px] w-full"
               maxlength="1"
               @input="moveFocus($refs.input1, $refs.input2, 'input1')"
               @keypress="allowOnlyNumbers"
            />
            <input
               ref="input2"
               class="text-5xl text-primaryy-500 rounded-lg border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border-solid border-[#B7A4CE] px-[25px] py-[15.5px] w-full"
               maxlength="1"
               @input="moveFocus($refs.input2, $refs.input3, 'input2')"
               @keypress="allowOnlyNumbers"
            />
            <input
               ref="input3"
               class="text-5xl text-primaryy-500 rounded-lg border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border-solid border-[#B7A4CE] px-[25px] py-[15.5px] w-full"
               maxlength="1"
               @input="moveFocus($refs.input3, $refs.input4, 'input3')"
               @keypress="allowOnlyNumbers"
            />
            <input
               ref="input4"
               class="text-5xl text-primaryy-500 rounded-lg border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border-solid border-[#B7A4CE] px-[25px] py-[15.5px] w-full"
               maxlength="1"
               @input="moveFocus($refs.input4, $refs.input4, 'input4')"
               @keypress="allowOnlyNumbers"
            />
         </div>

         <div class="text-grayy-600 text-sm text-center mt-[6px]">
            <span>{{ $t("change_email_not_password_failed") }}</span>
            <span class="ml-1 underline cursor-pointer" @click="handleSendVerifyEmail">{{ $t("change_email_resend") }}</span>
         </div>

         <div class="mt-8 flex justify-around flex-wrap gap-y-3">
            <UButton
               size="lg"
               color="white"
               variant="solid"
               :label="$t('cancel')"
               block
               class="rounded-lg w-full sm:max-w-[158px] border border-gray-100 outline-none"
               @click="() => dialogCancel!(false)"
               ref="removeAutoFocus"
               :ui="{
                  base: '[&_span]:font-anuphan-semi-bold',
               }"
            />
            <UButton
               size="lg"
               color="primary"
               variant="solid"
               :label="$t('confirm')"
               block
               class="rounded-lg w-full sm:max-w-[158px]"
               type="submit"
               :ui="{
                  base: '[&_span]:font-anuphan-semi-bold',
               }"
               @click="handleEmailUpdate"
            />
         </div>
      </div>
   </UModal>
   <DialogAlert
      :title="dialogProp.title"
      :desc="dialogProp.desc"
      :type="dialogProp.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseAlertDialog"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import EmailVariantIcon from "~/assets/icons/dialog/email-variant.png";
import useSettingService from "~/core/services/settingService";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import { NEVER } from "zod";
const { sendVerifyEmail } = useSettingService();
const { updateUser } = useSettingService();
const { t, locale } = useI18n();

const props = defineProps({
   isDialogOpen: Boolean,
   emailCode: String,
   newEmail: String,
   userInfo: NEVER,
   dialogCancel: Function,
   dialogConfirm: Function,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      userInfo.value = props.userInfo;
   }
);

const removeAutoFocus = ref(null);
const isLoading = ref<boolean>(false);
const userInfo = ref({});
const input1 = ref("");
const input2 = ref("");
const input3 = ref("");
const input4 = ref("");
const dialogProp = ref({
   title: "",
   type: "",
   desc: "",
});

const handleSendVerifyEmail = async () => {
   isLoading.value = true;
   const resp = await sendVerifyEmail({ email: props.newEmail! });
   if (resp.statusCode === 200) {
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: resp?.message,
         desc: "",
         type: "success",
      };
   } else {
      console.error("verify email error:", resp);
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("error_title"),
         desc: t("error_try_again"),
         type: "danger",
      };
   }
   isLoading.value = false;
};

const handleEmailUpdate = async () => {
   isLoading.value = true;
   const body = {
      ...userInfo.value,
      code: `${input1.value}${input2.value}${input3.value}${input4.value}`,
   };

   const resp = await updateUser(body);
   if (resp.statusCode === 200) {
      props.dialogConfirm!(false);
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("change_email_title"),
         desc: t("change_email_success"),
         type: "success",
      };
   } else {
      console.error("update email error:", resp);
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("error_title"),
         desc: t("error_try_again"),
         type: "danger",
      };
   }
   isLoading.value = false;
};

const isDialogAlertOpen = ref(false);
const handleCloseAlertDialog = (status: boolean) => {
   isDialogAlertOpen.value = status;
};

const moveFocus = (currentInput: any, nextInput: any, inputIndex: string) => {
   if (currentInput.value.length >= currentInput.maxLength) {
      nextInput.focus();
   }

   if (inputIndex === "input1") {
      input1.value = currentInput.value;
   }
   if (inputIndex === "input2") {
      input2.value = currentInput.value;
   }
   if (inputIndex === "input3") {
      input3.value = currentInput.value;
   }
   if (inputIndex === "input4") {
      input4.value = currentInput.value;
   }
};

const allowOnlyNumbers = (e: any) => {
   const char = String.fromCharCode(e.which);
   if (!/^[0-9]$/.test(char)) {
      e.preventDefault();
   }
};
</script>
