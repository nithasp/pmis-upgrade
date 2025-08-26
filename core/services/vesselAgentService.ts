// services/auth.ts

import { useNuxtApp } from '#app'
import type { AxiosResponse } from 'axios'
import type { IVesselAgentRequest } from '../interfaces/IVesselAgentRequest'
export default function useVesselAgentService() {
    const { $api } = useNuxtApp()

    const getVesselAgentList = async (filter = {}) => {
        try {
            const filterParams = convertObjToQueryString(filter)
            const response: AxiosResponse = await $api.get(`/admin/vessel-agencies?${filterParams}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get vessel agent failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const getVesselAgentDetail = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.get(`/admin/vessel-agencies/${id}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get vessel agent failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const createVesselAgent = async (body: IVesselAgentRequest) => {
        try {
            const response: AxiosResponse = await $api.post('/admin/vessel-agencies', { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('create vessel agent failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const updateVesselAgent = async (body: IVesselAgentRequest, id: number) => {
        try {
            const response: AxiosResponse = await $api.put(`/admin/vessel-agencies/${id}`, { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('update vessel agent failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const deleteVesselAgent = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.delete(`/admin/vessel-agencies/${id}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('delete vessel agent failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const approveVesselAgent = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.put(`/admin/vessel-agencies/${id}/approve`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('approve vessel agent failed:', error)
            return wrapperErrorResp(error)
        }
    }
    return {
        getVesselAgentList,
        getVesselAgentDetail,
        createVesselAgent,
        updateVesselAgent,
        deleteVesselAgent,
        approveVesselAgent
    }
}
