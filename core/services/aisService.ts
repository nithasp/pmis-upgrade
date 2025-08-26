import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";

export default function useAisService() {
   const { $api } = useNuxtApp();

   const getAisActivity = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/ais/activity?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get ais activity failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getAisMap = async () => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/ais/activity/map`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get ais map failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getAisLogs = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/ais/logs?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get ais logs failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getAisActivity,
      getAisMap,
      getAisLogs,
   };
}
