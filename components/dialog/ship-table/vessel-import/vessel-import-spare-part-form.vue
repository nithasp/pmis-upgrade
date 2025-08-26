<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      rounded: 'rounded-xl !max-w-[629px] w-full',
   }" :initialFocus="removeAutoFocus">
      <UForm :schema="sparePartSchema" :state="formGroup" @submit="onSubmit" v-on:error="handleFormError"
         class="p-6">
         <img :src="BoxVariant" alt="icon" class="w-12 h-12" />
         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("เพิ่มรายการ Spare Part") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("ระบุรายละเอียดสินค้า") }}</div>
         </div>
         <div class="mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-4">
               <SelectMenu :label="$t('วัตถุประสงค์')" name="purposeTypeId" :placeholder="$t('วัตถุประสงค์')"
               :options="documentOptionsStore.purposeTypeOptions.filter((item: any) => item.id === 4)" 
                  v-model="formGroup.purposeTypeId"  
                  required />
               <Input :label="$t('รายละเอียด')" name="detail" :placeholder="$t('รายละเอียด')" v-model="formGroup.detail"
                    />
            </div>
         </div>

         <div class="mt-8 grid grid-cols-[1fr_1fr] gap-3">
            <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
               class="rounded-lg w-full border border-gray-100 outline-none" @click="() => {
                  dialogCancel!(false);
               }" ref="removeAutoFocus" />
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full"
               type="submit" />
         </div>
      </UForm>
   </UModal>
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen"
      :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import SelectMenu from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import BoxVariant from "~/assets/icons/dialog/box-variant.png";
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore();
const sparePartSchema = z.object({
   purposeTypeId: z.number().min(1, t("required"))
});

const props = defineProps({
   isDialogOpen: Boolean,
   actionMode: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   selectedSparePart: Object,
   selectedSparePartIndex: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (newValue) {
         resetForm();
         documentOptionsStore.getPurposeTypeOptions();
         if (props.actionMode === "edit") {
            formGroup.value = JSON.parse(JSON.stringify(props.selectedSparePart));
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
   detail: "",
});
const resetForm = () => {
   formGroup.value = {
      purposeTypeId: 0,
      detail: "",
   };
};

const handleFormError = (error: ZodError): void => {
   console.log(error);
};

async function onSubmit(
   event: FormSubmitEvent<z.output<typeof sparePartSchema>>
) {
   const newItem = {
      id: 0,
      purposeTypeName: "Spare Part",
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
      props.dialogConfirm!("create", newItem);
   } else if (props.actionMode === "edit") {
      props.dialogConfirm!("edit", formGroup.value.id ? formGroup.value : newItem, props.selectedSparePartIndex);
   } else if (props.actionMode === "delete") {
      newItem.is_delete = true;
      props.dialogConfirm!("delete", newItem, props.selectedSparePartIndex);
   }
  }

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
