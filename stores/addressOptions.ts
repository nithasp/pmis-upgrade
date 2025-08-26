import useMasterDataService from "~/core/services/masterDataService"

export const useAddressOptionsStore = defineStore('addressOptions', () => {
    const { t, locale } = useI18n();
    const masterDataService = useMasterDataService()
    const countriesOption = ref([])
    const provicesOption = ref([])
    const districtOption = ref([])
    const subDistrictOption = ref([])

    const getCountriesOptions = async () => {
        const resp = await masterDataService.getCountries()
        if (resp.statusCode === 200) {
            countriesOption.value = resp.data
                .map((item: any) => ({ id: item.id, name: locale.value === 'th' ? item.nameTh : item.nameEn }))
                .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
        }
    }

    const getProvincesOptions = async () => {
        const resp = await masterDataService.getProvinces()
        if (resp.statusCode === 200) {
            provicesOption.value = resp.data
                .map((item: any) => ({ id: item.id, name: locale.value === 'th' ? item.nameTh : item.nameEn }))
                .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
        }
    }

    const getDistrictsOptions = async (provinceId: number) => {
        const resp = await masterDataService.getDistricts(provinceId)
        if (resp.statusCode === 200) {
            districtOption.value = resp.data
                .map((item: any) => ({ ...item, id: item.id, name: locale.value === 'th' ? item.nameTh : item.nameEn }))
                .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
        }
    }

    const getSubDistrictsOptions = async (districtId: number) => {
        const resp = await masterDataService.getSubDistricts(districtId)
        if (resp.statusCode === 200) {
            subDistrictOption.value = resp.data
                .map((item: any) => ({ ...item, id: item.id, name: locale.value === 'th' ? item.nameTh : item.nameEn }))
                .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
        }
    }

    const setSubDistrictsOptions = (list = []) => {
        subDistrictOption.value = list
    }
    return {
        provicesOption,
        districtOption,
        subDistrictOption,
        countriesOption,
        getProvincesOptions,
        getDistrictsOptions,
        getSubDistrictsOptions,
        getCountriesOptions,
        setSubDistrictsOptions
    }
})
