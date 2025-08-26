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
      <div class="p-6">
         <img :src="ShipVariantIcon" alt="ship-variant-icon" class="w-12 h-12" />

         <div class="my-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("port_schedule_waiting") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("port_schedule_detail_waiting") }}</div>
         </div>

         <Select
            :label="$t('jettys_list')"
            :placeholder="$t('jettys_list')"
            name="jettyId"
            v-model="form.jettyId"
            :options="documentOptionsStore.berthJettiesOptions"
            required
            :error="isFieldError('jettyId') ? fieldValidation.jettyId.message : ''"
         />

         <UFormGroup :label="$t('estimated_vessel_berth_date')" required class="my-4">
            <UPopover :popper="{ placement: 'bottom-start' }">
               <Input
                  name="etb"
                  size="md"
                  variant="outline"
                  color="purple"
                  custom-icon="calendar"
                  :value="form.etb ? `${format(form.etb, 'd MMM, yyy, HH:mm:ss')}` : ''"
                  :placeholder="$t('estimated_vessel_berth_date')"
                  :error="isFieldError('etb') ? fieldValidation.etb.message : ''"
                  :ui="{
                     wrapper: 'w-full rounded-md bg-white',
                  }"
               />

               <template #panel="{ close }">
                  <Datepicker v-model="form.etb" is24hr type="normal" mode="dateTime" />
               </template>
            </UPopover>
         </UFormGroup>

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
                   :error="isFieldError('etd') ? fieldValidation.etd.message : ''"
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
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full sm:w-[170px]" type="button" @click="handleSubmit" />
         </div>
      </div>
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
   <DialogAlert :title="dialogProp.title" :desc="dialogProp.desc" :type="dialogProp.type" :isOpen="isDialogAlertOpen" :setDialog="handleCloseAlertDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import ShipVariantIcon from "~/assets/icons/dialog/ship-variant.png";

import useDocumentService from "~/core/services/documentService";
const documentService = useDocumentService();
const documentOptionsStore = useDocumentOptionsStore();

const { t } = useI18n();
import { format } from "date-fns";
import type { IFormMitWaiting } from "~/core/interfaces/IShipTable";

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
         documentOptionsStore.getBerthJettiesOptions(props.itemData?.berthId);
         if (props.mode === "edit") {
            form.value.jettyId = props.itemData?.jettyId;
            form.value.etb = props.itemData?.etb ? new Date(props.itemData.etb) : null;
            form.value.etd = props.itemData?.etd ? new Date(props.itemData.etd) : null;
         }
      }
   }
);

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const form = ref<IFormMitWaiting | any>({
   jettyId: 0,
   etb: null,
   etd: null,
});
const dialogProp = ref({
   title: "",
   type: "",
   desc: "",
});
const resetForm = () => {
   form.value.jettyId = 0;
   form.value.etb = null;
   form.value.etd = null;
   setTimeout(() => {
      allFieldPristine(false);
   }, 100);
};

const handleSubmit = () => {
    allFieldPristine();
    if (!isFormGroupValid(form.value)) {
        return;
    }
    isDialogConfirmOpen.value = true;
};

const isDialogAlertOpen = ref<boolean>(false);
const handleCloseAlertDialog = (status: boolean) => {
   isDialogAlertOpen.value = status;
};

const isDialogConfirmOpen = ref(false);
const dialogConfirm = async () => {
   isLoading.value = true;
   const payload = {
      jettyId: form.value.jettyId,
      etb: convertTimezone(new Date(form.value.etb), 7, false),
      etd: convertTimezone(new Date(form.value.etd), 7, false),
   };
   const resp = await documentService.updateEtdDocumentBerth(props.itemData?.id, payload);
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

const fieldValidation = ref<any>({
   jettyId: { message: t("required"), pristine: false },
   etb: { message: t("required"), pristine: false },
   etd: { message: t("required"), pristine: false },
});
const allFieldPristine = (pristineValue: boolean = true) => {
   fieldValidation.value = Object.keys(fieldValidation.value).reduce((acc: any, key) => {
      acc[key] = { ...fieldValidation.value[key], pristine: pristineValue };
      return acc;
   }, {});
};
const isFieldError = (field: string) => {
   const value = form.value[field];
   const pristine = fieldValidation.value[field].pristine;

   if (!value && pristine) {
      fieldValidation.value[field].message = t("required");
      return true;
   }

   if (field === "etd" && value && new Date(value) < new Date(form.value.etb)) {
      fieldValidation.value[field].message = t("departure_day_or_time_gte");
      return true;
   }
   return false;
};
const isFormGroupValid = ({ etb, etd, ...fieldsToCheck }: IFormMitWaiting) => {
   const isDateValid = etb instanceof Date && etd instanceof Date && !isNaN(etb.getTime()) && !isNaN(etd.getTime()) && etd >= etb;
   const areFieldsValid = Object.values(fieldsToCheck).every((value) => value);
   return isDateValid && areFieldsValid;
};
</script>
