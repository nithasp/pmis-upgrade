<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black mb-6">{{ $t("sailing_log") }}</h1>
   <div id="vessel-in-form" class="bg-white p-6">
      <UForm :schema="shipAgentAddressSchema" :state="formGroup" @submit="onSubmit" v-on:error="handleFormError">
         <header class="flex flex-wrap items-center justify-between">
            <div>
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
                  {{ $t("add_ship_address_agent") }}
               </h1>
               <div class="mt-1 text-[#667085] text-sm">
                  {{ $t("specify_ship_address_agent") }}
               </div>
            </div>
            <div class="flex gap-2 mt-4 w-full sm:mt-0 sm:w-auto">
               <UButton
                  class="border border-gray-100 h-[36px] justify-center w-1/2 sm:w-[64px]"
                  size="md"
                  color="gray"
                  :label="isViewMode ? $t('close') : $t('cancel')"
                  @click="
                     () => {
                        settingStore.setSettingTabName('ship-agent-address');
                        navigateTo('/settings');
                     }
                  "
               />
               <SaveButton v-if="!isViewMode" type="submit" class="w-1/2 sm:w-[64px]" />
            </div>
         </header>
         <UDivider class="m-[22px_0_24px_0]" />
         <div class="border rounded-xl border-solid border-[#D0D5DD] p-4 sm:p-8">
            <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("vessel_info") }}</h2>
            <div class="grid grid-cols-2 gap-x-5 gap-y-4 mt-4">
               <div class="col-span-2">
                  <div v-if="isViewMode">
                     <label class="block dark:text-gray-200 font-anuphan-medium text-sm text-grayy-400">{{ $t("ccn") }}</label>
                     <p class="text-grayy-75">
                        {{ formGroup.company || "-" }}
                     </p>
                  </div>
                  <UFormGroup v-else :label="$t('ccn')" name="company" :required="!isViewMode">
                     <UInputMenu
                        v-model="formGroup.company"
                        :options="customerList"
                        size="md"
                        variant="outline"
                        color="purple"
                        :placeholder="$t('ccn')"
                        trailing
                        by="id"
                        option-attribute="name"
                        :search="onSearchCustomer"
                        @change="handleChangeCustomer"
                     >
                        <template #leading>
                           <NuxtIcon name="search" size="xl" />
                        </template>
                     </UInputMenu>
                  </UFormGroup>
               </div>
               <div class="col-span-2 sm:col-span-1">
                  <div v-if="isViewMode">
                     <label class="block dark:text-gray-200 font-anuphan-medium text-sm text-grayy-400">{{ $t("taxpayer_identification_no") }}</label>
                     <p class="text-grayy-75">
                        {{ formGroup.tax || "-" }}
                     </p>
                  </div>
                  <UFormGroup v-else :label="$t('taxpayer_identification_no')" name="tax" :required="!isViewMode">
                     <UInputMenu
                        v-model="formGroup.tax"
                        size="md"
                        variant="outline"
                        color="purple"
                        :placeholder="$t('taxpayer_identification_no')"
                        option-attribute="taxId"
                        trailing
                        by="id"
                        :search="onSearchCustomerTax"
                        @change="handleChangeCustomerTax"
                     >
                        <template #leading>
                           <NuxtIcon name="search" size="xl" />
                        </template>
                     </UInputMenu>
                  </UFormGroup>
               </div>
               <div class="col-span-2 sm:col-span-1">
                  <Input
                     :isView="isViewMode"
                     :label="$t('contact_name_agent_address')"
                     :placeholder="$t('contact_name_agent_address')"
                     name="fullName"
                     v-model="formGroup.fullName"
                     :required="!isViewMode"
                  />
               </div>
               <div class="col-span-2 sm:col-span-1">
                  <Select
                     :isView="isViewMode"
                     :value="isViewMode ? formGroup.paymentMethodDes : null"
                     :label="$t('payment_method')"
                     :placeholder="$t('payment_method')"
                     name="paymentMethodId"
                     :options="documentOptionsStore.paymentMethodOptions"
                     v-model="formGroup.paymentMethodId"
                     :required="!isViewMode"
                  />
               </div>
               <div class="col-span-2 sm:col-span-1">
                  <Select
                     :isView="isViewMode"
                     :value="isViewMode ? formGroup.paymentTermDes : null"
                     :label="$t('payment_term')"
                     :placeholder="$t('payment_term')"
                     name="paymentTermId"
                     :options="documentOptionsStore.paymentTermsOptions"
                     v-model="formGroup.paymentTermId"
                     :required="!isViewMode"
                  />
               </div>
               <UDivider class="my-4 col-span-2" />
               <div class="col-span-2">
                  <Select
                     :isView="isViewMode"
                     :value="isViewMode ? formGroup.countryDes : null"
                     :label="$t('country')"
                     :placeholder="$t('country')"
                     name="countryId"
                     :options="addressOptionsStore.countriesOption"
                     v-model="formGroup.countryId"
                     searchable
                     :required="!isViewMode"
                     @change="
                     (countryId: number) => {
                        if(countryId !== 219) {
                           formGroup.provinceId = 0;
                           formGroup.districtId = 0;
                           formGroup.subDistrictId = 0;
                           formGroup.stageProvince = '';
                           formGroup.zipCode = '';
                           addressOptionsStore.districtOption = [];
                           addressOptionsStore.subDistrictOption = [];
                        } else {
                           formGroup.stageProvince = ''; 
                        }                    
                     }"
                  />
               </div>
               <div v-if="!isThailand()" class="col-span-2 sm:col-span-1" >
                  <Input
                     :isView="isViewMode"
                     :label="$t('state_province')"
                     name="stageProvince"
                     :placeholder="$t('state_province')"
                     v-model="formGroup.stageProvince"
                     :required="!isViewMode"
                  />
               </div>
               <div  v-if="isThailand()" class="col-span-2 sm:col-span-1">
                  <Select
                     :isView="isViewMode"
                     :value="isViewMode ? formGroup.provinceDes : null"
                     :label="$t('province')"
                     :placeholder="$t('province')"
                     name="provinceId"
                     :options="addressOptionsStore.provicesOption"
                     v-model="formGroup.provinceId"
                     :required="!isViewMode"
                     @change="
                        () => {
                           formGroup.districtId = 0;
                           formGroup.subDistrictId = 0;
                           formGroup.zipCode = '';
                           addressOptionsStore.districtOption = [];
                           addressOptionsStore.subDistrictOption = [];
                        }
                     "
                  />
               </div>
               <div class="col-span-2 sm:col-span-1">
                  <Input
                     :isView="isViewMode"
                     :label="$t('zipcode')"
                     :placeholder="$t('zipcode')"
                     name="zipCode"
                     v-model="formGroup.zipCode"
                     :required="!isViewMode"
                  />
               </div>
               <div v-if="isThailand()" class="col-span-2 sm:col-span-1" >
                  <Select
                     :isView="isViewMode"
                     :value="isViewMode ? formGroup.districtDes : null"
                     :label="$t('district')"
                     :placeholder="$t('district')"
                     name="districtId"
                     :options="addressOptionsStore.districtOption"
                     v-model="formGroup.districtId"
                     :required="!isViewMode"
                     @change="
                        () => {
                           formGroup.subDistrictId = 0;
                           formGroup.zipCode = '';
                        }
                     "
                  />
               </div>
               <div  v-if="isThailand()" class="col-span-2 sm:col-span-1">
                  <Select
                     :isView="isViewMode"
                     :value="isViewMode ? formGroup.subDistrictDes : null"
                     :label="$t('subdistrict')"
                     :placeholder="$t('subdistrict')"
                     name="subDistrictId"
                     :options="addressOptionsStore.subDistrictOption"
                     v-model="formGroup.subDistrictId"
                     :required="!isViewMode"
                     @change="handleSubDistrictChange"
                  />
               </div>
               <div class="col-span-2">
                  <Input
                     :isView="isViewMode"
                     :label="$t('address')"
                     name="address"
                     :placeholder="$t('address')"
                     v-model="formGroup.address"
                     :required="!isViewMode"
                  />
               </div>
            </div>
         </div>
      </UForm>
   </div>
   <DialogConfirm
      :icon="dialogConfirmProps.icon"
      :title="dialogConfirmProps.title"
      :desc="dialogConfirmProps.desc"
      :colorConfirm="dialogConfirmProps.colorConfirm"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogConfirmOpen"
      :dialogCancel="dialogConfirmCancel"
      :dialogConfirm="dialogConfirmSubmit"
   />
   <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseDialogAlert"
      :btnName="$t('close')"
   />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import InputNumber from "~/components/form/input-number.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import SaveButton from "~/components/button/save.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";

