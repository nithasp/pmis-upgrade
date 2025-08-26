import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IVesselRequest } from "../interfaces/IVesselRequest";

export default function useVesselImportService() {
   const { $api } = useNuxtApp();

   const getVesselImportList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/vessel-import/list?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getVesselImportListTypeSend = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/vessel-import/list/send?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getVesselImportDetail = async (vesselImportId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/vessel-import/${vesselImportId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel import detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getMapVesselImportDetail = async (vesselImportId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/vessel-import/map/${vesselImportId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get map vessel import detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getVesselImportTemplate = async (fileTemplate: string) => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/template/${fileTemplate}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel import template failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addVesselImport = async (body: IVesselRequest) => {
      try {
         const response: AxiosResponse = await $api.post("/admin/vessels", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("create vessel failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteVesselImport = async (vesselImportId: number) => {
      try {
         const response: AxiosResponse = await $api.delete(`/admin/vessel-import/${vesselImportId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("delete vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const createVesselImport = async (body: any) => {
      try {
         const response: AxiosResponse = await $api.post(`/admin/vessel-import/`, body);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("create vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateVesselImport = async (vesselImportId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`/admin/vessel-import/edit/${vesselImportId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateVesselImportDetail = async (vesselImportId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`/admin/vessel-import/${vesselImportId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update vessel import detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const sendVesselImport = async (vesselImportId: number) => {
      try {
         const response: AxiosResponse = await $api.post(`/admin/vessel-import/${vesselImportId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("send vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const returnVesselImport = async (vesselImportId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`/admin/vessel-import/return/${vesselImportId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("return vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const mapVesselImportVSTV = async (vesselImportId: number, logBookId: number) => {
      try {
         const response: AxiosResponse = await $api.put(`/admin/vessel-import/map/${vesselImportId}/${logBookId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("map vessel import VS VT failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const approveVesselImport = async (vesselImportId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`/admin/vessel-import/approve/${vesselImportId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("approve vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const approveVesselImportEdit = async (vesselImportId: number, type: boolean, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`/admin/vessel-import/approve/edit/${vesselImportId}/${type}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("approve vessel import failed:", error);
         return wrapperErrorResp(error);
      }
   };
   return {
      getVesselImportList,
      getVesselImportListTypeSend,
      getVesselImportDetail,
      getVesselImportTemplate,
      addVesselImport,
      deleteVesselImport,
      createVesselImport,
      updateVesselImport,
      updateVesselImportDetail,
      sendVesselImport,
      getMapVesselImportDetail,
      returnVesselImport,
      mapVesselImportVSTV,
      approveVesselImport,
      approveVesselImportEdit
   };
}
