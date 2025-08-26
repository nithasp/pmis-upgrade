<template>
    <h2 class="font-bold mb-3">รายละเอียดที่อยู่ใบแจ้งหนี้</h2>
    <UDivider class="my-4" />
    <div class="border border-grayy-100 p-8 rounded-xl mt-6">
      <!-- First Section: Customer / Payment Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-1 md:col-span-2">
          <UFormGroup label="ชื่อลูกค้า/บริษัท" name="name" required :error="getError('name') || ''">
            <UInputMenu v-model="formGroup.name" size="md" variant="outline" color="purple"
              :search="onSearchCustomer" placeholder="ค้นหา" option-attribute="name" trailing by="id"
              @change="handleChangeCustomer">
              <template #leading>
                <NuxtIcon name="search" size="xl" />
              </template>
            </UInputMenu>
          </UFormGroup>
        </div>
        <div class="col-span-1">
          <UFormGroup :label="$t('taxpayer_identification_no')" name="taxId" required :error="getError('taxId') || ''">
            <UInputMenu v-model="formGroup.taxId" size="md" variant="outline" color="purple"
              :search="onSearchCustomerTax" :placeholder="$t('taxpayer_identification_no')" option-attribute="name"
              trailing by="id" @change="handleChangeCustomerTax">
              <template #leading>
                <NuxtIcon name="search" size="xl" />
              </template>
            </UInputMenu>
          </UFormGroup>
        </div>
        <div class="col-span-1">
          <UInput :label="$t('ชื่อผู้ติดต่อ')" :placeholder="$t('ชื่อผู้ติดต่อ')" name="contactName" required
            v-model="formGroup.contactName" @blur="validate('contactName')" @input="validate('contactName')"
            :error="getError('contactName') || ''" />
        </div>
        <div class="col-span-1">
          <USelect :label="$t('วิธีการชำระเงิน')" :placeholder="$t('วิธีการชำระเงิน')" name="paymentMethodId"
            required :options="documentOptionsStore.paymentMethodOptions" v-model="formGroup.paymentMethodId"
            @change="(value: any) => validate('paymentMethodId', value)"
            :error="getError('paymentMethodId') || ''" />
        </div>
        <div class="col-span-1">
          <USelect :label="$t('เงื่อนไขการชำระเงิน')" :placeholder="$t('เงื่อนไขการชำระเงิน')"
            name="paymentTermId" required :options="documentOptionsStore.paymentTermsOptions"
            v-model="formGroup.paymentTermId" @change="(value: any) => validate('paymentTermId', value)"
            :error="getError('paymentTermId') || ''" />
        </div>
      </div>
  
      <UDivider class="my-4" />
      <h2 class="font-bold mb-3">{{ $t('invoice_address') }}</h2>
  
      <!-- Second Section: Invoice Address -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-1 md:col-span-2">
          <USelect :label="$t('country')" name="countryId" :placeholder="$t('country')" required
            :searchable-placeholder="$t('search_country')" v-model="formGroup.countryId" searchable
            :options="addressOptionsStore.countriesOption"
            @change="(value: any) => validate('countryId', value)" :error="getError('countryId') || ''" />
        </div>
        <div v-if="!isOtherInvoiceCountry" class="col-span-1">
          <USelect :label="$t('province')" name="provinceId" :placeholder="$t('province')" required
            v-model="formGroup.provinceId" :options="addressOptionsStore.provicesOption" searchable
            :searchable-placeholder="$t('search_province')"
            @change="(value: any) => validate('provinceId', value)" :error="getError('provinceId') || ''" />
        </div>
        <div v-if="isOtherInvoiceCountry" class="col-span-1">
          <UInput :label="$t('state_province')" name="stageProvince" :placeholder="$t('state_province')" required
            v-model="formGroup.stageProvince" @blur="validate('stageProvince')"
            @input="validate('stageProvince')" :error="getError('stageProvince') || ''" />
        </div>
        <div class="col-span-1">
          <UInput :label="$t('zipcode')" name="postCode" :placeholder="$t('zipcode')" required
            v-model="formGroup.postCode" :disabled="!isOtherInvoiceCountry" @blur="validate('postCode')"
            @input="validate('postCode')" :error="getError('postCode') || ''" />
        </div>
        <div v-if="!isOtherInvoiceCountry" class="col-span-1">
          <USelect :label="$t('district')" name="districtId" :placeholder="$t('district')" required searchable
            :options="addressOptionsStore.districtOption" v-model="formGroup.districtId"
            :searchable-placeholder="$t('search_district')"
            @change="(value: any) => validate('districtId', value)" :error="getError('districtId') || ''" />
        </div>
        <div v-if="!isOtherInvoiceCountry" class="col-span-1">
          <USelect :label="$t('subdistrict')" name="subDistrictId" :placeholder="$t('subdistrict')" required
            searchable :options="addressOptionsStore.subDistrictOption" v-model="formGroup.subDistrictId"
            :searchable-placeholder="$t('search_subdistrict')"
            @change="(value: any) => validate('subDistrictId', value)"
            :error="getError('subDistrictId') || ''" />
        </div>
        <div class="col-span-1 md:col-span-2">
          <UInput :label="$t('address')" name="address" :placeholder="$t('address')" required
            v-model="formGroup.address" @blur="validate('address')" @input="validate('address')"
            :error="getError('address') || ''" />
        </div>
      </div>
    </div>
  </template>
  

