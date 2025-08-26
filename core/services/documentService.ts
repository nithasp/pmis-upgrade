// services/auth.ts

import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IVesselDocumentRequest } from "../interfaces/IVesselDocumentRequest";
import type { IBerthsDocumentRequest } from "../interfaces/IBerthsDocumentRequest";
import type { IInvoiceDocumentRequest } from "../interfaces/IInvoiceDocumentRequest";
import type { ISendBackRejectRequest } from "../interfaces/ISendBackRejectRequest";
import type { IFormMit, IFormMitWaiting } from "../interfaces/IShipTable";
import type { ISpacialBerthsPayload } from "../interfaces/ISpacialBerthsPayload";
export default function useDocumentService() {
   const { $api } = useNuxtApp();

   const getDocumentList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/documents?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentAdminList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/admin-documents?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get admin document list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const createDraft = async (body: IVesselDocumentRequest) => {
      try {
         const response: AxiosResponse = await $api.post("admin/documents", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("create draft failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateDocument = async (documentId: number, body: IVesselDocumentRequest) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("create draft failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const submitToReview = async (id: number) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${id}/submit-for-review`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("submit to review failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDraft = async () => {
      try {
         const response: AxiosResponse = await $api.get("admin/documents/draft");
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get draft failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentDetail = async (documentId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`admin/documents/${documentId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document id failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentDetailByAdmin = async (documentId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`admin/documents/${documentId}/admin`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document admin id failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentReview = async (documentId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`admin/documents/${documentId}/reviews`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document review id failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const cancelDocument = async (documentId: number) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}/cancel`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("cancel document failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const cancelAdminDocument = async (documentId: number) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}/admin-cancel`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("cancel admin document failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addDocumentBerths = async (id: number, body: IBerthsDocumentRequest) => {
      try {
         const response: AxiosResponse = await $api.post(`admin/documents/${id}/berths`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("add document berths failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentBerthDetail = async (id: number, berthId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`admin/documents/${id}/berths/${berthId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("add document berths failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateDocumentBerthDetail = async (id: number, berthId: number, body: IBerthsDocumentRequest) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${id}/berths/${berthId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("update document berths failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteDocumentBerth = async (id: number, berthId: number) => {
      try {
         const response: AxiosResponse = await $api.delete(`admin/documents/${id}/berths/${berthId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("delete document berths failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addDocumentProduct = async (id: number, berthId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.post(`admin/documents/${id}/berths/${berthId}/products`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("add document berths product failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateDocumentProduct = async (id: number, berthId: number, productId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${id}/berths/${berthId}/products/${productId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("update document berths product failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteDocumentProduct = async (id: number, berthId: number, productId: number) => {
      try {
         const response: AxiosResponse = await $api.delete(`admin/documents/${id}/berths/${berthId}/products/${productId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("delete document berths product failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentProductDetail = async (id: number, berthId: number, productId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`admin/documents/${id}/berths/${berthId}/products/${productId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document berths product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getCustomersSearch = async (filter = {}) => {
      const filterParams = convertObjToQueryString(filter);
      try {
         const response: AxiosResponse = await $api.get(`customers/search?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document berths product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addInvoiceDocument = async (documentId: number, body: IInvoiceDocumentRequest) => {
      try {
         const response: AxiosResponse = await $api.post(`admin/documents/${documentId}/customers`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("add invoice failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const sendBackRejected = async (documentId: number, body: ISendBackRejectRequest) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}/reject`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("reject document failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const approveDocument = async (documentId: number, body?: ISpacialBerthsPayload) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}/approve`, {
            ...body
         });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("approve document failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const recallDocument = async (documentId: number) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}/recall`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("recall document failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentBerth = async (berthAlt: string, filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`admin/documents/berths/${berthAlt}?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document berths alt failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateEtdDocumentBerth = async (documentBerthId: number, body: IFormMitWaiting | any) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/berths/etd/${documentBerthId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("update etd document berth failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getDocumentVesselIn = async (berthAlt: string, filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`admin/documents/vessel-in/${berthAlt}?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document vessel in failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateDocumentVesselIn = async (logBookId: number, body: IFormMit | any) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/vessel-in/${logBookId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("update document vessel in failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const exportDocumentToPDF = async (documentId: number) => {
      try {
         const response = await $api.get(
            `admin/documents/${documentId}/export-pdf`,
            {
               responseType: "blob", // Treat response as binary PDF data
            }
         );

         return response;
      } catch (error) {
         console.error("Export document to PDF failed:", error);
         return wrapperErrorResp(error)
      }
   };

   const updateVtmsDocument = async (documentId: number, body: any) => {
      try {
         const response: AxiosResponse = await $api.put(`admin/documents/${documentId}/request-edit`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update vtms document failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getVesselDocVesselList = async (filter = {}, vesselId: number) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/documents/vessel/${vesselId}?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error("get document list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getDocumentList,
      getDocumentAdminList,
      createDraft,
      getDraft,
      submitToReview,
      addDocumentBerths,
      getDocumentBerthDetail,
      updateDocumentBerthDetail,
      deleteDocumentBerth,
      addDocumentProduct,
      getDocumentProductDetail,
      updateDocumentProduct,
      deleteDocumentProduct,
      getCustomersSearch,
      getDocumentDetail,
      addInvoiceDocument,
      cancelDocument,
      sendBackRejected,
      updateDocument,
      approveDocument,
      getDocumentDetailByAdmin,
      getDocumentReview,
      cancelAdminDocument,
      recallDocument,
      getDocumentBerth,
      updateEtdDocumentBerth,
      getDocumentVesselIn,
      updateDocumentVesselIn,
      exportDocumentToPDF,
      updateVtmsDocument,
      getVesselDocVesselList
   };
}
