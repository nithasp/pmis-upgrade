import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IVtmsLogBookAdd, IVtmsLogBookDetail } from "~/core/interfaces/IVtmsLogBook";

export default function useVtmsTableService() {
   const { $api } = useNuxtApp();
   const getVtmsLogBook = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/admin/vtms/log-book?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms table:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtmsLogBookDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/vtms/log-book/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms conclusion:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtmsLogBookBerthDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/vtms/log-book/doc/${id}/berth`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms logbook birth detail:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtmsLogBookDocumentDetail = async (documentId: number) => {
      try {
         const response = await $api.get(`/admin/vtms/log-book/doc/${documentId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms logbook document detail:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtmsDocumentBerthDetail = async (documentId: number, berthId: number) => {
      try {
         const response = await $api.get(`/admin/documents/${documentId}/berths/${berthId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms document berth detail:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVessel = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/admin/vessels?showAll=true`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms table:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVesselGovernment = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/admin/vessel-government?showAll=true`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms table:", error);
         return wrapperErrorResp(error);
      }
   };
   const getPort = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/admin/master-data/port`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get port failed:", error);
         return wrapperErrorResp(error);
      }
   };
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
   const getUseBerth = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/use-berth?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getPurpose = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/purpose?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get purpose failed:", error);
         return wrapperErrorResp(error);
      }
   };
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
   const getJetty = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/berth/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get berth detail failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getTug = async () => {
      try {
         const response = await $api.get(`/admin/master-data/tug/list`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get tug list failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getPilot = async () => {
      try {
         const response = await $api.get(`/admin/master-data/pilot/list`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get pilot list failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getProductType = async () => {
      try {
         const response = await $api.get(`/admin/master-data/product-type/list`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get product type list failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getProductSubType = async (productTypeId: number) => {
      try {
         const response = await $api.get(`/api/v1/admin/master-data/product-sub-type/type/${productTypeId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get product type list failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const addVtmsLogBook = async (body: IVtmsLogBookAdd) => {
      try {
         const response = await $api.post(`/admin/vtms/log-book`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms addVtmsLogBook:", error);
         return wrapperErrorResp(error);
      }
   };
   const updateVtmsLogBook = async (id: number, body: IVtmsLogBookAdd) => {
      try {
         const response = await $api.put(`/admin/vtms/log-book/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms addVtmsLogBook:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteVtmsLogBook = async (id: number) => {
      try {
         const response: AxiosResponse = await $api.delete(`/admin/vtms/log-book/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("delete vessel agent failed:", error);
         return wrapperErrorResp(error);
      }
   };
   return {
      getVtmsLogBook,
      getVtmsLogBookDetail,
      getVtmsLogBookBerthDetail,
      getVtmsLogBookDocumentDetail,
      getVtmsDocumentBerthDetail,
      getVessel,
      getVesselGovernment,
      getPort,
      getBerth,
      getUseBerth,
      getPurpose,
      getLocate,
      getJetty,
      getTug,
      getPilot,
      getProductType,
      getProductSubType,
      addVtmsLogBook,
      updateVtmsLogBook,
      deleteVtmsLogBook,
   };
}
