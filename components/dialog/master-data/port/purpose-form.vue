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
      <UForm :schema="purposeSchema" :state="form" @submit="onSubmit" class="p-6">
         <img :src="BlockVariantIcon" alt="block-variant-icon" class="w-12 h-12" />
         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("purpose_docking") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("specify_purpose_docking") }}</div>
         </div>
         <div class="mt-5">
            <UFormGroup :label="$t('purpose_type')" required>
               <USelectMenu
                  :label="$t('purpose_type')"
                  color="purple"
                  variant="outline"
                  name="purpose_type_id"
                  required
                  v-model="form.purpose_type_id"
                  :placeholder="$t('search')"
                  option-attribute="purpose_type_name"
                  value-attribute="purpose_type_id"
                  searchable
                  :options="purposeList"
               />
            </UFormGroup>
         </div>
         <Input :label="$t('purpose_docking')" name="purpose" :placeholder="$t('purpose_docking')" v-model="form.purpose_name" required class="mt-5" />

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
import BlockVariantIcon from "~/assets/icons/dialog/block-variant.png";

import usePurposeService from "~/core/services/masterDataShipService/port/purposeService";
const { addPurpose, updatePurpose, getPurposeDetailById, getPurposeType } = usePurposeService();
const { t } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { IPurposeAdd, IPurposeGet, IPurposeUpdate } from "~/core/interfaces/IPurpose";
const purposeSchema = z.object({
   purpose_type_id: z.number().min(1, t("required")),
   purpose_name: z.string().min(1, t("required")),
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
         handleGetPurposeDetail();
      }
      if (props.isDialogOpen) {
         getPurposeTypeList();
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const purposeList = ref([]);

const form = ref<IPurposeAdd | IPurposeUpdate>({
   purpose_type_id: 0,
   purpose_type_name: "",
   purpose_name: "",
   status: true,
});

const resetForm = () => {
   form.value.purpose_type_id = 0;
   form.value.purpose_type_name = "";
   form.value.purpose_name = "";
   form.value.status = true;
};

const handleGetPurposeDetail = async () => {
   isLoading.value = true;
   const resp = await getPurposeDetailById(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
      };
   } else {
      console.error("get purpose detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};
const getPurposeTypeList = async () => {
   const resp = await getPurposeType();
   if (resp.statusCode === 200) {
      purposeList.value = resp.data.map((item: IPurposeGet) => {
         return {
            purpose_type_id: item.id,
            purpose_type_name: item.name,
         };
      });
   }
};
async function onSubmit(event: FormSubmitEvent<z.output<typeof purposeSchema>>) {
   isLoading.value = true;
   let body = {
      purpose_name: form.value.purpose_name,
      status: form.value.status,
      purpose_type_id: form.value.purpose_type_id,
      purpose_type_name: form.value.purpose_type_name,
   };
   const resp = props.mode === "edit" ? await updatePurpose(props.itemId!, body) : await addPurpose(body);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} purpose error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
