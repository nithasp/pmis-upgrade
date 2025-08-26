import { useNuxtApp } from "#app";
import type { IVtmsTableGet, IVtmsConclusionGet } from "~/core/interfaces/IVtTable";

export default function useVtmsTableService() {
   const { $api } = useNuxtApp();
   const getVt = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
          const response = await $api.get(`/admin/vtms/documents?${filterParams}`);
          return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms table:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtConclusion = async () => {
      try {
          const response = await $api.get(`/admin/vtms/`);
          return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms conclusion:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getVt,
      getVtConclusion
   };
}
