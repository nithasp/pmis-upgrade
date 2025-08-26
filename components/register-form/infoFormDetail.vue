<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2">
      <Input :label="$t('email')" name="email" disabled placeholder="me@example.com" v-model="formGroup.email"
        customIcon="user" @blur="validate('email')" @input="validate('email')" :error="getError('email') || ''" />
    </div>
    <div class="col-span-1">
      <InputPassword :label="$t('password')" name="password" required :placeholder="$t('password')"
        v-model="formGroup.password" custom-icon="unlock" @blur="validate('password')" @input="validate('password')"
        :error="getError('password') || ''" />

    </div>
    <div class="col-span-1">
      <InputPassword :label="$t('confirm_password')" name="confirmPassword" required
        :placeholder="$t('confirm_password')" v-model="formGroup.confirmPassword" custom-icon="unlock"
        @blur="validate('confirmPassword')" @input="validate('confirmPassword')"
        :error="getError('confirmPassword') || ''" />

    </div>
    <UDivider class="col-span-2" />
    <div class="col-span-1">
      <SelectMenu :label="$t('legal_entities')" name="personType" :placeholder="$t('legal_entities')" required
        :options="personTypeOption" v-model="formGroup.personType" @change="validate('personType')"
        :error="getError('personType') || ''" />
    </div>
    <div class="col-span-1">
      <Input :label="$t('taxpayer_identification_no')" name="tax" :placeholder="$t('taxpayer_identification_no')"
        required v-model="formGroup.tax" @blur="validate('tax')" @input="validate('tax')"
        :error="getError('tax') || ''" />
    </div>
    <div class="col-span-1">
      <Input :label="$t('company_name')" name="company" :placeholder="$t('company_name')" required
        v-model="formGroup.company" @blur="validate('company')" @input="validate('company')"
        :error="getError('company') || ''" />
    </div>
    <div class="col-span-1">
      <Input :label="$t('contact_name')" name="fullName" :placeholder="$t('contact_name')" required
        v-model="formGroup.fullName" @blur="validate('fullName')" @input="validate('fullName')"
        :error="getError('fullName') || ''" />
    </div>
    <div class="col-span-1">
      <Input :label="$t('telephone_no')" name="phone" :placeholder="$t('telephone_no')" required
        v-model="formGroup.phone" @blur="validate('phone')" @input="validate('phone')"
        :error="getError('phone') || ''" />
    </div>
    <div class="col-span-1">
      <Input :label="$t('mobile_phone_no')" name="mobilePhone" :placeholder="$t('mobile_phone_no')"
        v-model="formGroup.mobilePhone" @blur="validate('mobilePhone')" @input="validate('mobilePhone')"
        :error="getError('mobilePhone') || ''" />
    </div>
    <div class="col-span-2">
      <SelectMenu :label="$t('country')" name="countryId" :placeholder="$t('country')"
        :searchable-placeholder="$t('search_country')" required v-model="formGroup.countryId" searchable
        :options="addressOptionsStore.countriesOption" @change="(value: any) => validate('countryId', value)"
        :error="getError('countryId') || ''" />

    </div>
    <div v-if="!isOtherCountry" class="col-span-1">
      <SelectMenu :label="$t('province')" name="provinceId" :placeholder="$t('province')" required
        v-model="formGroup.provinceId" :options="addressOptionsStore.provicesOption" searchable
        :searchable-placeholder="$t('search_province')" @change="(value: any) => validate('provinceId', value)"
        :error="getError('provinceId') || ''" />
    </div>
    <div v-if="isOtherCountry" class="col-span-1">
      <Input :label="$t('state_province')" name="stageProvince" :placeholder="$t('state_province')" required
        v-model="formGroup.stageProvince" @blur="validate('stageProvince')" @input="validate('stageProvince')"
        :error="getError('stageProvince') || ''" />
    </div>
    <div class="col-span-1">
      <Input :label="$t('zipcode')" name="zipCode" required :placeholder="$t('zipcode')" v-model="formGroup.zipCode"
        :disabled="!isOtherCountry" @blur="validate('zipCode')" @input="validate('zipCode')"
        :error="getError('zipCode') || ''" />
    </div>
    <div v-if="!isOtherCountry" class="col-span-1">
      <SelectMenu :label="$t('district')" name="districtId" :placeholder="$t('district')" required
        v-model="formGroup.districtId" searchable :options="addressOptionsStore.districtOption"
        :searchable-placeholder="$t('search_district')" @change="(value: any) => validate('districtId', value)"
        :error="getError('districtId') || ''" />
    </div>
    <div v-if="!isOtherCountry" class="col-span-1">
      <SelectMenu :label="$t('subdistrict')" name="subDistrictId" :placeholder="$t('subdistrict')" required
        v-model="formGroup.subDistrictId" searchable :options="addressOptionsStore.subDistrictOption"
        :searchable-placeholder="$t('search_subdistrict')" @change="(value: any) => validate('subDistrictId', value)"
        :error="getError('subDistrictId') || ''" />
    </div>
    <div class="col-span-2">
      <Input :label="$t('address')" name="address" :placeholder="$t('address')" required v-model="formGroup.address"
        @blur="validate('address')" @input="validate('address')" :error="getError('address') || ''" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import InputPassword from "../form/u-input-password.vue";
