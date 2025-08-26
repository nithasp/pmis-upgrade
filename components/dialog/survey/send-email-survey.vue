<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      width: 'w-[400px]',
      rounded: 'rounded-xl',
   }" :initialFocus="removeAutoFocus">
      <div class="p-6">
         <img :src="WarningIcon" alt="block-variant-icon" class="w-12 h-12" />
         <div class="mt-5 mb-6">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("บันทึกและส่งแบบสอบถาม") }}</div>
            <div class="text-[#667085] text-sm w-10/12">{{
               $t("ระบุที่อยู่อีเมลที่คุณต้องการให้ตอบแบบสอบถาบระบบจะส่งแบบสอบถามเมื่อถึงระยะเวลาที่กำหนด") }}</div>
         </div>

         <template v-for="(item, index) in emailList" :key="index">
            <div class="flex gap-4 w-full items-center">
               <Input name="email" placeholder="example@mail.com" v-model="item.email"
               :class="[!item.pristine && item.error ? 'mt-4' : 'mt-2', 'w-full']" @keyup="checkValidation(index)"
               :error="!item.pristine && item.error ? item.error : ''" />
               <img :src="CrossSmallIcon" alt="cross-small-icon" 
                :class="[!item.pristine && item.error ? '-mt-3' : 'mt-3', 'w-3 h-3 cursor-pointer']"
                @click="removeEmail(index)" />
            </div>

         </template>

         <div>
            <UButton
               class="bg-white text-[#704A9E] [&_span]:font-anuphan-semi-bold w-auto h-auto mt-4 hover:bg-white p-0"
               outlined size="md" @click="addEmail">
               <div class="flex gap-2 w-full justify-center relative">
                  <img :src="PlusIcon" alt="plus-icon" class="w-5 h-5" />
                  <span>{{ $t("เพิ่มอีเมล") }}</span>
               </div>
            </UButton>
         </div>

         <div class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
               @click="() => dialogCancel!(false)" ref="removeAutoFocus" />
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block
               class="rounded-lg w-full sm:w-[170px]" @click="handleSubmit" />
         </div>
      </div>
   </UModal>
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen"
      :setDialog="handleCloseSuccessDialog" />
   <DialogConfirm :icon="dialogConfirmProps.icon" :title="dialogConfirmProps.title" :desc="dialogConfirmProps.desc"
      :type="dialogConfirmProps.type" :colorConfirm="dialogConfirmProps.colorConfirm" :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')" :isDialogOpen="isDialogConfirmOpen" :dialogCancel="dialogConfirmCancel"
      :dialogConfirm="dialogConfirm" />
   <DialogAlert :title="dialogAlertProps.title" :desc="dialogAlertProps.desc" :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen" :setDialog="handleCloseDialogAlert" :btnName="$t('close')" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import PlusIcon from "~/assets/icons/fi-rs-plus.svg";
import WarningIcon from "~/assets/icons/dialog/warning.png";
import CrossSmallIcon from "~/assets/icons/fi-rs-cross-small.svg";
import useSurveyService from "~/core/services/surveyService";
const { t } = useI18n();
const surveyService = useSurveyService();

const props = defineProps({
   isDialogOpen: Boolean,
   title: String,
   desc: String,
   icon: String,
   labelCancel: String,
   labelConfirm: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   surveyId: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      resetForm();
   }
);

const dialogConfirmProps = ref<any>({
   title: "",
   desc: "",
   type: "",
   icon: "",
   colorConfirm: "",
});
const dialogAlertProps = ref<any>({
   title: "",
   desc: "",
   type: "",
});

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const emailList = ref([{ email: "", pristine: true, error: "" }]);

const resetForm = () => {
   emailList.value = [{ email: "", pristine: true, error: "" }];
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
   if (dialogAlertProps.value.type === "success") {
      props.dialogConfirm!(false, "refresh");
   }
};

const isDialogConfirmOpen = ref(false);
const dialogConfirm = async () => {
   isLoading.value = true;
   const res: any = await surveyService.sendEmailSurvey(props.surveyId!,
      {
         emails: emailList.value.map(x => x.email),
      });
   const isSuccess = res.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("บันทึกและส่งแบบสอบถาม") : res.message,
      desc: t(isSuccess ? "การบันทึกและส่งแบบสอบถามของคุณสำเร็จแล้ว" : ""),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};

const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};


const validateEmail = (email: any) => {
   const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return regex.test(email);
};
const checkValidation = (index: any) => {
   const email = emailList.value[index];
   if (email.email === "") {
      email.error = t("required");
   } else if (!validateEmail(email.email)) {
      email.error = t("รูปแบบอีเมลไม่ถูกต้อง");
   } else {
      email.error = "";
   }
   email.pristine = false;
};

const handleSubmit = () => {
   emailList.value.forEach((_, index) => checkValidation(index));
   if (emailList.value.every(email => email.error === "")) {
      dialogConfirmProps.value = {
         title: t("บันทึกและส่งแบบสอบถาม"),
         desc: t("คุณต้องการบันทึกและส่งแบบสอบถามนี้ใช่หรือไม่"),
         icon: "warning",
      };
      isDialogConfirmOpen.value = true;
   }
};

const addEmail = () => {
   emailList.value.push({ email: "", pristine: true, error: "" });
};

const removeEmail = (index: number) => {
    emailList.value.splice(index, 1);
};
</script>
