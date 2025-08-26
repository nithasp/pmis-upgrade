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
            <p class="text-xl font-anuphan-semi-bold my-4">{{ $t("product_type_form_topic") }}</p>
            <p class="my-4">{{ $t("product_type_form_description") }}</p>
            <!-- form {{ form }}
            productTypeList {{productTypeList}} -->
            <UForm :schema="productTypeSchema" :state="form" @submit="submitForm">
               <div class="my-5">
                  <UFormGroup :label="$t('product_type_form_group_name')" required>
                     <!-- form {{ form }} -->
                     <!-- <p class="text-sm my-1">{{ $t("product_type_form_group_name") }}<span class="text-red-500"> *</span> :</p> -->
                     <USelectMenu
                        :label="$t('product_type_form_group_name')"
                        color="purple"
                        variant="outline"
                        name="name"
                        required
                        v-model="form"
                        :placeholder="$t('product_type_form_group_name_placeholder')"
                        option-attribute="product_group_name"
                        by="product_group_id"
                        creatable
                        searchable
                        @update:modelValue="handleItemCreated"
                        :options="productTypeList"
                        show-create-option-when="always"
                        :ui="{
                           base: 'h-9',
                        }"
                     />
                  </UFormGroup>
               </div>
               <div class="my-5">
                  <p class="text-sm my-1">{{ $t("product_type_form_type_name") }}<span class="text-red-500"> *</span> :</p>
                  <Input
                     type="text"
                     :placeholder="$t('product_type_form_type_name_placeholder')"
                     class=""
                     v-model="form.product_type_name"
                     name="product_type_name"
                     required
                  />
               </div>
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
import type { IProductTypeAdd, IProductTypeUpdate, IProductTypeDetail, IProductGroupGet, IProductTypeGet } from "~/core/interfaces/IProduct";
import UInputMenu from "~/components/form/u-input-menu.vue";

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const toast = useToast();

const props = defineProps({
   hideButton: {
      type: Boolean,
      default: false,
   },
   productTypeId: {
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
const { getProductGroup, getProductType, getProductTypeDetail, addProductType, updateProductType } = masterDataShipService();
const modal = ref(false);
const { t } = useI18n();

const productTypeOption = ref<IProductTypeGet[]>([]);

// const productTypeSchema = z.object({
//    product_type_name: z.string().min(1, "กรุณากรอกข้อมูล"),
//    product_group_id : z.number().min(0, "กรุณาเลือกข้อมูล"),
//    product_group_name : z.string().min(1, "กรุณาเลือกข้อมูล"),
// });
const productTypeSchema = z.object({
   product_type_name: z.string().min(1, t("required")),
   product_group_id: z.number().min(0, t("required")),
   product_group_name: z.string().min(1, t("required")).optional(),
});
//    .refine(data => {
//   // If product_group_name is provided, then product_group_id must also be provided
//   if (data.product_group_name !== undefined) {
//     return data.product_group_id !== undefined;
//   }
//   return true;
// }, {
//   message: t("product_group_id_required_if_name_provided"),
//   path: ["product_group_id"],
// });

watch(
   () => props.setOpen,
   (value) => {
      if (value) {
         openModal();
      }
   }
);
const isLoading = ref(false);
const openModal = () => {
   console.log("open");
   modal.value = true;
   getProductGroupList();
   if (props.editMode) {
      console.log("open getdetail");
      getProductTypeDetailById();
   } else {
   }
};
const form = ref<IProductTypeAdd | IProductTypeUpdate>({
   product_type_name: "",
   product_group_id: 0,
   product_group_name: "",
   status: false,
});
const productTypeList = ref([]);
const formProductType = ref({
   name: "",
   id: 0,
});
// const setForm = function () {
//    form.value.name = props.data.name;
// };
const emit = defineEmits(["fetch,close"]);
function handleItemCreated(newProductName) {
   // console.log("createa", newProductName.product_group_name);
   // Create a new product with id 0
   const newItem = {
      product_group_id: 0,
      product_group_name: newProductName.product_group_name,
      product_type_name: "",
   };
   form.value = newItem;
   // Add the newly created item to your options list
   // productTypeList.value.push(newItem);

   // Optionally, set the new item as the selected value
   //   selectedProduct.value = newItem.product_group_id;
}
async function getProductTypeDetailById() {
   try {
      const resp = await getProductTypeDetail(props.productTypeId);
      console.log("statusCode", resp.statusCode);
      console.log("resp", resp);
      if (resp.statusCode === 200) {
         form.value = resp.data;
         formProductType.value = {
            id: form.value.product_group_id,
            name: form.value.product_group_name,
         };
         console.log("get form", form.value, formProductType.value);
      }
   } catch (error) {}
}

const getProductGroupList = async () => {
   console.log("getProductGroupList");
   const resp = await getProductGroup();
   if (resp.statusCode === 200) {
      productTypeList.value = resp.data.map((item) => {
         return {
            product_group_id: item.id,
            product_group_name: item.name,
         };
      });
   }
};
async function submitForm(event: FormSubmitEvent<z.output<typeof productTypeSchema>>) {
   console.log("submitForm", formProductType.value);

   try {
      isLoading.value = true;
      let body = {
         product_type_name: form.value.product_type_name,
         status: form.value.status,
         product_group_id: form.value.product_group_id ? form.value.product_group_id : 0,
         product_group_name: form.value.product_group_name,
      };
      let resp;
      if (props.editMode) {
         resp = await updateProductType(props.productTypeId, body);
      } else {
         resp = await addProductType(body);
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
      product_type_name: "",
      product_group_id: 0,
      product_group_name: "",
      status: false,
   };
};
const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
