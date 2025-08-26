import { useNuxtApp } from "#app";

export default function useAdminService() {
   const { $api } = useNuxtApp();

   const getVesselAgenciesDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/vessel-agencies/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel agencies failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getVesselAgenciesDetail,
   };
}
