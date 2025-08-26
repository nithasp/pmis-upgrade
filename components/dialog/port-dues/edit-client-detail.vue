<template>
   <div>
      <slot name="activator" :on="{ click: openModal }">
         <!-- Default activator can be defined here if needed -->
         <button v-if="!hideButton" class="py-2 px-4 rounded bg-primaryy" @click="openModal">เปิด</button>
      </slot>
      <UModal :modelValue="modal" :ui="{
         container: 'items-center',
         width: 'w-full md:min-w-[400px] !w-[630px] !max-w-full',
         rounded: 'rounded-3xl',
      }">
         <div class="p-6">
            <UForm :state="formGroup" @submit="submitForm">
               <img :src="BookIcon" :alt="BookIcon" class="w-12" />

               <div class="mt-4">
                  <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("invoice_address") }}</h2>
                  <p class="mt-1 text-[#667085] text-sm mb-4">{{ $t("invoice_address_detail") }}</p>
                  <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6">
                     <UInput v-model="formGroup.invoice.customerCode" :label="$t('client_no')"
                        :placeholder="$t('client_no')" name="client_no" />
                     <UInput v-model="formGroup.invoice.name" :label="$t('name_company')"
                        :placeholder="$t('name_company')" name="name_company" required @blur="validate('name')"
                        @input="validate('name')" :error="getError('name') || ''" />
                     <UInput v-model="formGroup.invoice.taxId" :label="$t('settings_ship_agent_information_tax_id')"
                        :placeholder="$t('settings_ship_agent_information_tax_id')"
                        name="settings_ship_agent_information_tax_id" required @blur="validate('taxId')"
                        @input="validate('taxId')" :error="getError('taxId') || ''" />
                     <UInput v-model="formGroup.invoice.contactName" :label="$t('invoice_contact_name')"
                        :placeholder="$t('invoice_contact_name')" name="invoice_contact_name" required
                        @blur="validate('contactName')" @input="validate('contactName')"
                        :error="getError('contactName') || ''" />
                     <UInput v-model="formGroup.invoice.phoneNumber" :label="$t('telephone_no')"
                        :placeholder="$t('telephone_no')" name="telephone_no" required @blur="validate('phoneNumber')"
                        @input="validate('phoneNumber')" :error="getError('phoneNumber') || ''" />
                     <UInput v-model="formGroup.invoice.secondaryPhoneNumber" :label="$t('mobile_phone_no')"
                        :placeholder="$t('mobile_phone_no')" name="mobile_phone_no" required
                        @blur="validate('secondaryPhoneNumber')" @input="validate('secondaryPhoneNumber')"
                        :error="getError('secondaryPhoneNumber') || ''" />
                     <div class="col-span-2">
                        <USelect :label="$t('country')" name="countryId" :placeholder="$t('country')" required
                           :searchable-placeholder="$t('search_country')" v-model="formGroup.invoice.countryId"
                           searchable :options="addressOptionsStore.countriesOption"
                           @change="(value: any) => validate('countryId', value)"
                           :error="getError('countryId') || ''" />
                     </div>
                     <div v-if="!isOtherInvoiceCountry" class="col-span-1">
                        <USelect :label="$t('province')" name="provinceId" :placeholder="$t('province')" required
                           v-model="formGroup.invoice.provinceId" :options="addressOptionsStore.provicesOption"
                           searchable :searchable-placeholder="$t('search_province')"
                           @change="(value: any) => validate('provinceId', value)"
                           :error="getError('provinceId') || ''" />
                     </div>

                     <div v-if="isOtherInvoiceCountry" class="col-span-1">
                        <UInput :label="$t('state_province')" name="stageProvince" :placeholder="$t('state_province')"
                           required v-model="formGroup.invoice.stageProvince" @blur="validate('stageProvince')"
                           @input="validate('stageProvince')" :error="getError('stageProvince') || ''" />
                     </div>
                     <div class="col-span-1">
                        <UInput :label="$t('zipcode')" name="postCode" :placeholder="$t('zipcode')" required
                           v-model="formGroup.invoice.postCode" :disabled="!isOtherInvoiceCountry"
                           @blur="validate('postCode')" @input="validate('postCode')"
                           :error="getError('postCode') || ''" />
                     </div>
                     <div v-if="!isOtherInvoiceCountry" class="col-span-1">
                        <USelect :label="$t('district')" name="districtId" :placeholder="$t('district')" required
                           searchable :options="addressOptionsStore.districtOption"
                           v-model="formGroup.invoice.districtId" :searchable-placeholder="$t('search_district')"
                           @change="(value: any) => validate('districtId', value)"
                           :error="getError('districtId') || ''" />
                     </div>
                     <div v-if="!isOtherInvoiceCountry" class="col-span-1">
                        <USelect :label="$t('subdistrict')" name="subDistrictId" :placeholder="$t('subdistrict')"
                           required searchable :options="addressOptionsStore.subDistrictOption"
                           v-model="formGroup.invoice.subDistrictId" :searchable-placeholder="$t('search_subdistrict')"
                           @change="(value: any) => validate('subDistrictId', value)"
                           :error="getError('subDistrictId') || ''" />
                     </div>
                     <div class="col-span-2">
                        <UInput :label="$t('address')" name="address" :placeholder="$t('address')" required
                           v-model="formGroup.invoice.address" @blur="validate('address')" @input="validate('address')"
                           :error="getError('address') || ''" />
                     </div>
                  </div>
               </div>
               <div class="mt-6 flex justify-between flex-wrap gap-y-3 sm:grid grid-cols-[1fr_1fr] gap-x-4">
                  <UButton size="lg" color="white" variant="solid" :label="'ยกเลิก'" block
                     class="rounded-lg w-full border border-gray-100 outline-none" @click="closeModal()"
                     ref="removeAutoFocus" />
                  <UButton size="lg" color="primary" variant="solid" block class="rounded-lg w-full" type="submit"
                     :label="'บันทึก'" />
               </div>
            </UForm>
         </div>
      </UModal>
      <DialogAlert title="บันทึกข้อมูล" desc="ข้อมูลนี้ถูกบันทึกแล้ว" type="success" :isOpen="isDialogSuccessOpen"
         :setDialog="handleCloseSuccessDialog" />

      <Loading v-if="isLoading" />
   </div>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import BookIcon from "~/assets/icons/dialog/book.png";
