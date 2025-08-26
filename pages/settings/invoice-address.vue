<template>
   <div id="invoice-address">
      <UForm :schema="invoiceAddressSchema" :state="formGroup" @submit="onSubmit">
         <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 mb-5">
            <div>
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("settings_invoice_address_title") }}</h1>
               <div class="mt-1 text-[#667085] text-sm">{{ $t("settings_invoice_address_subtitle") }}</div>
            </div>
            <!-- <SaveButton @click="setDialog(true)" type="button" class="mt-4 sm:mt-0" /> -->
            <SaveButton type="submit" class="mt-4 sm:mt-0" />
         </div>
         <div class="mt-[21px]">
            <div id="country-ad"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("country") }} </span>
                  <span class="text-[#F00]">*</span>
               </div>
               <!-- <SelectMenu class="max-w-[512px]" placeholder="ประเทศ" name="countrySelected" required v-model="formGroup.countrySelected" :options="countryOption" /> -->

               <UFormGroup name="countryId">
                  <USelectMenu class="max-w-[512px]" variant="outline" color="purple" v-model="formGroup.countryId"
                     :options="countryOption" value-attribute="id" option-attribute="name" searchable
                     :searchable-placeholder="$t('search_country')" :placeholder="$t('country')" :ui="{
                        base: 'h-[36px]',
                     }" @change="() => handleCountryChange()" />
               </UFormGroup>
            </div>

            <div id="province-ad" v-if="formGroup.countryId === 219"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("province") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               <!-- <SelectMenu
                  class="max-w-[512px] "
                  name="provinceId"
                  v-model="formGroup.provinceId"
                  :options="provincesOption"
                  attributeValue="id"
                  attributeOption="name"
                  searchable
                  searchable-placeholder="ค้นหาจังหวัด..."
               /> -->

               <UFormGroup name="provinceId">
                  <USelectMenu class="max-w-[512px]" variant="outline" color="purple" v-model="formGroup.provinceId"
                     :options="provincesOption" value-attribute="id" option-attribute="name" searchable
                     :searchable-placeholder="$t('search_province')" :placeholder="$t('province')" :ui="{
                        base: 'h-[36px]',
                     }" @change="() => handleProvinceChange()" />
               </UFormGroup>

            </div>

            <div id="district-ad" v-if="formGroup.countryId === 219"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("district") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               <!-- <SelectMenu class="max-w-[512px] " name="districtId" v-model="formGroup.districtId" searchable :options="districtOption" /> -->

               <UFormGroup name="districtId">
                  <USelectMenu class="max-w-[512px]" variant="outline" color="purple" v-model="formGroup.districtId"
                     :options="districtOption" value-attribute="id" option-attribute="name" searchable
                     :searchable-placeholder="$t('search_district')" :placeholder="$t('district')" :ui="{
                        base: 'h-[36px]',
                     }" @change="() => handleDistrictChange()" />
               </UFormGroup>

            </div>

            <div id="subDistrict-ad" v-if="formGroup.countryId === 219"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("subdistrict") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               <!-- <SelectMenu class="max-w-[512px] " name="subDistrictId" v-model="formGroup.subDistrictId" searchable :options="subDistrictOption" /> -->

               <UFormGroup name="subDistrictId">
                  <USelectMenu class="max-w-[512px]" variant="outline" color="purple" v-model="formGroup.subDistrictId"
                     :options="subDistrictOption" value-attribute="id" option-attribute="name" searchable
                     :searchable-placeholder="$t('search_subdistrict')" :placeholder="$t('subdistrict')" :ui="{
                        base: 'h-[36px]',
                     }" @change="(subDistrictId) => handleSubDistrictChange(subDistrictId)" />
               </UFormGroup>
            </div>

            <div id="stageProvince-ad" v-if="formGroup.countryId !== 219"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("state_province") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               <Input name="stageProvince" class="max-w-[512px]" :placeholder="$t('state_province')"
                  v-model="formGroup.stageProvince" />
            </div>

            <div id="zipcode-ad"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("zipcode") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               <Input name="zipCodeTemp" class="max-w-[512px]" :placeholder="$t('zipcode')"
                  v-model="formGroup.zipCodeTemp" />
            </div>

            <div id="address-ad"
               class="sm:grid sm:grid-cols-[280px_1fr] border-y-[#E4E7EC] border-t border-solid border-b py-5">
               <div class="sm:mt-2">
                  <span class="font-anuphan-semi-bold text-sm text-gray-400">{{ $t("address") }}</span>
                  <span class="text-[#F00]">*</span>
               </div>
               <Input name="address" class="max-w-[512px]" :placeholder="$t('address')" v-model="formGroup.address" />
            </div>
         </div>
      </UForm>
   </div>
   <DialogConfirm icon="warning" :title="$t('save_title')" :desc="$t('save_description')" :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogOpen" :dialogCancel="dialogCancel" :dialogConfirm="dialogConfirmSubmit" />
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen"
      :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import SelectMenu from "~/components/form/u-select.vue";
import SaveButton from "~/components/button/save.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";

