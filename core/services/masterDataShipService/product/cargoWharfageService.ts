import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { ICargoWharfageAdd, ICargoWharfageUpdate } from "~/core/interfaces/ICargoWharfage";

export default function useLocateService() {
   const { $api } = useNuxtApp();

   const getCargoWharfage = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/cargo-wharfage?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getCargoWharfageDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/cargo-wharfage/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get locate detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addCargoWharfage = async (body: ICargoWharfageAdd) => {
      try {
         const response = await $api.post("/admin/master-data/cargo-wharfage", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateCargoWharfage = async (id: number, body: ICargoWharfageUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/cargo-wharfage/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update locate failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getCargoWharfage, getCargoWharfageDetail, addCargoWharfage, updateCargoWharfage };
}