import DialogAlert from "~/components/dialog/alert.vue";
import UInput from "~/components/form/u-input.vue";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
const addressOptionsStore = useAddressOptionsStore()
const toast = useToast();
const { t } = useI18n();
const isOtherInvoiceCountry = ref(true)

const props = defineProps({
   hideButton: {
      type: Boolean,
      default: false,
   },
   vesselId: {
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
   formGroup: {
      type: Object,
      required: true
   },
});

onMounted(() => {
   addressOptionsStore.getCountriesOptions()
   addressOptionsStore.getProvincesOptions()
});

const errors = ref<FormError[]>([]);

const validate = (field: string, valueSelected: any = 0) => {
   const validationErrors: FormError[] = [];

   // Name validation
   if (field === 'name') {
      if (!props.formGroup.invoice.name) {
         validationErrors.push({ path: 'name', message: t('please_enter_a_value') });
      }
   }

   // Tax ID validation
   if (field === 'taxId') {
      if (!props.formGroup.invoice.taxId) {
         validationErrors.push({ path: 'taxId', message: t('please_enter_a_value') });
      } else if (!regxNumber13Degit.test(props.formGroup.invoice.taxId)) {  // Replace with desired phone number validation
         validationErrors.push({ path: 'taxId', message: t('taxpayer_identification_not_correct') });
      }
   }

   // Contact Name validation
   if (field === 'contactName') {
      if (!props.formGroup.invoice.contactName) {
         validationErrors.push({ path: 'contactName', message: t('please_enter_a_value') });
      }
   }

   // Phone Number validation
   if (field === 'phoneNumber') {
      if (!props.formGroup.invoice.phoneNumber) {
         validationErrors.push({ path: 'phoneNumber', message: t('please_enter_a_value') });
      } else if (!regxPhone.test(props.formGroup.invoice.phoneNumber)) {  // Replace with desired phone number validation
         validationErrors.push({ path: 'phoneNumber', message: t('phone_format_validate_message') });
      }
   }
   // Secondary Phone Number validation
   if (field === 'secondaryPhoneNumber') {
      if (!props.formGroup.invoice.secondaryPhoneNumber) {
         validationErrors.push({ path: 'secondaryPhoneNumber', message: t('please_enter_a_value') });
      } else if (!regxPhone.test(props.formGroup.invoice.secondaryPhoneNumber)) {  // Replace with desired phone number validation
         validationErrors.push({ path: 'secondaryPhoneNumber', message: t('phone_format_validate_message') });
      }
   }

   // Payment Method ID validation
   if (field === 'paymentMethodId') {
      props.formGroup.invoice.paymentMethodId = valueSelected || props.formGroup.invoice.paymentMethodId;
      if (!props.formGroup.invoice.paymentMethodId || props.formGroup.invoice.paymentMethodId < 1) {
         validationErrors.push({ path: 'paymentMethodId', message: t('please_enter_a_value') });
      }
   }

   // Payment Term ID validation
   if (field === 'paymentTermId') {
      props.formGroup.invoice.paymentTermId = valueSelected || props.formGroup.invoice.paymentTermId;
      if (!props.formGroup.invoice.paymentTermId || props.formGroup.invoice.paymentTermId < 1) {
         validationErrors.push({ path: 'paymentTermId', message: t('please_enter_a_value') });
      }
   }

   // Country ID validation
   if (field === 'countryId') {
      props.formGroup.invoice.countryId = valueSelected || props.formGroup.invoice.countryId;
      if (!props.formGroup.invoice.countryId || props.formGroup.invoice.countryId < 1) {
         validationErrors.push({ path: 'countryId', message: t('please_enter_a_value') });
      }
   }

   // Province ID validation (dependent on isOtherInvoiceCountry)
   if (field === 'provinceId') {
      props.formGroup.provinceId = valueSelected || props.formGroup.provinceId;
      if (!isOtherInvoiceCountry.value && (!props.formGroup.provinceId || props.formGroup.provinceId < 1)) {
         validationErrors.push({ path: 'provinceId', message: t('please_enter_a_value') });
      }
   }

   // District ID validation (dependent on isOtherInvoiceCountry)
   if (field === 'districtId') {
      props.formGroup.invoice.districtId = valueSelected || props.formGroup.invoice.districtId;
      if (!isOtherInvoiceCountry.value && (!props.formGroup.invoice.districtId || props.formGroup.invoice.districtId < 1)) {
         validationErrors.push({ path: 'districtId', message: t('please_enter_a_value') });
      }
   }

   // SubDistrict ID validation (dependent on isOtherInvoiceCountry)
   if (field === 'subDistrictId') {
      props.formGroup.invoice.subDistrictId = valueSelected || props.formGroup.invoice.subDistrictId;
      if (!isOtherInvoiceCountry.value && (!props.formGroup.invoice.subDistrictId || props.formGroup.invoice.subDistrictId < 1)) {
         validationErrors.push({ path: 'subDistrictId', message: t('please_enter_a_value') });
      }
   }

   // Post Code validation
   if (field === 'postCode') {
      if (!props.formGroup.invoice.postCode) {
         validationErrors.push({ path: 'postCode', message: t('please_enter_a_value') });
      }
   }

   // Stage Province validation (dependent on isOtherInvoiceCountry)
   if (field === 'stageProvince') {
      if (isOtherInvoiceCountry.value && !props.formGroup.invoice.stageProvince) {
         validationErrors.push({ path: 'stageProvince', message: t('please_enter_a_value') });
      }
   }

   // Address Validation
   if (field === 'address') {
      if (!props.formGroup.invoice.address) {
         validationErrors.push({ path: 'address', message: t('please_enter_a_value') });
      }
   }

   // Clear previous errors for the specific field and add the new error if any
   errors.value = errors.value.filter(err => err.path !== field);
   if (validationErrors.length) {
      errors.value.push(...validationErrors);
   }
};

const getError = (field: string) => {
   const error = errors.value.find(err => err.path === field);
   return error ? error.message : null;
};
const modal = ref(false);

const form = ref({
   name: "",
});
const vesselTypeSchema = z.object({
   name: z.string().min(1, "กรุณากรอกข้อมูล"),
});

const messageError = ref("");
const isLoading = ref(false);
const openModal = () => {
   console.log("open");
   modal.value = true;
   if (props.editMode) {
      console.log("open getdetail");
   } else {
   }
};

const emit = defineEmits(["fetch,close"]);

async function submitForm(event: FormSubmitEvent<z.output<any>>) {
   console.log('  event.data', event.data);
   console.log("submitForm");
   validate("name");
   validate("taxId");
   validate("contactName");
   validate("phoneNumber");
   validate("secondaryPhoneNumber");
   validate("countryId");
   validate("provinceId");
   validate("districtId");
   validate("subDistrictId");
   validate("postCode");
   validate("stageProvince");
   validate("address");
   if (errors.value.length === 0) {
      console.log("submitForm", event.data);
      Object.assign(props.formGroup, event.data);
      modal.value = false;
   }

   // try {
   //    isLoading.value = true;
   //    let resp;
   //    if (props.editMode) {
   //       resp = await putVesselType(props.vesselId, { name: form.value.name });
   //    } else {
   //       resp = await postVesselType({ name: form.value.name });
   //    }
   //    console.log("submitted", resp);
   //    if (resp.statusCode === 200) {
   //       isDialogSuccessOpen.value = true;
   //       emit("fetch");
   //       closeModal();
   //    } else {
   //       toast.add({ title: resp?.message, color: "red" });
   //    }
   // } catch (error) {
   //    console.error(error);
   // } finally {
   //    isLoading.value = false;
   // }
}
const closeModal = () => {
   clearForm();
   // emit("close");
   modal.value = false;
};
const clearForm = () => {
   form.value = {
      name: "",
   };
};
const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

watch(
   () => props.formGroup.invoice.countryId,
   (value) => {
      isOtherInvoiceCountry.value = value !== 219 ? true : false
   }
);

watch(
   () => props.formGroup.invoice.provinceId,
   async (provinceId) => {
      if (provinceId) {
         await addressOptionsStore.getDistrictsOptions(provinceId)
      }
   }
);

watch(
   () => props.formGroup.invoice.districtId,
   async (districtId) => {
      if (districtId) {
         await addressOptionsStore.getSubDistrictsOptions(districtId)
      }
   }
);

watch(
   () => props.formGroup.invoice.subDistrictId,
   async (subDistrictId) => {
      if (subDistrictId) {
         const findZipcode: any = addressOptionsStore.subDistrictOption.find((e: any) => e.id === subDistrictId)
         if (findZipcode) {
            props.formGroup.invoice.postCode = findZipcode.zipcode
         } else {
            props.formGroup.invoice.postCode = props.formGroup.invoice.postCode || ''
         }
      }
   }
);

</script>
