import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IContractDetail, IContractPayload } from "../interfaces/IContracts";

export default function useContractsService() {
   const { $api } = useNuxtApp();

   const getContractList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/contracts?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get contract list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getContractDetail = async (contractId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/contracts/${contractId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get contract detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const createContract = async (body: IContractPayload) => {
      try {
         const response = await $api.post("/contracts", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("create contract failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateContract = async (contractId: number, body: IContractPayload) => {
      try {
         const response = await $api.put(`/contracts/${contractId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update contract failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteContract = async (contractId: number) => {
      try {
         const response: AxiosResponse = await $api.delete(`/contracts/${contractId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("delete contract failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getRate = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/contracts/rates?${filterParams}`);
         return wrapperSuccessResp(response);
      } catch (error) {
         console.error("get rate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getContractList,
      getContractDetail,
      createContract,
      updateContract,
      deleteContract,
      getRate,
   };
}
