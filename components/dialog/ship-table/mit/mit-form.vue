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
      <UForm :schema="mitSchema" :state="form" @submit="onSubmit" class="p-6">
         <img :src="ShipVariantIcon" alt="ship-variant-icon" class="w-12 h-12" />

         <div class="my-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("port_schedule") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("port_schedule_detail") }}</div>
         </div>

         <UFormGroup :label="$t('estimated_vessel_departure_date')" required>
            <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                  name="etd"
                  size="md"
                  variant="outline"
                  color="purple"
                  custom-icon="calendar"
                  :value="form.etd ? `${format(form.etd, 'd MMM, yyy, HH:mm:ss')}` : ''"
                  :placeholder="$t('estimated_vessel_departure_date')"
                  :ui="{
                     wrapper: 'w-full rounded-md bg-white',
                  }"
               />

               <template #panel="{ close }">
                  <Datepicker v-model="form.etd" is24hr type="normal" mode="dateTime" />
               </template>
            </UPopover>
         </UFormGroup>

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
   <DialogConfirm
      icon="warning"
      :title="$t('save_title')"
      :desc="$t('save_description')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogConfirmOpen"
      :dialogCancel="dialogConfirmCancel"
      :dialogConfirm="dialogConfirm"
   />
   <DialogAlert
      :title="dialogProp.title"
      :desc="dialogProp.desc"
      :type="dialogProp.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseAlertDialog"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import ShipVariantIcon from "~/assets/icons/dialog/ship-variant.png";

import useDocumentService from "~/core/services/documentService";
const documentService: any = useDocumentService();

const { t } = useI18n();
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import type { IFormMit } from "~/core/interfaces/IShipTable";

const mitSchema = z.object({
   etd: z.any().refine((val) => val !== undefined && val !== null, {
      message: t("required"),
   }),
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
   itemData: Object,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      resetForm();
      if (props.isDialogOpen) {
         if (props.mode === "edit") {
            form.value.etd = props.itemData?.etd ? new Date(props.itemData.etd) : null;
         }
      }
   }
);

const removeAutoFocus = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const form = ref<IFormMit | any>({
   etd: null,
});
const dialogProp = ref({
   title: "",
   type: "",
   desc: "",
});
const resetForm = () => {
   form.value.etd = null;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof mitSchema>>) {
   isDialogConfirmOpen.value = true;
}

const isDialogAlertOpen = ref<boolean>(false);
const handleCloseAlertDialog = (status: boolean) => {
   isDialogAlertOpen.value = status;
};

const isDialogConfirmOpen = ref<boolean>(false);
const dialogConfirm = async () => {
   const payload = {
      etd: convertTimezone(new Date(form.value.etd), 7, false)
   }
   isLoading.value = true;
   const resp = await documentService.updateDocumentVesselIn(props.itemData?.id, payload);
   if (resp.statusCode === 200) {
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("save_title"),
         desc: t("save_success"),
         type: "success",
      };
      isDialogConfirmOpen.value = false;
      props.dialogConfirm!(false, "refresh");
   } else {
      isDialogAlertOpen.value = true;
      dialogProp.value = {
         title: t("error_title"),
         desc: t("error_try_again"),
         type: "danger",
      };
      isDialogConfirmOpen.value = false;
   }
   isLoading.value = false;
};
const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};
</script>
