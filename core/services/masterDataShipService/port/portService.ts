import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IPortAdd, IPortUpdate } from "~/core/interfaces/IPort";

export default function usePortService() {
   const { $api } = useNuxtApp();

   const getPort = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/master-data/port?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get port failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getPortDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/port/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get port detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addPort = async (body: IPortAdd) => {
      try {
         const response = await $api.post("/admin/master-data/port", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add port failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updatePort = async (id: number, body: IPortUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/port/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update port failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return { getPort, getPortDetail, addPort, updatePort };
}
