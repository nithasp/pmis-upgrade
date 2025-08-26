<template>
   <UModal
     :modelValue="isDialogOpen"
     :ui="{
       container: 'items-center',
       rounded: 'rounded-xl !max-w-[480px] w-full'
     }"
     :initialFocus="removeAutoFocus"
   >
     <UForm
       :schema="vesselImportProductSchema"
       :state="formGroup"
       @submit="onSubmit"
       class="p-6"
     >
     <img :src="BoxVariant" alt="portrait-variant-icon" class="w-12 h-12" />
          <div class="mt-5 mb-6">
             <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">
                {{ props.mode === "create" ? $t("add_inventory") : $t("edit_inventory") }}
             </div>
             <div class="text-[#667085] text-sm">{{ $t("specify_inventory_details") }}</div>
          </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:mt-0">
         <Select
           :label="$t('purpose')"
           :placeholder="$t('purpose_type')"
           name="purposeTypeId"
           v-model="formGroup.purposeTypeId"
           :options="documentOptionsStore.purposeTypeOptions.filter((item: any) =>
             [1, 2, 3].includes(item.id)
           )"
           required
           class="w-full"
         />
         <Select
           :label="$t('berth_position')"
           :placeholder="$t('cargo_wharfage')"
           name="cargoTypeId"
           v-model="formGroup.cargoTypeId"
           :options="documentOptionsStore.cargoTypesOptions"
           required
           class="w-full"
         />
         <Select
           v-if="!isDocumentBerthOfficer"
           :label="$t('cargo_wharfage')"
           :placeholder="$t('cargo_wharfage')"
           name="cargoWharfageId"
           v-model="formGroup.cargoWharfageId"
           :options="documentOptionsStore.cargoWharfageOptions"
           required
           class="w-full"
         />
       </div>

       <div class="my-5">
         <UFormGroup :label="$t('product_name')" name="productName" required>
           <USelectMenu
             :label="$t('product_name')"
             :placeholder="$t('search')"
             color="purple"
             variant="outline"
             :options="productList"
             v-model="product"
             option-attribute="name"
             :by="product.id ? 'id' : 'uniqueKey'"
             @update:modelValue="handleProductCreated"
             @change="handleProductName"
             creatable
             searchable
             required
             show-create-option-when="always"
             :class="[!formGroup.productName ? '[&_button]:text-grayy-75' : '', 'w-full']"
             :ui="{ base: 'h-9' }"
           />
         </UFormGroup>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:mt-0">
         <Select
           :label="$t('product_group')"
           name="productGroupId"
           :placeholder="$t('product_group')"
           v-model="formGroup.productGroupId"
           value-attribute="id"
           option-attribute="name"
           :options="productGroupList"
           required
           @change="handleProductGroup"
           class="w-full"
         />
         <Select
           :label="$t('product_kind')"
           name="productTypeId"
           :placeholder="$t('product_kind')"
           v-model="formGroup.productTypeId"
           value-attribute="product_type_id"
           option-attribute="product_type_name"
           :disabled="!formGroup.productGroupId"
           :options="productTypeList"
           required
           @change="handleProductType"
           class="w-full"
         />
         <InputNumber
           :label="$t('product_quantity')"
           name="mTonQty"
           placeholder="0.000"
           v-model="formGroup.mTonQty"
           :decimal="3"
           suffix="M/Ton"
           required
           class="w-full md:mt-0"
         />
         <InputNumber
           :label="$t('product_quantity')"
           name="rTonQty"
           placeholder="0.000"
           v-model="formGroup.rTonQty"
           :decimal="3"
           suffix="R/Ton"
           required
           class="w-full md:mt-0"
         />
         <Input
           :label="$t('B/L')"
           name="blProduct"
           :placeholder="$t('B/L')"
           v-model="formGroup.blProduct"
           required
           class="w-full md:mt-0"
         />
         <UFormGroup
           :label="$t('cargo_owner')"
           name="cargoOwnerName"
           required
           class="w-full md:mt-0"
         >
           <USelectMenu
             :label="$t('cargo_owner')"
             :placeholder="$t('cargo_owner')"
             color="purple"
             variant="outline"
             :options="cargoOwnerList"
             v-model="cargoOwner"
             option-attribute="name"
             :by="cargoOwner.id ? 'id' : 'uniqueKey'"
             @update:modelValue="handleCargoOwnerCreated"
             @change="handleCargoOwnerName"
             creatable
             searchable
             required
             show-create-option-when="always"
             :class="[!formGroup.cargoOwnerName ? '[&_button]:text-grayy-75' : '', 'w-full']"
             :ui="{ base: 'h-9' }"
           />
         </UFormGroup>

         <div class="col-span-1 md:col-span-2 md:mt-0">
           <Select
             :label="$t('ประเทศต้นทาง/ปลายทาง')"
             name="countryId"
             :placeholder="$t('ประเทศต้นทาง/ปลายทาง')"
             required
             :searchable-placeholder="$t('search_country')"
             value-attribute="id"
             option-attribute="name"
             v-model="formGroup.countryId"
             searchable
             :options="addressOptionsStore.countriesOption"
             @change="handleCountryName"
             class="w-full"
           />
         </div>
       </div>

       <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
         <UButton
           size="lg"
           color="white"
           variant="solid"
           :label="$t('cancel')"
           block
           class="rounded-lg w-full border border-gray-100 outline-none"
           @click="() => dialogCancel!(false)"
           ref="removeAutoFocus"
         />
         <UButton
           size="lg"
           color="primary"
           variant="solid"
           :label="$t('confirm')"
           block
           class="rounded-lg w-full"
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
import InputNumber from "~/components/form/input-number.vue";
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import BoxVariant from "~/assets/icons/dialog/box-variant.png";

