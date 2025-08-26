import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";

export default function usePortDuesService() {
   const { $api } = useNuxtApp();

   const getPortDuesPendingList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/port-dues/pending?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get post dues pending list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getPortDuesInvoiceList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/port-dues?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get post dues list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getPortDuesPendingDetail = async (id: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/port-dues/pending/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get post dues pending detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getPortDuesDetail = async (id: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/port-dues/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get post dues detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const createPortDues = async (body: any) => {
      try {
         const response: AxiosResponse = await $api.post(`/port-dues`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("create post dues failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const cancelPortDues = async (id: number, note: string) => {
      try {
         const response: AxiosResponse = await $api.put(`/port-dues/${id}/cancel`, { note });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("cancel post dues failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getPortDuesPendingList,
      getPortDuesPendingDetail,
      createPortDues,
      getPortDuesInvoiceList,
      getPortDuesDetail,
      cancelPortDues
   };
}
