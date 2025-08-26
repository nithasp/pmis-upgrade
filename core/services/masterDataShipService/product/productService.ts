import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";
import type { IProductAdd, IProductUpdate, IProductTypeAdd, IProductTypeUpdate } from "~/core/interfaces/IProduct";

export default function useProductService() {
   const { $api } = useNuxtApp();

   const getProduct = async (filter = "") => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/master-data/product?${filter}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getProductDetailById = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/product/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addProduct = async (body: IProductAdd) => {
      try {
         const response = await $api.post("/admin/master-data/product", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add Product failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateProduct = async (id: number, body: IProductUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/product/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update Product failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getProductGroup = async () => {
      try {
         const response = await $api.get(`/admin/master-data/product-group/list`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const addProductType = async (body: IProductTypeAdd) => {
      try {
         console.log("Adding Product", body);
         const response = await $api.post(`/admin/master-data/product-type`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const updateProductType = async (id: number, body: IProductTypeUpdate) => {
      try {
         const response = await $api.put(`/admin/master-data/product-type/${id}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getProductType = async (filter = "") => {
      try {
         const response = await $api.get(`/admin/master-data/product-type?${filter}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };
   const getProductTypeByProductTypeId = async (id: number) => {
    try {
       const response = await $api.get(`/admin/master-data/product-type/type/${id}`);
       return wrapperSuccessResp(response.data);
    } catch (error) {
       console.error("get Product detail failed:", error);
       return wrapperErrorResp(error);
    }
 };
   const getProductTypeDetail = async (id: number) => {
      try {
         const response = await $api.get(`/admin/master-data/product-type/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get Product detail failed:", error);
         return wrapperErrorResp(error);
      }
   };
   return { getProduct, getProductDetailById, addProduct, updateProduct, getProductGroup, getProductType, addProductType, updateProductType, getProductTypeDetail ,getProductTypeByProductTypeId};
}
