import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
interface UploadResponse {
   // Define the shape of your expected response here
   success: boolean;
   message: string;
   data?: any; // Replace 'any' with actual data type
}

export default function useMasterDataService() {
   const { $api } = useNuxtApp();
   const getCountries = async () => {
      try {
         const response = await $api.get("/options/countries");
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get get countries failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getProvinces = async () => {
      try {
         const response = await $api.get("/options/provinces");
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get provices failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getDistricts = async (proviceId: number) => {
      try {
         const response = await $api.get(`/options/districts?province_id=${proviceId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get distritcs failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getSubDistricts = async (districtId: number) => {
      try {
         const response = await $api.get(`/options/subdistricts?district_id=${districtId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get sub distritcs failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getTermsContent = async () => {
      try {
         const response = await $api.get(`/contents/terms`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get terms content failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileRegister = async (file: File, type?: string) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);
      if (type) formData.append("type", type);

      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/upload/register", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload file register failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileSetting = async (file: File, type?: string) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);
      if (type) formData.append("type", type);

      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/upload/register", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload file register failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileContract = async (file: File) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);

      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/contracts/upload", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload file contract failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileVessel = async (file: File, type: string) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);
      formData.append("type", type);
      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/admin/vessels/uploads", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload file register failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getRolesOptions = async () => {
      try {
         const response = await $api.get(`/options/roles`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get roles option failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileBerth = async (file: File, documentId: number, berthId: number, type: string) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);
      formData.append("type", type)
      try {
         const response: AxiosResponse<UploadResponse> = await $api.post(`/admin/documents/${documentId}/berths/${berthId}/uploads`, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload file documents berths failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteFileBerth = async (documentId: number, berthId: number, fileId: number) => {
      try {
         const response: AxiosResponse<UploadResponse> = await $api.delete(`/admin/documents/${documentId}/berths/${berthId}/files/${fileId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("delete file documents berths failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileDocument = async (file: File, type: string) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);
      formData.append("type", type);
      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/admin/documents/uploads", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload file register failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadVesselImport = async (file: File) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);

      try {
         const response: AxiosResponse<UploadResponse> = await $api.post("/admin/master-data/upload", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("upload vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getCountries,
      getProvinces,
      getDistricts,
      getSubDistricts,
      getTermsContent,
      uploadFileRegister,
      uploadFileVessel,
      uploadFileContract,
      getRolesOptions,
      uploadFileBerth,
      uploadFileDocument,
      deleteFileBerth,
      uploadVesselImport,
      uploadFileSetting
   };
}
