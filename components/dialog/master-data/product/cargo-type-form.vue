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
      <UForm :schema="cargoTypeSchema" :state="form" @submit="onSubmit" class="p-6">
         <img :src="LayoutFluidVariantIcon" alt="layout-fluid-variant-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("info_cargo_type") }}</div>
         </div>

         <Input :label="$t('cargo_type')" name="name" :placeholder="$t('cargo_type')" v-model="form.name" required class="mt-5" />

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
import type { ICargoTypeAdd, ICargoTypeUpdate } from "~/core/interfaces/ICargoType";

import useCargoTypeService from "~/core/services/masterDataShipService/product/cargoTypeService";
const { addCargoType, updateCargoType, getCargoTypeDetail } = useCargoTypeService();
const { t } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const cargoTypeSchema = z.object({
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
         handleGetCargoTypeDetail();
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);

const form = ref<ICargoTypeAdd | ICargoTypeUpdate>({
   name: "",
});

const resetForm = () => {
   form.value.name = "";
};

const handleGetCargoTypeDetail = async () => {
   isLoading.value = true;
   const resp = await getCargoTypeDetail(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
      };
   } else {
      console.error("get cargoType detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof cargoTypeSchema>>) {
   isLoading.value = true;
   const resp = props.mode === "edit" ? await updateCargoType(props.itemId!, form.value) : await addCargoType(form.value);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} cargoType error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
