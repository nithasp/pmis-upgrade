import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IVtmsLogBookAdd, IVtmsLogBookDetail } from "~/core/interfaces/IVtmsLogBook";

export default function useVtmsTableService() {
   const { $api } = useNuxtApp();
   const getMasterTug = async () => {
      try {
         const response = await $api.get(`/admin/master-data/tug/list`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms tug:", error);
         return wrapperErrorResp(error);
      }
   };
   return {
      getMasterTug,
   };
}