import productService from "~/core/services/masterDataShipService/product/productService";
import useDocumentService from "~/core/services/documentService";
const { getProductGroup, getProductType, getProductTypeByProductTypeId } = productService();
const documentOptionsStore = useDocumentOptionsStore();
const addressOptionsStore = useAddressOptionsStore()

const authStore = useAuthStore();
const isDocumentBerthOfficer = authStore.profileUser?.roleType === "DocumentBerthOfficer";
const { t } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const vesselImportProductSchema = z.object({
   purposeTypeId: z.number().min(1, t("required")),
   cargoTypeId: z.number().min(1, t("required")),
   cargoWharfageId: isDocumentBerthOfficer ? z.optional(z.number()) : z.number().min(1, t("required")),
   productTypeId: z.number().min(1, t("required")),
   productGroupId: z.number().min(1, t("required")),
   productName: z.string().min(1, t("required")),
   mTonQty: z.string().min(1, t("required")),
   rTonQty: z.string().min(1, t("required")),
   blProduct: z.string().min(1, t("required")),
   cargoOwnerName: z.string().min(1, t("required")),
   countryId: z.number().min(1, t("required"))
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
const formGroup = ref<any>({
   purposeTypeId: 0,
   cargoTypeId: 0,
   cargoWharfageId: 0,
   productTypeId: 0,
   productGroupId: 0,
   product_type_name: "",
   mTonQty: "",
   rTonQty: "",
   blProduct: "",
   productId: 0,
   productName: "",
   productUniqueKey: "",
   cargoOwnerNameId: 0,
   cargoOwnerName: "",
   cargoOwnerUniqueKey: "",
   countryId : 0, 
   countryName: ""
});
const clearForm = () => {
   formGroup.value = {
      purposeTypeId: 0,
      cargoTypeId: 0,
      cargoWharfageId: 0,
      productTypeId: 0,
      productGroupId: 0,
      product_type_name: "",
      mTonQty: "",
      rTonQty: "",
      blProduct: "",
      productId: 0,
      productName: "",
      productUniqueKey: "",
      cargoOwnerNameId: 0,
      cargoOwnerName: "",
      cargoOwnerUniqueKey: "",
      countryId : 0, 
      countryName: ""
   };
   product.value = {
      id: 0,
      uniqueKey: "",
      name: "",
   };
   cargoOwner.value = {
      id: 0,
      uniqueKey: "",
      name: "",
   };
};
watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (props.isDialogOpen) {
         if (props.mode === "edit") {
            formGroup.value = JSON.parse(JSON.stringify(props.itemData));
            formGroup.value.mTonQty = getInputDecimal(formGroup.value.mTonQty?.toString(), 3);
            formGroup.value.rTonQty = getInputDecimal(formGroup.value.rTonQty?.toString(), 3);
            product.value = {
               id: props.itemData.productId,
               uniqueKey: props.itemData.productUniqueKey,
               name: props.itemData.productName,
            };
            cargoOwner.value = {
               id: props.itemData.cargoOwnerId,
               uniqueKey: props.itemData.cargoOwnerUniqueKey,
               name: props.itemData.cargoOwnerName,
            };

            console.log("props.itemData", props.itemData);
            console.log("product.value", product.value);
            console.log(" cargoOwner.value", cargoOwner.value);
         }
         addressOptionsStore.getCountriesOptions();
         getMasterDataList();
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
const productList = ref<any>([]);
const cargoOwnerList = ref<any>([]);

const getProductGroupList = async () => {
   try {
      isLoading.value = true;
      const resp = await getProductGroup();
      if (resp.statusCode === 200) {
         const { data } = resp;
         productGroupList.value = data;
         if (props.itemData?.productGroupId) {
            getProductTypeList(props.itemData.productGroupId);
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

const getMasterDataList = async () => {
   try {
      isLoading.value = true;
      await Promise.all([
         documentOptionsStore.getPurposeTypeOptions(),
         documentOptionsStore.getCargoTypesOptions(),
         documentOptionsStore.getCargoWharfageOptions(),
         documentOptionsStore.getProductOptions(),
         documentOptionsStore.getCargoOwnerOptions(),
      ]);
      productList.value = documentOptionsStore.productsOptions.map((item: any) => ({
         ...item,
         uniqueKey: `id-${item.id}`,
      }));
      cargoOwnerList.value = documentOptionsStore.cargoOwnerOptions.map((item: any) => ({
         ...item,
         uniqueKey: `id-${item.id}`,
      }));

      if (props.mode === "edit") {
         if (props.itemData.productId === 0) {
            productList.value.push({
               id: props.itemData.productId,
               uniqueKey: props.itemData.productUniqueKey,
               name: props.itemData.productName,
            });
         }
         if (props.itemData.cargoOwnerId === 0) {
            cargoOwnerList.value.push({
               id: props.itemData.cargoOwnerId,
               uniqueKey: props.itemData.cargoOwnerUniqueKey,
               name: props.itemData.cargoOwnerName,
            });
         }
      }
   } catch (error) {
      console.error("Failed to fetch master data:", error);
   } finally {
      isLoading.value = false;
   }
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof vesselImportProductSchema>>) {
   const body = {
      ...formGroup.value,
      cargoWharfageId: isDocumentBerthOfficer ? 0 : formGroup.value.cargoWharfageId,
      productTypeName: formGroup.value.product_type_name,
      productGroupName: formGroup.value.product_group_name,
   };
   delete body.product_type_name;
   delete body.product_group_name;
   if (props.mode === "create") {
      props.addData!(body);
   } else {
      props.editData!(body);
   }
   props.dialogConfirm!(false);
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

const handleProductGroup = (productGroupId: number) => {
   getProductTypeList(productGroupId);
   formGroup.value.product_group_name = productGroupList.value.find((item: any) => item.id === productGroupId)?.name;
   formGroup.value.productTypeId = 0;
};
const handleProductType = (productTypeId: number) => {
   formGroup.value.product_type_name = productTypeList.value.find((item: any) => item.product_type_id === productTypeId)?.product_type_name;
};

const product = ref<any>({
   id: 0,
   uniqueKey: 0,
   name: "",
});
const handleProductCreated = (newProductName: any) => {
   if (!newProductName.hasOwnProperty("id")) {
      const newItem = {
         id: 0,
         name: newProductName.name,
         uniqueKey: generateRandomId(),
      };
      product.value.name = newItem.name;
      product.value.uniqueKey = newItem.uniqueKey;
      formGroup.value.productUniqueKey = newItem.uniqueKey;
      productList.value.push(newItem);
   }
};
const handleProductName = (product: any) => {
   formGroup.value.productId = product.id ? product.id : 0;
   formGroup.value.productName = product.name;
   formGroup.value.productUniqueKey = product.uniqueKey;
};

const cargoOwner = ref<any>({
   id: 0,
   uniqueKey: 0,
   name: "",
});
const handleCargoOwnerCreated = (newCargoOwnerName: any) => {
   if (!newCargoOwnerName.hasOwnProperty("id")) {
      const newItem = {
         id: 0,
         name: newCargoOwnerName.name,
         uniqueKey: generateRandomId(),
      };
      cargoOwner.value.name = newItem.name;
      cargoOwner.value.uniqueKey = newItem.uniqueKey;
      formGroup.value.cargoOwnerUniqueKey = newItem.uniqueKey;
      cargoOwnerList.value.push(newItem);
   }
};
const handleCargoOwnerName = (cargoOwner: any) => {
   formGroup.value.cargoOwnerId = cargoOwner.id ? cargoOwner.id : 0;
   formGroup.value.cargoOwnerName = cargoOwner.name;
   formGroup.value.cargoOwnerUniqueKey = cargoOwner.uniqueKey;
};
const handleCountryName = (countryId: any) => {
   const country: any = addressOptionsStore.countriesOption.find((item: any) => item.id === countryId);
   formGroup.value.countryId = country.id ? country.id : 0;
   formGroup.value.countryName = country.name;
};
</script>
