<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         rounded: 'rounded-xl !max-w-[629px] w-full',
      }"
      :initialFocus="removeAutoFocus"
   >
      <UForm :schema="importPassengerSchema" :state="formGroup" @submit="onSubmit" v-on:error="handleFormError" class="p-6">
         <img :src="BoxVariant" alt="icon" class="w-12 h-12" />
         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("เพิ่มรายการผู้โดยสาร") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("ระบุรายละเอียดสินค้า") }}</div>
         </div>
         <div class="mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-4">
               <SelectMenu
                  :label="$t('วัตถุประสงค์')"
                  name="purposeTypeId"
                  :placeholder="$t('วัตถุประสงค์')"
                  :options="documentOptionsStore.purposeTypeOptions.filter((item: any) => item.id === 5)"
                  v-model="formGroup.purposeTypeId"
                  class="w-full"
                  required
               />
               <div class="hidden md:block"></div>
               <Input :label="$t('รายละเอียด')" name="detail" :placeholder="$t('รายละเอียด')" v-model="formGroup.detail" class="w-full" />
               <InputNumber :label="$t('จำนวนผู้โดยสาร')" name="passengers" :placeholder="$t('จำนวนผู้โดยสาร')"  v-model="formGroup.passengers"
               :decimal="0" required />
            </div>
         </div>

         <div class="mt-8 grid grid-cols-[1fr_1fr] gap-3">
            <UButton
               size="lg"
               color="white"
               variant="solid"
               :label="$t('cancel')"
               block
               class="rounded-lg w-full border border-gray-100 outline-none"
               @click="() => {
                        dialogCancel!(false);
                    }"
               ref="removeAutoFocus"
            />
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full" type="submit" />
         </div>
      </UForm>
   </UModal>
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import InputNumber from "~/components/form/input-number.vue";
import SelectMenu from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import BoxVariant from "~/assets/icons/dialog/box-variant.png";
import { NEVER, z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore();
const importPassengerSchema = z.object({
  purposeTypeId: z.number().min(1, t("required")),
  passengers: z
    .string()
    .min(1, t("required"))
    .refine((val) => val !== "0", { message: "ผู้โดยสารต้องมากกว่า 0" }),
});

const props = defineProps({
    isDialogOpen: Boolean,
    actionMode: String,
    dialogCancel: Function,
    dialogConfirm: Function,
    selectedPassenger: Object,
    selectedPassengerIndex: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (newValue) {
         resetForm();
         documentOptionsStore.getPurposeTypeOptions();
         if (props.actionMode === "edit") {
            console.log('props.selectedPassenger', props.selectedPassenger)
            formGroup.value = JSON.parse(JSON.stringify(props.selectedPassenger));
            formGroup.value.passengers = getInputDecimal(formGroup.value.passengers?.toString(), 0);
         } else {
            resetForm();
         }
      }
   }
);

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const formGroup = ref<any>({
   purposeTypeId: 0,
   passengers: "",
   detail: ""
});
const resetForm = () => {
   formGroup.value = {
      purposeTypeId: 0,
      passengers: "",
      detail: ""
   };
};

const handleFormError = (error: ZodError): void => {
   console.log(error);
};

async function onSubmit(
    event: FormSubmitEvent<z.output<typeof importPassengerSchema>>
  ) {
    const passengerItem = {
      id: 0,
      purposeTypeName: "Passenger",
      countryId: 0,
      countryName: "",
      cargoTypeId: 0,
      cargoTypeName: "",
      cargoWharfageId: 0,
      cargoWharfageName: "",
      productTypeId: 0,
      productTypeName: "",
      productGroupId: 0,
      productGroupName: "",
      productId: 0,
      productName: "",
      cargoOwnerId: 0,
      cargoOwnerName: "",
      mTonQty: 0,
      rTonQty: 0,
      blProduct: "",
      purposeTypeId: formGroup.value.purposeTypeId,
      passengers: formGroup.value.passengers,
      detail: formGroup.value.detail,
      is_delete: false,
    };


    if (props.actionMode === "create") {
      props.dialogConfirm!("create", passengerItem);
    } else if (props.actionMode === "edit") {
      props.dialogConfirm!("edit", formGroup.value.id ? formGroup.value : passengerItem, props.selectedPassengerIndex);
    } else if (props.actionMode === "delete") {
      passengerItem.is_delete = true;
      props.dialogConfirm!("delete", passengerItem, props.selectedPassengerIndex);
    }
  }

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
