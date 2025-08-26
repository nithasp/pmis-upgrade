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
      <UForm :schema="locateSchema" :state="form" @submit="onSubmit" class="p-6">
         <img :src="LayoutFluidVariantIcon" alt="layout-fluid-variant-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{$t('ship_location')}}</div>
         </div>

         <Input :label="$t('berth_position')" name="name" :placeholder="$t('berth_position')" v-model="form.name" required class="mt-5" />

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
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full sm:w-[170px]" type="submit" />
         </div>
      </UForm>
   </UModal>
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import LayoutFluidVariantIcon from "~/assets/icons/dialog/layout-fluid-variant.png";
import type { ILocateAdd, ILocateUpdate } from "~/core/interfaces/ILocate";

import useLocateService from "~/core/services/masterDataShipService/port/locateService";
const { addLocate, updateLocate, getLocateDetail } = useLocateService();
const { t } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const locateSchema = z.object({
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
         handleGetLocateDetail();
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);

const form = ref<ILocateAdd | ILocateUpdate>({
   name: "",
});

const resetForm = () => {
   form.value.name = "";
};

const handleGetLocateDetail = async () => {
   isLoading.value = true;
   const resp = await getLocateDetail(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
      };
   } else {
      console.error("get locate detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof locateSchema>>) {
   isLoading.value = true;
   const resp = props.mode === "edit" ? await updateLocate(props.itemId!, form.value) : await addLocate(form.value);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} locate error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