import SelectMenu from "../form/u-select.vue";

const { locale } = useI18n();

const props = defineProps({
  formGroup: {
    type: Object,
    required: true
  },
  isOtherCountry: {
    type: Boolean,
    default: false
  },
  validate: {
    type: Function,
    required: true
  },
  getError: {
    type: Function,
    required: true
  },
});

const addressOptionsStore = useAddressOptionsStore()
const isOtherCountry = ref(props.isOtherCountry)

onMounted(() => {
  addressOptionsStore.getProvincesOptions()
  addressOptionsStore.getCountriesOptions()
});

watch(
  () => props.formGroup.provinceId,
  (provinceId) => {
    if (provinceId) {
      addressOptionsStore.getDistrictsOptions(provinceId)
      addressOptionsStore.setSubDistrictsOptions()
      props.formGroup.districtId = 0
      props.formGroup.subDistrictId = 0
      props.formGroup.zipCode = ''
    }
  }
);

watch(
  () => props.formGroup.districtId,
  (districtId) => {
    if (districtId) {
      addressOptionsStore.getSubDistrictsOptions(districtId)
      props.formGroup.subDistrictId = 0
      props.formGroup.zipCode = ''
    }
  }
);

watch(
  () => props.formGroup.subDistrictId,
  async (subDistrictId) => {
    if (subDistrictId) {
      const findZipcode: any = addressOptionsStore.subDistrictOption.find((e: any) => e.id === subDistrictId)
      if (findZipcode) {
        props.formGroup.zipCode = findZipcode.zipcode
      } else {
        props.formGroup.zipCode = ''
      }
    }
  }
);

watch(
  () => props.formGroup.countryId,
  (value) => {
    isOtherCountry.value = value !== 219 ? true : false
  }
);

watch(
  () => props.isOtherCountry,
  (value) => {
    isOtherCountry.value = value
  }
);

watch(
  () => locale.value,
  () => {
    addressOptionsStore.getProvincesOptions()
    addressOptionsStore.getCountriesOptions()
    if (props.formGroup.provinceId) {
      addressOptionsStore.getDistrictsOptions(props.formGroup.provinceId)
    }
    if (props.formGroup.districtId) {
      addressOptionsStore.getSubDistrictsOptions(props.formGroup.districtId)
    }
  }
);

const personTypeOption = [{
  id: 'corporate',
  name: 'นิติบุคคล'
}, {
  id: 'personal',
  name: 'บุคคลธรรมดา'
}]


</script>
