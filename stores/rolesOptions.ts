import useMasterDataService from "~/core/services/masterDataService"

export const useRolesOptionsStore = defineStore('rolesOptions', () => {
    const masterDataService = useMasterDataService()
    const rolesOption = ref([])

    const getRolesOptions = async () => {
        const resp = await masterDataService.getRolesOptions()
        if (resp.statusCode === 200) {
            rolesOption.value = resp.data.map((item: any) => ({ id: item.id, name: item.name }))
        }
    }


    return {
        rolesOption,
        getRolesOptions,
    }
})
