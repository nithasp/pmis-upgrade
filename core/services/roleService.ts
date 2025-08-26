// services/auth.ts

import { useNuxtApp } from '#app'
import type { AxiosResponse } from 'axios'
import type { IVesselRequest } from '../interfaces/IVesselRequest'
import type { IFilter } from '../interfaces/IFilter'
import type { IRoleRequest } from '../interfaces/IRoleRequest'
export default function useRoleService() {
    const { $api } = useNuxtApp()

    const getRolesList = async (filter: IFilter = {
        page: 0,
        limit: 0,
        search: ''
    }) => {
        try {
            const filterParams = convertObjToQueryString(filter)
            const response: AxiosResponse = await $api.get(`/admin/roles?${filterParams}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get roles failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const getRoleDetail = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.get(`/admin/roles/${id}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get role detail failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const createRole = async (body: IRoleRequest) => {
        try {
            const response: AxiosResponse = await $api.post('admin/roles', { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('create role failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const updateRole = async (id: number, body: IRoleRequest) => {
        try {
            const response: AxiosResponse = await $api.put(`admin/roles/${id}`, { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('update role failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const updateRoleStatus = async (id: number, enabled: boolean) => {
        try {
            const response: AxiosResponse = await $api.put(`admin/roles/${id}/status`, { enabled })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('update status role failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const cancelRole = async (id: number, newRoleId: number = 0) => {
        try {
            const url = newRoleId ? `admin/roles/${id}/${newRoleId}` : `admin/roles/${id}`
            const response: AxiosResponse = await $api.delete(url)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('cancel role failed:', error)
            return wrapperErrorResp(error)
        }
    }

    return {
        getRolesList,
        getRoleDetail,
        createRole,
        updateRole,
        updateRoleStatus,
        cancelRole
    }
}
