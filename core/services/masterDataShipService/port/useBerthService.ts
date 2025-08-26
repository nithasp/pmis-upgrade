import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IUseBerthAdd, IUseBerthUpdate } from "~/core/interfaces/IUseBerth";

export default function useLocateService() {
   const { $api } = useNuxtApp();

   const getUseBerth = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/use-berth?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getUseBerthDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/use-berth/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addUseBerth = async (body: IUseBerthAdd) => {
      try {
         const response = await $api.post("/admin/master-data/use-berth", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateUseBerth = async (id: number, body: IUseBerthUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/use-berth/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getUseBerth, getUseBerthDetail, addUseBerth, updateUseBerth };
}
