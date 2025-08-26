export const useVesselStore = defineStore('vesselStore', () => {
    const vesselId = ref<number>(0)

    const setVesselId = (id: number) => {
        vesselId.value = id
    }

    return {
        vesselId,
        setVesselId,
    }
})