import { useSettingStore } from "~/stores/settingStore";
const settingStore = useSettingStore();
import useDocumentService from "~/core/services/documentService";
const documentService = useDocumentService();
import useSettingService from "~/core/services/settingService";
const settingService = useSettingService();
const documentOptionsStore = useDocumentOptionsStore();
const addressOptionsStore = useAddressOptionsStore();

const route = useRoute();
const isViewMode = route.fullPath.includes("view");
const { t, locale } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { ISearchCustomer } from "~/core/interfaces/ISearchCustomer";

onMounted(() => {
   console.log(route.query.id);
   getProfileUser();
   getUserAddressDetail();
   getMasterDataList();

   console.log(isViewMode);
});

const shipAgentAddressSchema = z
   .object({
      company: z.string().min(1, t("required")),
      tax: z.string().min(1, t("required")),
      fullName: z.string().min(1, t("required")),
      paymentMethodId: z.number().min(1, { message: t("required") }),
      paymentTermId: z.number().min(1, { message: t("required") }),
      countryId: z.number().min(1, { message: t("required") }),
      provinceId: z.number().optional(),
      districtId: z.number().optional(),
      subDistrictId: z.number().optional(),
      zipCode: z.string().min(1, t("required")),
      address: z.string().min(1, t("required")),
      stageProvince: z.string().optional(),
   })
   .refine((data) => data.countryId !== 219 || data.provinceId, {
      message: t(t("required")),
      path: ["provinceId"],
   })
   .refine((data) => data.countryId === 219 || data.stageProvince, {
      message: t(t("required")),
      path: ["stageProvince"],
   });