<script setup lang="ts">
import UInput from '../form/u-input.vue';
import USelect from '../form/u-select.vue';
import useDocumentService from "~/core/services/documentService";
import type { ISearchCustomer } from "~/core/interfaces/ISearchCustomer";
import NuxtIcon from "../ui/nuxtIcon.vue";

const props = defineProps({
    formGroup: {
        type: Object,
        required: true
    },
    setCountryChange: {
        type: Function,
        default: () => { }
    },
    isOtherInvoiceCountry: {
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

const { t } = useI18n();
const isOtherCountry = ref(false)
const addressOptionsStore = useAddressOptionsStore()
const documentOptionsStore = useDocumentOptionsStore()
const documentService = useDocumentService()

onMounted(() => {
    addressOptionsStore.getCountriesOptions()
    addressOptionsStore.getProvincesOptions()
});

const onSearchCustomer = async (q: any) => {
    const filter = { search: q, field: 'name' }
    if (q) {
        const resp = await documentService.getCustomersSearch(filter)
        if (resp.statusCode === 200) {
            props.formGroup.name = q
            props.validate('name')
            return resp.data.map((e: ISearchCustomer) => ({ ...e, id: e.id, name: e.name }))
        }
        props.formGroup.name = q
        props.validate('name')
        return []
    }
    return []
}

const onSearchCustomerTax = async (q: any) => {
    const filter = { search: q, field: 'tax_id' }
    if (q) {
        const resp = await documentService.getCustomersSearch(filter)
        if (resp.statusCode === 200) {
            props.formGroup.taxId = q
            props.formGroup.customerId = null
            props.validate('taxId')
            return resp.data.map((e: ISearchCustomer) => ({ id: e.id, name: e.taxId }))
        }
        props.formGroup.taxId = q
        props.formGroup.customerId = null
        props.validate('taxId')
        return []
    }
    return []
}

const handleChangeCustomer = (value: any) => {
    props.formGroup.customerId = value.id
    props.formGroup.name = value.name
    props.formGroup.taxId = value.taxId
    props.formGroup.contactName = value.contactName
    props.formGroup.paymentMethodId = value.paymentMethodId
    props.formGroup.paymentTermId = value.paymentTermId
    props.formGroup.countryId = value.countryId
    props.formGroup.subDistrictId = value.subDistrictId || 0
    props.formGroup.districtId = value.districtId || 0
    props.formGroup.provinceId = value.provinceId || 0
    props.formGroup.postCode = value.postCode
    props.formGroup.stageProvince = value.stageProvince
    props.formGroup.address = value.address
    props.validate('name')
}

const handleChangeCustomerTax = (value: any) => {
    console.log('value==>', value)
    props.formGroup.taxId = value.name
    props.validate('taxId')
}

watch(
    () => props.formGroup.countryId,
    (value) => {
        isOtherCountry.value = value !== 219 ? true : false
        props.setCountryChange(value !== 219 ? true : false)
    }
);

watch(
    () => props.formGroup.provinceId,
    async (provinceId) => {
        if (provinceId) {
            await addressOptionsStore.getDistrictsOptions(provinceId)
        }
    }
);

watch(
    () => props.formGroup.districtId,
    async (districtId) => {
        if (districtId) {
            await addressOptionsStore.getSubDistrictsOptions(districtId)
        }
    }
);

watch(
    () => props.formGroup.subDistrictId,
    async (subDistrictId) => {
        if (subDistrictId) {
            const findZipcode: any = addressOptionsStore.subDistrictOption.find((e: any) => e.id === subDistrictId)
            if (findZipcode) {
                props.formGroup.postCode = findZipcode.zipcode
            } else {
                props.formGroup.postCode = props.formGroup.postCode || ''
            }
        }
    }
);

watch(
    () => props.isOtherInvoiceCountry,
    (value) => {
        isOtherCountry.value = value
    }
);

</script>
