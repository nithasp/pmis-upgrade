<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      rounded: 'rounded-xl !max-w-[480px] w-full',
   }" :initialFocus="removeAutoFocus">
      <UForm :schema="inventorySchema" :state="formData" @submit="onSubmit" class="p-6">
         <img :src="PortraitVariant" alt="portrait-variant-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("add_inventory") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("specify_inventory_details") }}</div>
         </div>

         <div class="mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-4">
               <SelectMenu :label="$t('product_group')" name="product_group_id" :placeholder="$t('product_group')"
                  v-model="formData.product_group_id" value-attribute="id" option-attribute="name"
                  :options="productGroupList" class="w-full" required @change="handleProductGroup" />
               <SelectMenu :label="$t('product_kind')" name="product_type_id" :placeholder="$t('product_kind')"
                  v-model="formData.product_type_id" value-attribute="product_type_id"
                  option-attribute="product_type_name" :disabled="!formData.product_group_id" :options="productTypeList"
                  class="w-full" required @change="handleProductType" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-4">
               <InputNumber :label="$t('mt_cargo')" name="mTonQty" placeholder="0.000" v-model="formData.mTonQty"
                  :decimal="3" suffix="M/Ton" required />
               <InputNumber :label="$t('rt_cargo')" name="rTonQty" placeholder="0.000" v-model="formData.rTonQty"
                  :decimal="3" suffix="R/Ton" required />
            </div>
         </div>

         <div class="mt-8 grid grid-cols-[1fr_1fr] gap-3">
            <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
               class="rounded-lg w-full border border-gray-100 outline-none" @click="() => dialogCancel!(false)"
               ref="removeAutoFocus" />
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
import InputNumber from "~/components/form/input-number.vue";
import SelectMenu from "~/components/form/u-select.vue";
import DatePicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import PortraitVariant from "~/assets/icons/dialog/portrait-variant.png";
import { format } from "date-fns";
import productService from "~/core/services/masterDataShipService/product/productService";

const { getProductGroup, getProductType, getProductTypeByProductTypeId } = productService();

const { t } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const inventorySchema = z.object({
   product_group_id: z.number().min(1, t("required")),
   product_type_id: z.number().min(1, t("required")),
   mTonQty: z.string().min(1, t("required")),
   rTonQty: z.string().min(1, t("required")),
});

const props = defineProps({
   isDialogOpen: Boolean,
   mode: String,
   vesselType: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   addData: Function,
   editData: Function,
   documentId: {
      type: [Number, String],
   },
   vesselId: {
      type: [Number, String],
   },
   itemId: {
      type: [Number, String],
      default: 0,
   },
   itemData: {
      type: Object,
      default: () => ({}),
   },
});
const formData = ref<any>({
   id: 0,
   product_group_id: 0,
   product_group_name: "",
   product_type_id: 0,
   product_type_name: "",
   mTonQty: "",
   rTonQty: "",
});
const clearForm = () => {
   formData.value = {
      id: 0,
      product_group_id: 0,
      product_group_name: "",
      product_type_id: 0,
      product_type_name: "",
      mTonQty: "",
      rTonQty: "",
   };
};
watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (props.isDialogOpen) {
         if (props.mode === "edit") {
            const { id, product_group_id, product_group_name, product_type_id, product_type_name, mTonQty, rTonQty } = props.itemData;
            formData.value = {
               id: id,
               product_group_id: product_group_id,
               product_group_name: product_group_name,
               product_type_id: product_type_id,
               product_type_name: product_type_name,
               mTonQty: getInputDecimal(mTonQty?.toString(), 3),
               rTonQty: getInputDecimal(rTonQty?.toString(), 3),
            };
         }
         getProductGroupList();
      } else {
         clearForm();
      }
   }
);

const removeAutoFocus = ref(null);
const isLoading = ref<Boolean>(false);
const productGroupList = ref<any>([]);
const productTypeList = ref<any>([]);

const getProductGroupList = async () => {
   try {
      isLoading.value = true;
      const resp = await getProductGroup();
      if (resp.statusCode === 200) {
         const { data } = resp;
         productGroupList.value = data;
         if (props.itemData.product_group_id) {
            getProductTypeList(props.itemData.product_group_id);
         }
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

const getProductTypeList = async (productGroupId: number) => {
   try {
      isLoading.value = true;
      const resp = await getProductTypeByProductTypeId(productGroupId);
      if (resp.statusCode === 200) {
         const { data } = resp;
         productTypeList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

const handleProductGroup = (productGroupId: number) => {
   getProductTypeList(productGroupId);
   formData.value.product_group_name = productGroupList.value.find((item: any) => item.id === productGroupId)?.name;
   formData.value.product_type_id = 0;
};

const handleProductType = (productTypeId: number) => {
   formData.value.product_type_name = productTypeList.value.find((item: any) => item.product_type_id === productTypeId)?.product_type_name;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof inventorySchema>>) {
   const { id, product_group_id, product_type_id, product_type_name, product_group_name, mTonQty, rTonQty } = formData.value;
   let body = {
      id,
      product_group_id: product_group_id,
      product_type_id: product_type_id,
      product_type_name: product_type_name,
      product_group_name: product_group_name,
      mTonQty: removeCommaAndConvertToNumber(mTonQty),
      rTonQty: removeCommaAndConvertToNumber(rTonQty),
   };
   if (props.mode === "create") {
      props.addData!(body);
   } else {
      props.editData!(body);
   }
   props.dialogConfirm!(false);
   clearForm();
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
