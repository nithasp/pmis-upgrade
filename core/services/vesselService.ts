// services/auth.ts

import { useNuxtApp } from '#app'
import type { AxiosResponse } from 'axios'
import type { IVesselRequest } from '../interfaces/IVesselRequest'
export default function useVesselService() {
    const { $api } = useNuxtApp()

    const getVesselList = async (filter = {}) => {
        try {
            const filterParams = convertObjToQueryString(filter)
            const response: AxiosResponse = await $api.get(`/admin/vessels?${filterParams}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get vessel failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const getVesselDetail = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.get(`/admin/vessels/${id}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get vessel failed:', error)
            return wrapperErrorResp(error)
        }
    }


    const createVessel = async (body: IVesselRequest) => {
        try {
            const response: AxiosResponse = await $api.post('admin/vessels', { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('create vessel failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const getVesselHistoryList = async (filter = {}, vesselId: number) => {
        try {
           const filterParams = convertObjToQueryString(filter);
           const response: AxiosResponse = await $api.get(`/admin/vessels/${vesselId}/history?${filterParams}`);
           return wrapperSuccessResp(response.data);
        } catch (error) {
           // Handle error (e.g., show a notification or throw an error)
           console.error("get vessel history list failed:", error);
           return wrapperErrorResp(error);
        }
     };
  

    return {
        getVesselList,
        createVessel,
        getVesselDetail,
        getVesselHistoryList
    }
}
