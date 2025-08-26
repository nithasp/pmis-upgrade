import useMasterDataShipService from "~/core/services/masterDataShipService/vesselService"

export const useVesselOptionsStore = defineStore('vesselOptions', () => {
    const masterDataShipService = useMasterDataShipService()
    const vesselTypeOption = ref([])
    const vesselFlagsOption = ref([])
    const vesselOwnersOption = ref([])

    const getVesselTypeOption = async () => {
        const resp = await masterDataShipService.getVesselTypeOption()
        if (resp.statusCode === 200) {
            vesselTypeOption.value = resp.data.map((item: any) => ({ id: item.id, name: item.name }))
        }
    }

    const getVesselFlagOption = async () => {
        const resp = await masterDataShipService.getVesselFlagsOption()
        if (resp.statusCode === 200) {
            vesselFlagsOption.value = resp.data.map((item: any) => ({ ...item, id: item.id, name: item.name, avatar: { src: item.path } }))
        }
    }

    const getVesselOwnersOption = async (filter = {}) => {
        const resp = await masterDataShipService.getVesselOwnersOption(filter)
        if (resp.statusCode === 200) {
            vesselOwnersOption.value = resp.data
        }
    }

    return {
        vesselTypeOption,
        vesselFlagsOption,
        vesselOwnersOption,
        getVesselTypeOption,
        getVesselFlagOption,
        getVesselOwnersOption
    }
})
