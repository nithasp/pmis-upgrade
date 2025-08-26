import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { ICargoTypeAdd, ICargoTypeUpdate } from "~/core/interfaces/ICargoType";

export default function useCargoTypeService() {
   const { $api } = useNuxtApp();

   const getCargoType = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/cargo-type?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get cargoType failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getCargoTypeDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/cargo-type/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get cargoType detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addCargoType = async (body: ICargoTypeAdd) => {
      try {
         const response = await $api.post("/admin/master-data/cargo-type", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add cargoType failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateCargoType = async (id: number, body: ICargoTypeUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/cargo-type/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update cargoType failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getCargoType, getCargoTypeDetail, addCargoType, updateCargoType };
}
