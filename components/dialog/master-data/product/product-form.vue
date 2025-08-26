<template>
   <div>
      <slot name="activator" :on="{ click: openModal }">
         <!-- Default activator can be defined here if needed -->
         <button v-if="!hideButton" class="py-2 px-4 rounded bg-primaryy" @click="openModal">เปิด</button>
      </slot>
      <UModal
         :modelValue="modal"
         :ui="{
            container: 'items-center',
            width: 'w-[95%] md:min-w-[400px]',
            rounded: 'rounded-3xl',
         }"
      >
         <div class="p-6">
            <img :src="ShipIcon" :alt="ShipIcon" class="w-12" />
            <p class="text-xl font-anuphan-semi-bold my-4">{{ $t("product_form_topic") }}</p>
            <p class="my-4">{{ $t("product_form_description") }}</p>
            <UForm :schema="productSchema" :state="form" @submit="submitForm">
               <div>
                  <p class="text-sm my-2">{{ $t("product_form_name") }}<span class="text-red-500"> *</span> </p>
                  <Input type="text" :placeholder="$t('productform_name_placeholder')" class="" v-model="form.name" name="name" :error="messageError" />
               </div>
               <SelectMenu
                  :label="$t('product_group_name')"
                  name="product_group_id"
                  :placeholder="$t('product_group_name_placeholder')"
                  :options="productGroupList"
                  v-model="form.product_group_id"
                  color="purple"
                  variant="outline"
                  required
                  value-attribute="id"
                  option-attribute="name"
                  searchable
                  :searchable-placeholder="$t('product_group_name_search_placeholder')"
                  class="mt-5"
               />
               <SelectMenu
                  :label="$t('product_type_name')"
                  name="product_group_id"
                  :placeholder="$t('product_type_name_placeholder')"
                  :options="productTypeList"
                  v-model="form.product_type_id"
                  :disabled="!form.product_group_id"
                  color="purple"
                  variant="outline"
                  required
                  value-attribute="id"
                  option-attribute="name"
                  searchable
                  :searchable-placeholder="$t('product_type_name_search_placeholder')"
                  class="mt-5"
               />
               <div class="mt-8 flex justify-between flex-wrap gap-y-3">
                  <UButton
                     size="lg"
                     color="white"
                     variant="solid"
                     :label="'ยกเลิก'"
                     block
                     class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
                     @click="closeModal(false)"
                     ref="removeAutoFocus"
                  />
                  <UButton size="lg" color="primary" variant="solid" block class="rounded-lg w-full sm:w-[170px]" type="submit" :label="'บันทึก'" />
               </div>
            </UForm>
         </div>
      </UModal>
      <DialogAlert title="บันทึกข้อมูล" desc="ข้อมูลนี้ถูกบันทึกแล้ว" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />

      <Loading v-if="isLoading" />
   </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input";
import Loading from "~/components/loading";
import ButtonSave from "~/components/button/save";
import ButtonCancel from "~/components/button/cancel";
import ShipIcon from "~/assets/icons/dialog/ship-variant2.png";
import DialogAlert from "~/components/dialog/alert.vue";
import masterDataShipService from "~/core/services/masterDataShipService/product/productService.ts";
import type { IProductAdd, IProductUpdate, IProductDetail, IProductGroupGet, IProductTypeGet } from "~/core/interfaces/IProduct";
import SelectMenu from "~/components/form/u-select.vue";

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const toast = useToast();

const props = defineProps({
   hideButton: {
      type: Boolean,
      default: false,
   },
   productId: {
      type: Number,
      required: false,
      default: null,
   },
   editMode: {
      type: Boolean,
      required: false,
      default: false,
   },
   setOpen: {
      type: Boolean,
      required: false,
      default: false,
   },
   data: {
      type: Object,
      required: false,
   },
});
const { addProduct, updateProduct, getProductDetailById, getProductGroup, getProductTypeByProductTypeId } = masterDataShipService();
const modal = ref(false);

const productGroupList = ref<IProductGroupGet[]>([]);
const productTypeList = ref<IProductTypeGet[]>([]);

const productSchema = z.object({
   name: z.string().min(1, "กรุณากรอกข้อมูล"),
   product_group_id: z.number().min(1, "กรุณาเลือกข้อมูล"),
   product_type_id: z.number().min(1, "กรุณาเลือกข้อมูล"),
});
watch(
   () => props.setOpen,
   (value) => {
      console.log("get detail", props.data.name);
      if (value) {
         openModal();
      }
   }
);

const messageError = ref("");
const isLoading = ref(false);
const openModal = () => {
   console.log("open");
   modal.value = true;
   getProductGroupList();
   if (props.editMode) {
      console.log("open getdetail");
      getProductDetail();
   } else {
   }
};
const form = ref<IProductAdd | IProductUpdate>({
   name: "",
   product_group_id: 0,
   product_type_id: 0,
});
watch(
   () => form.value.product_group_id,
   (value) => {
      if (value) {
         getProductTypeList(value);
      }
   }
);
// const setForm = function () {
// };
const emit = defineEmits(["fetch,close"]);
async function getProductDetail() {
   try {
      console.log("getProductDetail", props.productId);
      let resp = await getProductDetailById(props.productId);
      //    console.log('getProductDetail',resp)
      if (resp.statusCode === 200) {
         console.log("getProductDetail", resp.data);
         form.value = resp.data;
         // getProductTypeList(form.value.product_group_id);
      }
   } catch (error) {
      console.error(error);
   }
}
async function getProductGroupList() {
   try {
      const resp = await getProductGroup();
      if (resp.statusCode === 200) {
         productGroupList.value = resp.data;
      }
   } catch (error) {}
}
async function getProductTypeList(id: number) {
   try {
      if (id) {
         const resp = await getProductTypeByProductTypeId(id);
         if (resp.statusCode === 200) {
            productTypeList.value = resp.data.map((item: IProductTypeGet) => ({ id: item.product_type_id, name: item.product_type_name }));
         }
      }
   } catch (error) {}
}
async function submitForm(event: FormSubmitEvent<z.output<typeof productSchema>>) {
   console.log("submitForm2222");

   try {
      isLoading.value = true;
      const body = {
         name: form.value.name,
         product_type_id: form.value.product_type_id,
         product_group_id: form.value.product_group_id,
      };
      let resp;
      if (props.editMode) {
         resp = await updateProduct(props.productId, form.value);
      } else {
         resp = await addProduct(form.value);
      }
      console.log("submitted", resp);
      if (resp.statusCode === 200) {
         isDialogSuccessOpen.value = true;
         emit("fetch");
         closeModal();
      } else {
         toast.add({ title: resp?.message, color: "red" });
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
}
const closeModal = () => {
   clearForm();
   emit("close");
   modal.value = false;
};
const clearForm = () => {
   form.value = {
      name: "",
      product_group_id: 0,
      product_type_id: 0,
   };
};
const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
