<template>
   <UModal :modelValue="isDialogOpen" :ui="{
       container: 'items-center',
       width: 'w-full max-w-[548px]',
       rounded: 'rounded-xl'
    }" :initialFocus="removeAutoFocus">
     <UForm :schema="berthSchema" :state="form" @submit="onSubmit" v-on:error="handleFormError" class="p-6">
       <img :src="ShipVariant" alt="ship-variant-icon" class="w-12 h-12" />
 
       <div class="mt-5">
         <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">
           {{ $t("berth_info") }}
         </div>
         <div class="text-[#667085] text-sm">
           {{ $t("product_details") }}
         </div>
       </div>
 
       <div class="mt-5">
         <div class="flex flex-col sm:flex-row gap-6">
           <Input
             :label="$t('name_short')"
             name="name_alt"
             :placeholder="$t('name_short')"
             v-model="form.name_alt"
             required
             class="w-full"
           />
           <SelectMenu
             :label="$t('berth_type')"
             name="berth_type"
             :options="documentOptionsStore.berthTypesOption"
             v-model="form.berth_type"
             required
             class="w-full"
           />
         </div>
         <Input
           :label="$t('name_th')"
           name="name_th"
           :placeholder="$t('name_th')"
           v-model="form.name_th"
           required
           class="mt-5"
         />
         <Input
           :label="$t('name_en')"
           name="name_en"
           :placeholder="$t('name_en')"
           v-model="form.name_en"
           required
           class="mt-5"
         />
         <div id="jetty" class="mt-5">
           <h2 class="text-sm font-anuphan-semi-bold text-grayy-900 mb-1">
             {{ $t("sub_jetty") }}
           </h2>
           <label class="mb-5 text-grayy-700 text-sm">
             {{ $t("sub_jetty_name") }} <span class="text-red-500">*</span>
           </label>
 
           <div v-for="(jetty, index) in form.jettys" :key="`jetty-${index}`" class="mb-1">
             <Input
               :placeholder="$t('sub_jetty_name')"
               v-model="jetty.name"
               :error="jetty.isRequired"
               @keyup="checkJettyItems"
               required
             />
             <div v-if="jetty.isRequired" class="text-red-500 text-sm mt-1 mb-2">
               {{ $t("required_message") }}
             </div>
           </div>
 
           <div class="mt-5">
             <UButton
               class="bg-grayy-25 hover:bg-grayy-25 text-grayy-400 border border-solid border-[#D0D5DD] [&_span]:font-anuphan-semi-bold"
               outlined
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('add_sub_jetty')"
               @click="addJetty"
             />
           </div>
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
import SelectMenu from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import ShipVariant from "~/assets/icons/dialog/ship-variant.png";

import type { IBerthAdd, IBerthUpdate } from "~/core/interfaces/IBerth";
import type { IVesselTypeList } from "~/core/interfaces/IVessel";
import type { IFilterVesselType } from "~/core/interfaces/IFilterVesselType";
import type { IJetty } from "~/core/interfaces/IBerth";

import masterDataShipService from "~/core/services/masterDataShipService/vesselService";
import useBerthService from "~/core/services/masterDataShipService/port/berthService";
const { getVesselType } = masterDataShipService();
const { addBerth, updateBerth, getBerthDetail } = useBerthService();
const documentOptionsStore = useDocumentOptionsStore();

const { t } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const jettySchema = z.object({
   name: z.string().min(1, { message: t("required") }),
});
const berthSchema = z.object({
   jettys: z.array(jettySchema).min(1, { message: "At least one jetty is required." }),
   name_alt: z.string().min(1, t("required")),
   name_en: z.string().min(1, t("required")),
   name_th: z.string().min(1, t("required")),
   berth_type: z.string().min(1, t("required")),
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
      console.log(documentOptionsStore.berthTypesOption);
      if (props.isDialogOpen) {
         documentOptionsStore.getBerthTypesOptions();
         if (props.mode === "edit") {
            handleGetBerthDetail();
         }
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);

const form = ref<IBerthAdd | IBerthUpdate>({
   jettys: [{ name: "", isRequired: false }],
   name_alt: "",
   name_en: "",
   name_th: "",
   berth_type: "",
});

const resetForm = () => {
   form.value.jettys = [{ name: "", isRequired: false }];
   form.value.name_alt = "";
   form.value.name_en = "";
   form.value.name_th = "";
   form.value.berth_type = "";
};

const filterVesselType = ref<IFilterVesselType>({
   limit: -1,
   page: 1,
   search: "",
   status: "",
});

const handleGetBerthDetail = async () => {
   isLoading.value = true;
   const resp = await getBerthDetail(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
      };
   } else {
      console.error("get berth detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

const addJetty = () => {
   form.value.jettys.push({ name: "", isRequired: false });
};

const checkJettyItems = () => {
   const updatedJettyItems = form.value.jettys.map((i: IJetty) => ({
      ...i,
      isRequired: !i.name ? true : false,
   }));
   form.value.jettys = updatedJettyItems;
};

const handleFormError = (error: ZodError): void => {
   checkJettyItems();
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof berthSchema>>) {
   checkJettyItems();

   form.value = {
      ...form.value,
      jettys: form.value.jettys.map((i: IJetty) => ({ name: i.name })),
   };

   isLoading.value = true;
   const resp = props.mode === "edit" ? await updateBerth(props.itemId!, form.value) : await addBerth(form.value);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} berth error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
