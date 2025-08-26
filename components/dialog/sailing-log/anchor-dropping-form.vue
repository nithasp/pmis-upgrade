<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         rounded: 'rounded-xl !max-w-[629px] w-full',
      }"
      :initialFocus="removeAutoFocus"
   >
      <UForm :schema="anchorDroppingSchema" :state="formGroup" @submit="onSubmit" v-on:error="handleFormError" class="p-6">
         <img :src="MarkerVariant" alt="marker-variant-icon" class="w-12 h-12" />
         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("anchor_list") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("anchor_detail") }}</div>
         </div>
         <div class="mt-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-4">
               <SelectMenu
                  :label="$t('waiting_for_berth')"
                  name="berth_id"
                  :placeholder="$t('berth')"
                  :options="documentOptionsStore.berthsOption"
                  v-model="formGroup.berth_id"
                  class="w-full"
                  required
               />

               <UFormGroup :label="$t('pilot_appointment_date')" required>
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input
                        name="pilot_date"
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.pilot_date"
                        :value="formGroup.pilot_date ? format(new Date(formGroup.pilot_date), 'd MMM, yyyy, HH:mm') : ''"
                        :placeholder="$t('pilot_appointment_date')"
                        :error="isDateError('pilot_date') ? dateValidation.pilot_date.message : ''"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

                     <template #panel="{ close }">
                        <Datepicker v-model="pilotDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onPilotDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>

               <UFormGroup :label="$t('anchor_date')" required>
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input
                        name="anchor_date"
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.anchor_date"
                        :value="formGroup.anchor_date ? format(new Date(formGroup.anchor_date), 'd MMM, yyyy, HH:mm') : ''"
                        :placeholder="$t('anchor_date')"
                        :error="isDateError('anchor_date') ? dateValidation.anchor_date.message : ''"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

                     <template #panel="{ close }">
                        <Datepicker v-model="anchorDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onAnchorDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>

               <UFormGroup :label="$t('aweigh_date')">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <Input
                        name="aweigh_date"
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.aweigh_date"
                        :value="formGroup.aweigh_date ? format(new Date(formGroup.aweigh_date), 'd MMM, yyyy, HH:mm') : ''"
                        :placeholder="$t('aweigh_date')"
                        :error="isDateError('aweigh_date') ? dateValidation.aweigh_date.message : ''"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

                     <template #panel="{ close }">
                        <Datepicker v-model="aweighDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onAweighDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>

               <Input :label="$t('anchor_latitude')" name="latitude" :placeholder="$t('anchor_latitude')" v-model="formGroup.latitude" class="w-full" required />
               <Input :label="$t('anchor_longitude')" name="longitude" :placeholder="$t('anchor_longitude')" v-model="formGroup.longitude" class="w-full" required />

               <Input :label="$t('remark')" name="remark" :placeholder="$t('remark')" v-model="formGroup.remark" class="w-full md:col-span-2" />
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
import SelectMenu from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import MarkerVariant from "~/assets/icons/dialog/marker-variant.png";
import { format } from "date-fns";

const { t } = useI18n();
import { NEVER, z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { DateValidationAnchorDroppingForm, IFormGroupValid } from "~/core/interfaces/IAnchordropping";
import { convertTimezone, generateDateTimeOffset } from "~/utils/function";
const documentOptionsStore = useDocumentOptionsStore();

const anchorDroppingSchema = z.object({
   berth_id: z.number().min(1, t("required")),
   latitude: z.string().min(1, t("required")),
   longitude: z.string().min(1, t("required")),
});

const props = defineProps({
   isDialogOpen: Boolean,
   actionMode: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   documentId: Number,
   selectedAnchor: NEVER,
   selectedAnchorIndex: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (newValue) {
         resetForm();
         documentOptionsStore.getBerthsOptions();
         if (props.actionMode === "edit") {
            formGroup.value = JSON.parse(JSON.stringify(props.selectedAnchor));

            pilotDate.value = formGroup.value.pilot_date ? new Date(formGroup.value.pilot_date) : new Date();
            anchorDate.value = formGroup.value.anchor_date ? new Date(formGroup.value.anchor_date) : new Date();
            aweighDate.value = formGroup.value.aweigh_date ? new Date(formGroup.value.aweigh_date) : new Date();
         } else {
            resetForm();
         }
      }
   }
);

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);

