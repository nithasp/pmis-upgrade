import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IPurposeAdd, IPurposeUpdate } from "~/core/interfaces/IPurpose";

export default function usePurposeService() {
   const { $api } = useNuxtApp();

   const getPurposeType = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/purpose-type?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get purpose failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getPurpose = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/purpose?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get purpose failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getPurposeDetailById = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/purpose/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get purpose detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addPurpose = async (body: IPurposeAdd) => {
      try {
         const response = await $api.post("/admin/master-data/purpose", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add purpose failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updatePurpose = async (id: number, body: IPurposeUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/purpose/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update purpose failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getPurpose, getPurposeType, getPurposeDetailById, addPurpose, updatePurpose };
}
