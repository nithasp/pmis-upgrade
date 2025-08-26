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
      <UForm :schema="cargoWharfageSchema" :state="form" @submit="onSubmit" class="p-6">
         <img :src="CargoWharfageIcon" alt="layout-fluid-variant-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">
               {{ $t("cargo_wharfage_info") }}
            </div>
         </div>

         <Input :label="$t('cargo_wharfage')" name="name" :placeholder="$t('cargo_wharfage')" v-model="form.name" required class="mt-5" />

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
import CargoWharfageIcon from "~/assets/icons/dialog/cargo-wharfage.png";
import type { ICargoWharfageAdd, ICargoWharfageUpdate } from "~/core/interfaces/ICargoWharfage";

import useCargoWharfageService from "~/core/services/masterDataShipService/product/cargoWharfageService";
const { addCargoWharfage, updateCargoWharfage, getCargoWharfageDetail } = useCargoWharfageService();
const { t } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const cargoWharfageSchema = z.object({
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
         handleGetCargoWharfageDetail();
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);

const form = ref<ICargoWharfageAdd | ICargoWharfageUpdate>({
   name: "",
});

const resetForm = () => {
   form.value.name = "";
};

const handleGetCargoWharfageDetail = async () => {
   isLoading.value = true;
   const resp = await getCargoWharfageDetail(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
      };
   } else {
      console.error("get cargoWharfage detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof cargoWharfageSchema>>) {
   isLoading.value = true;
   const resp = props.mode === "edit" ? await updateCargoWharfage(props.itemId!, form.value) : await addCargoWharfage(form.value);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} cargoWharfage error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