const formGroup = ref<any>({
   berth_id: 0,
   pilot_date: null,
   anchor_date: null,
   aweigh_date: null,
   latitude: "",
   longitude: "",
   remark: "",
});
const resetForm = () => {
   formGroup.value = {
      berth_id: 0,
      pilot_date: null,
      anchor_date: null,
      aweigh_date: null,
      latitude: "",
      longitude: "",
      remark: "",
   };
   pilotDate.value = new Date();
   anchorDate.value = new Date();
   aweighDate.value = new Date();
   setTimeout(() => {
      allDatePristine(false);
   }, 100);
};
const pilotDate = ref<any>(new Date());
const anchorDate = ref<any>(new Date());
const aweighDate = ref<any>(new Date());

const handleFormError = (error: ZodError): void => {
   allDatePristine();
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof anchorDroppingSchema>>) {
   allDatePristine();

   if (!isFormGroupValid(formGroup.value)) {
      return;
   }

   const berthName = documentOptionsStore.berthsOption.find((item: any) => item.id === formGroup.value.berth_id)?.name;
   const anchor = {
      ...formGroup.value,
      berth_name: berthName,
      pilot_date: convertTimezone(new Date(formGroup.value.pilot_date), 7, false),
      anchor_date: convertTimezone(new Date(formGroup.value.anchor_date), 7, false),
      aweigh_date: !formGroup.value.aweigh_date ? null : convertTimezone(new Date(formGroup.value.aweigh_date), 7, false),
   };

   if (props.actionMode === "create") {
      props.dialogConfirm!(false, "create", anchor);
   } else {
      props.dialogConfirm!(false, "edit", anchor, props.selectedAnchorIndex);
   }
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
["pilot_date", "anchor_date", "aweigh_date"].forEach((key) => {
   watch(
      () => formGroup.value[key],
      () => {
         dateValidation.value[key].pristine = true;
      }
   );
});

const dateValidation = ref<DateValidationAnchorDroppingForm>({
   pilot_date: { message: t("required"), pristine: false },
   anchor_date: { message: t("required"), pristine: false },
   aweigh_date: { message: "", pristine: false },
});

const allDatePristine = (pristineValue: boolean = true) => {
   Object.keys(dateValidation.value).forEach((key) => {
      dateValidation.value[key].pristine = pristineValue;
   });
};

const isDateError = (field: string) => {
   const value = formGroup.value[field];
   const pristine = dateValidation.value[field].pristine;

   if (!value && pristine && field !== "aweigh_date") {
      dateValidation.value[field].message = t("required");
      return true;
   }

   if (field === "aweigh_date" && value && new Date(value) < new Date(formGroup.value.anchor_date)) {
      dateValidation.value[field].message = t("anchoring_day_or_time_gte");
      return true;
   }

   return false;
};

const isFormGroupValid = ({ aweigh_date, anchor_date, remark, ...fieldsToCheck }: IFormGroupValid) => {
   const allFieldsValid = Object.values(fieldsToCheck).every((value) => value);
   const anchorValid = !!anchor_date;

   const aweighValid = !formGroup.value.aweigh_date || (formGroup.value.aweigh_date && new Date(formGroup.value.aweigh_date) >= new Date(anchor_date));

   return allFieldsValid && anchorValid && aweighValid;
};

const onAweighDateChange = (newDate: any) => {
   formGroup.value.aweigh_date = newDate ? new Date(newDate).toISOString() : "";
};
const onAnchorDateChange = (newDate: any) => {
   formGroup.value.anchor_date = newDate ? new Date(newDate).toISOString() : "";
};
const onPilotDateChange = (newDate: any) => {
   formGroup.value.pilot_date = newDate ? new Date(newDate).toISOString() : "";
};
</script>