const formGroup = ref<any>({
   id: null,
   tax: "",
   company: "",
   fullName: "",
   paymentMethodId: 0,
   paymentMethodDes: "",
   paymentTermId: 0,
   paymentTermDes: "",
   address: "",
   countryId: 0,
   countryDes: "",
   subDistrictId: 0,
   subDistrictDes: "",
   districtId: 0,
   districtDes: "",
   provinceId: 0,
   provinceDes: "",
   stageProvince: "",
   zipCode: "",
});
const dialogConfirmProps = ref<any>({
   title: t("add_ship_address_agent_new"),
   desc: t("add_ship_address_agent_confirm"),
   icon: "warning",
   colorConfirm: "",
});
const dialogAlertProps = ref<any>({
   title: "",
   desc: "",
   type: "",
});
const authStore = useAuthStore();
const profileUser = ref<any>(null);
const isLoading = ref<boolean>(false);
const customerList = ref<any[]>([]);

const getProfileUser = () => {
   profileUser.value = typeof authStore.profileUser === "string" ? JSON.parse(authStore.profileUser) : authStore.profileUser;
};

const getUserAddressDetail = async () => {
   isLoading.value = true;
   const res = await settingService.getUserAddressDetail(Number(route.query.id));
   if (res.statusCode === 200) {
      console.log(res);
      formGroup.value = res.data;
   }
   isLoading.value = false;
};

const getMasterDataList = async () => {
   documentOptionsStore.getPaymentMethodOptions();
   documentOptionsStore.getPaymentTermsOptions();
   addressOptionsStore.getCountriesOptions();
   addressOptionsStore.getProvincesOptions();
};

watch(
   () => formGroup.value.provinceId,
   async (provinceId) => {
      if (provinceId) {
         await addressOptionsStore.getDistrictsOptions(provinceId);
      }
   }
);

watch(
   () => formGroup.value.districtId,
   async (districtId) => {
      if (districtId) {
         await addressOptionsStore.getSubDistrictsOptions(districtId);
      }
   }
);

const handleFormError = (error: ZodError): void => {};
async function onSubmit(event: FormSubmitEvent<z.output<typeof shipAgentAddressSchema>>) {
   isDialogConfirmOpen.value = true;
}

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

const isDialogConfirmOpen = ref(false);
const dialogConfirmSubmit = async () => {
   isLoading.value = true;

   const res = route.query.id
      ? await settingService.updateAddressUser(profileUser.value?.id, { ...formGroup.value, id: Number(route.query.id) })
      : await settingService.addAddressUser(profileUser.value?.id, formGroup.value);
   const isSuccess = res.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("add_ship_address_agent_new") : locale.value === "th" ? res.message : res.translation,
      desc: t(isSuccess ? "add_ship_address_agent_success" : ""),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};
const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;

   if (dialogAlertProps.value.type === "success") {
      settingStore.setSettingTabName("ship-agent-address");
      navigateTo("/settings");
   }
};

const onSearchCustomer = async (q: string = "") => {
   const filter = { search: q, field: "name" };
   const res = await documentService.getCustomersSearch(filter);
   if (res.statusCode === 200) {
      return res.data.map((item: ISearchCustomer) => ({ id: item.id, name: item.name }));
   } else {
      return [];
   }
};

const onSearchCustomerTax = async (q: string = "") => {
   const filter = { search: q, field: "tax_id" };
   const res = await documentService.getCustomersSearch(filter);
   if (res.statusCode === 200) {
      return res.data.map((item: ISearchCustomer) => ({ id: item.id, taxId: item.taxId }));
   }
};

const handleChangeCustomer = (value: any) => {
   formGroup.value.company = value.name;
};
const handleChangeCustomerTax = (value: any) => {
   formGroup.value.tax = value.taxId;
};
const handleSubDistrictChange = async (subDistrictId: number) => {
   const subDistrict: any = addressOptionsStore.subDistrictOption.find((item: any) => item.id === subDistrictId);
   if (subDistrict) {
      formGroup.value.zipCode = subDistrict.zipcode;
   }
};

const isThailand = () => {
   return formGroup.value.countryId === 219;
};
</script>
