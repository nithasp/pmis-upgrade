import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";

export default function useSurveyService() {
   const { $api } = useNuxtApp();

   const getSurveyList = async (filter = {}) => {
      try {
         const filterParams = convertObjToQueryString(filter);
         const response: AxiosResponse = await $api.get(`/admin/survey/list?${filterParams}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get survey list failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getSurveyDetail = async (surveyId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/survey/${surveyId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get survey detail failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getSurveyResult = async (surveyId: number) => {
      try {
         const response: AxiosResponse = await $api.get(`/admin/survey/${surveyId}/result`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get survey result failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const getUserCheckTokenSurvey = async (token: string) => {
      try {
         const response: AxiosResponse = await $api.get(`/survey/${token}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("get user check token survey failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const createSurvey = async (body: any) => {
      try {
         const response = await $api.post("/admin/survey", { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("create survey failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const updateSurvey = async (surveyId: number, body: any) => {
      try {
         const response = await $api.put(`/admin/survey/${surveyId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("update survey failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const deleteSurvey = async (surveyId: number) => {
      try {
         const response: AxiosResponse = await $api.delete(`/admin/survey/${surveyId}`);
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("delete survey failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const sendEmailSurvey = async (surveyId: number, body: any) => {
      try {
         const response = await $api.post(`/admin/survey/send/${surveyId}`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("send email survey failed:", error);
         return wrapperErrorResp(error);
      }
   };

   const userSubmitSurvey = async (body: any) => {
      try {
         const response = await $api.post(`/survey`, { ...body });
         return wrapperSuccessResp(response.data);
      } catch (error) {
         console.error("send user submit survey failed:", error);
         return wrapperErrorResp(error);
      }
   };

   return {
      getSurveyList,
      getSurveyDetail,
      getSurveyResult,
      getUserCheckTokenSurvey,
      createSurvey,
      updateSurvey,
      deleteSurvey,
      sendEmailSurvey,
      userSubmitSurvey
   };
}
