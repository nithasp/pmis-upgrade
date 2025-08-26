import { useNuxtApp } from "#app";
import type { AxiosProgressEvent } from "axios";
import type { IUpdateUser, IVerifyPassword, IResetPassword, ISendVerifyEmail, IFileUploadSetting } from "~/core/interfaces/ISetting";

export default function useSettingService() {
   const { $api } = useNuxtApp();

   const getUserDetail = async (id: number) => {
      try {
         const response = await $api.get(`/user/${id}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get vessel failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateUser = async (body: IUpdateUser) => {
      try {
         const response = await $api.post("/user/update", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update user failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const verifyPassword = async (body: IVerifyPassword) => {
      try {
         const response = await $api.post("/user/password", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("verify password failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const resetPassword = async (body: IResetPassword) => {
      try {
         const response = await $api.post("/user/password/reset", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("reset password failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const sendVerifyEmail = async (body: ISendVerifyEmail) => {
      try {
         const response = await $api.post("/user/verify/send_email", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("send verify email failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const uploadFileSetting = async (file: File, fileId: string, files: IFileUploadSetting[], controller: AbortController) => {
      const formData = new FormData();
      formData.append("file", new Blob([file]), file.name);

      try {
         const response = await $api.post("/admin/master-data/upload", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
               const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
               const fileIndex = files.findIndex((item: IFileUploadSetting) => item.mockId === fileId);
               if (fileIndex > -1) {
                  files[fileIndex].progress = percentCompleted;
               }
            },
            signal: controller.signal,
         });

         return wrapperSuccessResp(response.data);
      } catch (error) {
         if (controller.signal.aborted) {
            console.log("Upload cancelled.");
         } else {
            console.error("upload file register failed:", error);
         }
         return wrapperErrorResp(error);
      }
   };

   const getUserAddressList = async (userId: number) => {
      try {
         const response = await $api.get(`/user/address/list/${userId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get user address list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getUserAddressDetail = async (userId: number) => {
      try {
         const response = await $api.get(`/user/address/${userId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get user address detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const addAddressUser = async (userId: number, body: ISendVerifyEmail) => {
      try {
         const response = await $api.post(`/user/address/${userId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("add address user failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateAddressUser = async (userId: number, body: ISendVerifyEmail) => {
      try {
         const response = await $api.put(`/user/address/${userId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("put address user failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteAddressUser = async (addressId: number) => {
      try {
         const response = await $api.delete(`/user/address/${addressId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("delete address user failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getUserDetail,
      updateUser,
      verifyPassword,
      resetPassword,
      sendVerifyEmail,
      uploadFileSetting,
      getUserAddressList,
      getUserAddressDetail,
      addAddressUser,
      updateAddressUser,
      deleteAddressUser
   };
}
