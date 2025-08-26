import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IBerthAdd, IBerthUpdate } from "~/core/interfaces/IBerth";

export default function useBerthService() {
   const { $api } = useNuxtApp();

   const getBerth = async (filter = {}) => { 
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/berth?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get berth failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getBerthDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/berth/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get berth detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addBerth = async (body: IBerthAdd) => {
      try {
         const response = await $api.post("/admin/master-data/berth", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add berth failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateBerth = async (id: number, body: IBerthUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/berth/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update berth failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getBerth, getBerthDetail, addBerth, updateBerth };
}
