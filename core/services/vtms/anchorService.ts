import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IVtmsLogBookAdd, IVtmsLogBookDetail } from "~/core/interfaces/IVtmsLogBook";

export default function useVtmsTableService() {
   const { $api } = useNuxtApp();
   const getVtmsAnchor = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/admin/vtms/anchor?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms anchor:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtmsAnchorDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/vtms/anchor/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms anchor detail:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVtmsAnchorDocument = async (documentId: number) => {
      try {
         const response = await $api.get(`/admin/vtms/anchor/doc/${documentId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms anchor detail:", error);
         return wrapperErrorResp(error);
      }
   };
   const getVessel = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response = await $api.get(`/admin/vessels?${filterParams}`);
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
         const response: AxiosResponse = await $api.get(`/admin/master-data/cargo-wharfage?${filterParams}`);
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
   const addVtmsAnchor = async (body: IVtmsLogBookAdd) => {
      try {
         const response = await $api.post(`/admin/vtms/anchor`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms addVtms anchor:", error);
         return wrapperErrorResp(error);
      }
   };
   const updateVtmsAnchor = async (id:number,body: IVtmsLogBookAdd) => {
      try {
         const response = await $api.put(`/admin/vtms/anchor/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vtms update anchor:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteVtmsAnchor = async (id: number) => {
      try {
          const response: AxiosResponse = await $api.delete(`/admin/vtms/anchor/${id}`)
          return wrapperSuccessResp(response.data)
      } catch (error) {
          // Handle error (e.g., show a notification or throw an error)
          console.error('delete anchor failed:', error)
          return wrapperErrorResp(error)
      }
  }
   return {
      getVtmsAnchor,
      getVtmsAnchorDetail,
      getVtmsAnchorDocument,
      getVessel,
      getPort,
      getBerth,
      addVtmsAnchor,
      updateVtmsAnchor,
      deleteVtmsAnchor
   };
}