import type { ICountries } from "~/core/interfaces/ICountries";
import type { IProvinces } from "~/core/interfaces/IProvinces";
import type { IDistricts } from "~/core/interfaces/IDistricts";
import type { ISubDistrict } from "~/core/interfaces/ISubDistrict";
import type { IUpdateUser } from "~/core/interfaces/ISetting";
import useAdminService from "~/core/services/adminService";
import useMasterDataService from "~/core/services/masterDataService";
import useSettingService from "~/core/services/settingService";

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const { t } = useI18n();
const invoiceAddressSchema = z
  .object({
    countryId: z.number({ required_error: t("required") }),
    provinceId: z.number().default(0),
    districtId: z.number().default(0),
    subDistrictId: z.number().default(0),
    stageProvince: z.string().optional(),
    zipCodeTemp: z
      .string({ required_error: t("required") })
      .min(1, { message: t("required") }),
    address: z
      .string({ required_error: t("required") })
      .min(1, { message: t("required") }),
  })
  .superRefine((data, ctx) => {
    if (data.countryId === 219) {
      if (data.provinceId === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("required"),
          path: ["provinceId"],
        });
      }
      if (data.districtId === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("required"),
          path: ["districtId"],
        });
      }
      if (data.subDistrictId === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("required"),
          path: ["subDistrictId"],
        });
      }
    } else {
      if (!data.stageProvince || data.stageProvince.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("required"),
          path: ["stageProvince"],
        });
      }
    }
  });


const { locale } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const adminService = useAdminService();
const masterDataService = useMasterDataService();
const { getUserDetail, updateUser } = useSettingService();

const isLoading = ref<boolean>(false);
const countryOption = ref<ICountries[]>([]);
const provincesOption = ref<IProvinces[]>([]);
const districtOption = ref<IDistricts[]>([]);
const subDistrictOption = ref<ISubDistrict[]>([]);
const formGroup = ref<IUpdateUser>({
   email: "",
   code: "",
   personType: "",
   tax: "",
   company: "",
   fullName: "",
   phone: "",
   mobilePhone: "",
   address: "",
   countryId: 0,
   districtId: 0,
   subDistrictId: 0,
   provinceId: 0,
   stageProvince: "",
   zipCode: "",
   zipCodeTemp: "",
});

onMounted(() => {
   const profileUser = typeof authStore.profileUser === "string" ? JSON.parse(authStore.profileUser) : authStore.profileUser;

   getCountriesOptions();
   getProvincesOptions();
   fetchUserDetail(profileUser?.id);
});

watch(
   () => formGroup.value.provinceId,
   async (provinceId) => {
      districtOption.value = await getDistrictsOptions(provinceId!);
   }
);

watch(
   () => formGroup.value.districtId,
   async (districtId) => {
      subDistrictOption.value = await getSubDistrictsOptions(districtId!);
   }
);

const getCountriesOptions = async () => {
   const resp = await masterDataService.getCountries();
   if (resp.statusCode === 200) {
      countryOption.value = resp.data.map((item: ICountries) => ({ id: item.id, name: locale.value === "en" ? item.nameEn : item.nameTh }));
   }
};

const getProvincesOptions = async () => {
   const resp = await masterDataService.getProvinces();
   if (resp.statusCode === 200) {
      provincesOption.value = resp.data.map((item: IProvinces) => ({ id: item.id, name: locale.value === "en" ? item.nameEn : item.nameTh }));
   }
};

const getDistrictsOptions = async (provinceId: number) => {
   const resp = await masterDataService.getDistricts(provinceId);
   if (resp.statusCode === 200) {
      return resp.data.map((item: IDistricts) => ({ ...item, id: item.id, name: locale.value === "en" ? item.nameEn : item.nameTh }));
   }
};

const getSubDistrictsOptions = async (districtId: number) => {
   const resp = await masterDataService.getSubDistricts(districtId);
   if (resp.statusCode === 200) {
      return resp.data.map((item: ISubDistrict) => ({ ...item, id: item.id, name: locale.value === "en" ? item.nameEn : item.nameTh }));
   }
};

// const getVesselAgenciesDetail = async (userId: number) => {
//    const resp = await adminService.getVesselAgenciesDetail(userId);
//    if (resp.statusCode === 200) {
//       formGroup.value = {
//          ...resp?.data,
//          zipCodeTemp: resp.data?.zipCode,
//       };
//    }
// };

const fetchUserDetail = async (userId: number) => {
   const resp = await getUserDetail(userId);
   if (resp.statusCode === 200) {
      formGroup.value = {
         ...resp?.data,
         zipCodeTemp: resp.data?.zipCode,
      };
   }
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof invoiceAddressSchema>>) {
   setDialog(true);
}

const isDialogOpen = ref(false);
const setDialog = (status: boolean) => {
   isDialogOpen.value = status;
};
const dialogCancel = () => {
   setDialog(false);
};

const dialogConfirmSubmit = async () => {
   isLoading.value = true;
   formGroup.value = {
      ...formGroup.value,
      zipCode: formGroup.value.zipCodeTemp,
   };
   removeEmptyKeys(formGroup.value)
   const resp = await updateUser(formGroup.value);
   if (resp.statusCode === 200) {
      getUserDetail(resp.data?.id);
      setDialog(false);
      isDialogSuccessOpen.value = true;
   } else {
      console.error("updateUser error:", resp);
      toast.add({ title: resp?.message, color: "red" });
      setDialog(false);
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

const handleCountryChange = () => {
   formGroup.value.provinceId = 0;
   formGroup.value.districtId = 0;
   formGroup.value.subDistrictId = 0;
   formGroup.value.stageProvince = "";
   formGroup.value.zipCodeTemp = "";
   formGroup.value.address = "";
   districtOption.value = [];
   subDistrictOption.value = [];
};
const handleProvinceChange = () => {
   formGroup.value.districtId = 0;
   formGroup.value.subDistrictId = 0;
   subDistrictOption.value = [];
};
const handleDistrictChange = () => {
   formGroup.value.subDistrictId = 0;
};
const handleSubDistrictChange = (subDistrictId: number) => {
   const found = subDistrictOption.value.find((i: ISubDistrict) => i.id === subDistrictId);
   formGroup.value.zipCodeTemp = found?.zipcode;
};

const removeEmptyKeys = (obj: any) => {
   for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
         if (obj[key] === "") {
            delete obj[key];
         }
      }
   }
}
</script>
