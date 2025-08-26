import { useNuxtApp } from "#app";
import type { IVesselTypePost, IVesselTypePut, IVesselFlagPost, IVesselFlagPut } from "~/core/interfaces/IVessel";

export default function useMasterDataShipService() {
   const { $api } = useNuxtApp();
   const getVesselType = async (query: any) => {
      try {
         const response = await $api.get(`/admin/master-data/vessel-type?${query}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const postVesselType = async (body: IVesselTypePost) => {
      try {
         const response = await $api.post("/admin/master-data/vessel-type", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const putVesselType = async (id: number, body: IVesselTypePut) => {
      try {
         const response = await $api.put(`/admin/master-data/vessel-type/${id}`, { ...body });
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
   const postVesselFlag = async (body: IVesselTypePost) => {
      try {
         const response = await $api.post("/admin/master-data/vessel-flag", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
         return wrapperErrorResp(error);
      }
   };
   const putVesselFlag = async (id: number, body: IVesselTypePut) => {
      try {
         const response = await $api.put(`/admin/master-data/vessel-flag/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type:", error);
      }
   };
   const getVesselTypeOption = async () => {
      try {
         const response = await $api.get(`/options/vessel-types`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel type option:", error);
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

   const getVesselFlagsOption = async () => {
      try {
         const response = await $api.get(`/options/vessel-flags`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel flags option:", error);
         return wrapperErrorResp(error);
      }
   };

   const getVesselOwnersOption = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/options/vessel-owners?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel flags option:", error);
         return wrapperErrorResp(error);
      }
   };
   return {
      getVesselType,
      postVesselType,
      putVesselType,
      getVesselFlag,
      postVesselFlag,
      putVesselFlag,
      uploadFileVessel,
      getVesselTypeOption,
      getVesselFlagsOption,
      getVesselOwnersOption,
   };
}
