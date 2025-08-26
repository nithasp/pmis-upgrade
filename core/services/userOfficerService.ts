// services/auth.ts

import { useNuxtApp } from '#app'
import type { AxiosResponse } from 'axios'
import type { IFilter } from '../interfaces/IFilter'
import type { IUserRequest } from '../interfaces/IUserRequest'
export default function useUserOfficerService() {
    const { $api } = useNuxtApp()

    const getUserList = async (filter: IFilter = {
        page: 0,
        limit: 0,
        search: ''
    }) => {
        try {
            const filterParams = convertObjToQueryString(filter)
            const response: AxiosResponse = await $api.get(`/admin/users?${filterParams}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get user failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const getUserDetail = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.get(`/admin/users/${id}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('get user detail failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const createUser = async (body: IUserRequest) => {
        try {
            const response: AxiosResponse = await $api.post('admin/users', { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('create user failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const updateUser = async (id: number, body: IUserRequest) => {
        try {
            const response: AxiosResponse = await $api.put(`admin/users/${id}`, { ...body })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('update user failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const updateUserStatus = async (id: number, enabled: boolean) => {
        try {
            const response: AxiosResponse = await $api.put(`admin/users/${id}/status`, { enabled })
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('update status user failed:', error)
            return wrapperErrorResp(error)
        }
    }

    const cancelUser = async (id: number) => {
        try {
            const response: AxiosResponse = await $api.delete(`admin/users/${id}`)
            return wrapperSuccessResp(response.data)
        } catch (error) {
            // Handle error (e.g., show a notification or throw an error)
            console.error('cancel user failed:', error)
            return wrapperErrorResp(error)
        }
    }

    return {
        getUserList,
        getUserDetail,
        createUser,
        updateUser,
        updateUserStatus,
        cancelUser
    }
}
