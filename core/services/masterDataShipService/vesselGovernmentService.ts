import { useNuxtApp } from "#app";
import type { IVesselTypeGet, IVesselGovornmentDetail } from "~/core/interfaces/IVesselGovernment";

export default function useMasterDataShipService() {
   const { $api } = useNuxtApp();
   const getVesselGovernment = async (query: any) => {
      try {
         const filterParams = convertObjToQueryString(query);
         const response = await $api.get(`/admin/vessel-government?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const postVesselGovernment = async (body: IVesselGovornmentDetail) => {
      try {
         const response = await $api.post("/admin/vessel-government", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const putVesselGovernment = async (id: number, body: IVesselGovornmentDetail) => {
      try {
         const response = await $api.put(`/admin/vessel-government/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const deleteVesselGovernment = async (addressId: number) => {
      try {
         const response = await $api.delete(`/admin/vessel-government/${addressId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("delete address user failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVesselGovernmentDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/vessel-government/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const getAuthority = async () => {
      try {
         const response = await $api.get(`/options/authority`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
      
   };
   const getVesselFlag = async (query: any) => {
      try {
         const response = await $api.get(`/admin/master-data/vessel-flag?${query}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVesselFlagsOption = async () => {
      try {
         const response = await $api.get(`/options/vessel-flags`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel flags option:", error);
         return wrapperErrorResp(error);
      }
   };
   const uploadFileVessel = async (file: File) => {
      const formData = new FormData();
      // console.log('file.name',file)
      formData.append("file", file[0], file[0].name);
      let percentCompleted = null;
      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/admin/master-data/upload", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
               percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
         });
         const result = {
            resp: wrapperSuccessResp(response),
            percentCompleted: percentCompleted,
         };
         return result;
      } catch (error) {
         console.error("upload file register failed:", error);
         return wrapperErrorResp(error);
      }
   };
   

   return {
      getVesselGovernment,
      postVesselGovernment,
      putVesselGovernment,
      deleteVesselGovernment,
      getVesselGovernmentDetail,
      getAuthority,
      getVesselFlag,
      uploadFileVessel,
      getVesselFlagsOption
   };
}
