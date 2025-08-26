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
     <UForm :schema="useBerthSchema" :state="form" @submit="onSubmit" class="p-6">
       <img :src="LayoutFluidVariantIcon" alt="layout-fluid-variant-icon" class="w-12 h-12" />
 
       <div class="mt-5">
         <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">
           {{ $t('berth_usage_info') }}
         </div>
       </div>
 
       <Input
         :label="$t('berth_usage')"
         name="name"
         :placeholder="$t('berth_usage')"
         v-model="form.name"
         required
         class="mt-5"
       />
 
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
           type="submit"
         />
       </div>
     </UForm>
   </UModal>
   <DialogAlert
     :title="$t('save_title')"
     :desc="$t('save_success')"
     type="success"
     :isOpen="isDialogSuccessOpen"
     :setDialog="handleCloseSuccessDialog"
   />
   <Loading v-if="isLoading" />
 </template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import LayoutFluidVariantIcon from "~/assets/icons/dialog/layout-fluid-variant.png";
import type { IUseBerthAdd, IUseBerthUpdate } from "~/core/interfaces/IUseBerth";

import useUseBerthService from "~/core/services/masterDataShipService/port/useBerthService";
const { addUseBerth, updateUseBerth, getUseBerthDetail } = useUseBerthService();
const { t } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const useBerthSchema = z.object({
   name: z.string().min(1, t("required")),
});

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
   itemId: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      resetForm();
      if (props.isDialogOpen && props.mode === "edit") {
         handleGetUseBerthDetail();
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);

const form = ref<IUseBerthAdd | IUseBerthUpdate>({
   name: "",
});

const resetForm = () => {
   form.value.name = "";
};

const handleGetUseBerthDetail = async () => {
   isLoading.value = true;
   const resp = await getUseBerthDetail(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
      };
   } else {
      console.error("get useBerth detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof useBerthSchema>>) {
   isLoading.value = true;
   const resp = props.mode === "edit" ? await updateUseBerth(props.itemId!, form.value) : await addUseBerth(form.value);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} useBerth error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
