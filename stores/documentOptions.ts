import useProductService from "~/core/services/masterDataShipService/product/productService";
import useOptionsService from "~/core/services/options/optionsService"

export const useDocumentOptionsStore = defineStore('documentOptions', () => {
    const { locale } = useI18n();
    const optionsService = useOptionsService()
    const productService = useProductService()
    const berthsOption = ref<any>([])
    const berthTypesOption = ref([])
    const purposesOptions = ref<any>([])
    const filteredPurposesOptions = ref<any>([])
    const purposeTypeOptions = ref([])
    const locationsOptions = ref([])
    const productsOptions = ref([])
    const productGroupsOptions = ref([])
    const productTypesOptions = ref([])
    const productTypeByProductTypeId = ref([])
    const productGroupOptions = ref([])
    const cargoTypesOptions = ref([])
    const cargoWharfageOptions = ref([])
    const paymentMethodOptions = ref([])
    const paymentTermsOptions = ref([])
    const documentStatusOptions = ref([])
    const vesselTypeOptions = ref([])
    const vesselStatusOptions = ref([])
    const vesselFlagOptions = ref([])
    const jettiesOptions = ref([])
    const berthJettiesOptions = ref([])
    const acencyDocumentStatusOptions = ref([])
    const cargoOwnerOptions = ref<any>([])

    const getBerthsOptions = async () => {
        const resp = await optionsService.getBerthsOptions()
        if (resp.statusCode === 200) {
            berthsOption.value = resp.data.map((item: any) => ({ id: item.id, name: locale.value === 'th' ? item.nameTh : item.nameEn, ...item }))
        }
    }

    const getBerthTypesOptions = async () => {
        const resp = await optionsService.getBerthTypesOptions()
        if (resp.statusCode === 200) {
            berthTypesOption.value = resp.data.map((item: any) => ({ id: item.code, name: item.name }))
        }
    }

    const getPurposesOptionsByType = async (typeId: number) => {
        filteredPurposesOptions.value = purposesOptions.value
            .filter((item: any) => { return item.purposeTypeId == typeId })
            .map((item: any) => ({ id: item.id, name: item.name, ...item }))
    }

    const getPurposesOptions = async () => {
        const resp = await optionsService.getPurposesOptions()
        if (resp.statusCode === 200) {
            purposesOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getPurposeTypeOptions = async () => {
        const resp = await optionsService.getPurposeTypeOptions()
        if (resp.statusCode === 200) {
            purposeTypeOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getLocationsOptions = async () => {
        const resp = await optionsService.getLocationsOptions()
        if (resp.statusCode === 200) {
            locationsOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getProductOptions = async () => {
        const resp = await optionsService.getProductOptions()
        if (resp.statusCode === 200) {
            productsOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getProductGroupsOptions = async () => {
        const resp = await optionsService.getProductGroupsOptions()
        if (resp.statusCode === 200) {
            productGroupsOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getProductTypesOptions = async () => {
        const resp = await optionsService.getProductTypesOptions()
        if (resp.statusCode === 200) {
            productTypesOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getProductTypeByProductTypeId = async (productGroupId: number) => {
        const resp = await productService.getProductTypeByProductTypeId(productGroupId)
        if (resp.statusCode === 200) {
            productTypeByProductTypeId.value = resp.data.map((item: any) => ({ id: item.product_type_id, name: item.product_type_name, ...item }))
        }
    }

    const getProductGroupOptions = async () => {
        const resp = await optionsService.getProductGroupOptions()
        if (resp.statusCode === 200) {
            productGroupOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getCargoTypesOptions = async () => {
        const resp = await optionsService.getCargoTypesOptions()
        if (resp.statusCode === 200) {
            cargoTypesOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getCargoWharfageOptions = async () => {
        const resp = await optionsService.getCargoWharfageOptions()
        if (resp.statusCode === 200) {
            cargoWharfageOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getPaymentMethodOptions = async () => {
        const resp = await optionsService.getPaymentMethodOptions()
        if (resp.statusCode === 200) {
            paymentMethodOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getPaymentTermsOptions = async () => {
        const resp = await optionsService.getPaymentTermsOptions()
        if (resp.statusCode === 200) {
            paymentTermsOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getDocumentStatusOptions = async () => {
        const resp = await optionsService.getDocumentStatusOptions()
        if (resp.statusCode === 200) {
            documentStatusOptions.value = resp.data.map((item: any) => ({ id: item.ids, name: item.name, ...item }))
        }
    }

    const getVesselTypeOptions = async () => {
        const resp = await optionsService.getVesselTypeOptions()
        if (resp.statusCode === 200) {
            vesselTypeOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getVesselStatusOptions = async () => {
        const resp = await optionsService.getVesselStatusOptions()
        if (resp.statusCode === 200) {
            vesselStatusOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getVesselFlagOptions = async () => {
        const resp = await optionsService.getVesselFlagOptions()
        if (resp.statusCode === 200) {
            vesselFlagOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getJettiesOptions = async () => {
        const resp = await optionsService.getJettiesOptions()
        if (resp.statusCode === 200) {
            jettiesOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getBerthJettiesOptions = async (berthId: number) => {
        const resp = await optionsService.getBerthJettiesOptions(berthId)
        if (resp.statusCode === 200) {
            berthJettiesOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    const getAcencyDocumentStatusOptions = async () => {
        const resp = await optionsService.getAcencyDocumentStatusOptions()
        if (resp.statusCode === 200) {
            acencyDocumentStatusOptions.value = resp.data.map((item: any) => ({ id: item.ids, name: item.name, ...item }))
        }
    }

    const getCargoOwnerOptions = async () => {
        const resp = await optionsService.getCargoOwnerOptions()
        if (resp.statusCode === 200) {
            cargoOwnerOptions.value = resp.data.map((item: any) => ({ id: item.id, name: item.name, ...item }))
        }
    }

    return {
        getBerthsOptions,
        getBerthTypesOptions,
        getPurposesOptions,
        getPurposesOptionsByType,
        getPurposeTypeOptions,
        getLocationsOptions,
        getProductOptions,
        getProductGroupsOptions,
        getProductTypesOptions,
        getProductGroupOptions,
        getCargoTypesOptions,
        getCargoWharfageOptions,
        getPaymentMethodOptions,
        getPaymentTermsOptions,
        getDocumentStatusOptions,
        getVesselTypeOptions,
        getVesselStatusOptions,
        getVesselFlagOptions,
        getJettiesOptions,
        getBerthJettiesOptions,
        getAcencyDocumentStatusOptions,
        getCargoOwnerOptions,
        getProductTypeByProductTypeId,
        berthsOption,
        berthTypesOption,
        purposesOptions,
        filteredPurposesOptions,
        purposeTypeOptions,
        locationsOptions,
        productsOptions,
        productGroupsOptions,
        productTypesOptions,
        productGroupOptions,
        cargoTypesOptions,
        cargoWharfageOptions,
        paymentMethodOptions,
        paymentTermsOptions,
        documentStatusOptions,
        vesselTypeOptions,
        vesselStatusOptions,
        vesselFlagOptions,
        jettiesOptions,
        berthJettiesOptions,
        acencyDocumentStatusOptions,
        cargoOwnerOptions,
        productTypeByProductTypeId
    }
})
