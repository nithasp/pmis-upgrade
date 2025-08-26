import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { ILocateAdd, ILocateUpdate } from "~/core/interfaces/ILocate";

export default function useLocateService() {
   const { $api } = useNuxtApp();

   const getLocate = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/locate?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getLocateDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/locate/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addLocate = async (body: ILocateAdd) => {
      try {
         const response = await $api.post("/admin/master-data/locate", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateLocate = async (id: number, body: ILocateUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/locate/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getLocate, getLocateDetail, addLocate, updateLocate };
}
