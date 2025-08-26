<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[400px]',
         rounded: 'rounded-xl',
         margin: 'p-6',
      }"
      :initialFocus="removeAutoFocus"
   >
      <UForm :state="form" @submit="onSubmit">
         <img :src="WarningIcon" alt="warning-icon" class="w-12 h-12" />
         <div class="my-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("ขอแก้ไขใบคำร้อง") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("specify_details") }}</div>
         </div>
         <UTextarea :label="$t('detail')" :placeholder="$t('detail')" :rows="7" v-model="form.rejectNote" />
         <div class="mt-5 flex justify-between flex-wrap gap-y-3">
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
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full sm:w-[170px]" type="submit" />
         </div>
      </UForm>
   </UModal>
   <DialogConfirm
      icon="warning"
      :title="$t('save_title')"
      :desc="$t('save_description')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogConfirmOpen"
      :dialogCancel="dialogConfirmCancel"
      :dialogConfirm="dialogConfirm"
   />
   <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :btnName="$t('close')"
      :setDialog="handleCloseAlertDialog"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import UTextarea from "~/components/form/u-textarea.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import WarningIcon from "~/assets/icons/dialog/warning.png";

import useVesselImportService from "~/core/services/vesselImport";
const vesselImportService = useVesselImportService();

import useDocumentService from "~/core/services/documentService";
const documentService = useDocumentService();

const { t, locale } = useI18n();
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const vesselImportEditSchema = z.object({});

const props = defineProps({
   isDialogOpen: Boolean,
   mode: String,
   title: String,
   desc: String,
   icon: String,
   labelCancel: String,
   labelConfirm: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   itemData: Object,
   documentId: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      resetForm();
      // if (props.isDialogOpen) {
      //    form.value.rejectNote = props.itemData?.rejectNote;
      // }
   }
);

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const dialogAlertType = ref<string>("");
const form = ref<any>({
   rejectNote: "",
});
const dialogAlertProps = ref({
   title: "",
   desc: "",
   type: "",
});
const resetForm = () => {
   form.value.rejectNote = "";
};

const isDialogAlertOpen = ref<boolean>(false);
const handleCloseAlertDialog = (status: boolean) => {
   isDialogAlertOpen.value = status;
   if (dialogAlertType.value === "success") {
      props.dialogConfirm!(false, "refresh");
   }
};

const isDialogConfirmOpen = ref(false);
const dialogConfirm = async () => {
   isLoading.value = true;
   const res = await documentService.updateVtmsDocument(props.documentId!, form.value);
   const isSuccess = res.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("ขอแก้ไขใบคำร้อง") : locale.value === "th" ? res.message : res.translation,
      desc: t(isSuccess ? t("การขอแก้ไขใบคำร้องของคุณสำเร็จแล้ว") : ""),
      type: isSuccess ? "success" : "danger",
   };
   dialogAlertType.value = isSuccess ? "success" : "fail";
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};
const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof vesselImportEditSchema>>) {
   isDialogConfirmOpen.value = true;
}
</script>
