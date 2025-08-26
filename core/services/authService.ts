// services/auth.ts

import { useNuxtApp } from '#app'
import type { ILogin } from '../interfaces/ILogin'
import type { IRegisterRequest } from '../interfaces/IRegisterRequest';
import type { IForgotPassword } from '../interfaces/IForgotPassword';
import type { ISendEmailRequest } from '../interfaces/ISendEmailRequest';
import type { IVerifyEmailRequest } from '../interfaces/IVerifyEmailRequest';
import type { IVerifyForgetPassword } from '../interfaces/IVerifyForgetPassword';

export default function useAuthService() {
   const { $api } = useNuxtApp()

   const login = async (body: ILogin) => {
      const { email, password } = body;
      try {
         const response = await $api.post('/auth/login', { email, password })
         // Save the token or user data in a store or localStorage
         // For example: localStorage.setItem('token', response.data.token)
         return wrapperSuccessResp(response.data)
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error('Login failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const logout = async () => {
      try {
         await $api.post('/auth/logout')
         // Remove token or user data from store or localStorage
         // For example: localStorage.removeItem('token')
      } catch (error) {
         // Handle error (e.g., show a notification or throw an error)
         console.error('Logout failed:', error)
         throw error
      }
   }

   const sendEmail = async (body: ISendEmailRequest) => {
      const { email } = body
      try {
         const response = await $api.post('/verify/send_email', { email })
         return wrapperSuccessResp(response.data)
      } catch (error: any) {
         console.error('send email failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const verifyEmail = async (body: IVerifyEmailRequest) => {
      const { token } = body
      try {
         const response = await $api.post('/verify/email', { token })
         return wrapperSuccessResp(response.data)
      } catch (error) {
         console.error('verfiy email failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const registerUser = async (body: IRegisterRequest) => {
      try {
         const response = await $api.post('/user/register', { ...body })
         return wrapperSuccessResp(response.data)
      } catch (error) {
         console.error('register user failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const sendEmailForgetPassword = async (body: ISendEmailRequest) => {
      const { email } = body
      try {
         const response = await $api.post('/auth/password/forgot', { email })
         return wrapperSuccessResp(response.data)
      } catch (error: any) {
         console.error('send email forget password failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const verifyTokenForgetPassword = async (body: IVerifyForgetPassword) => {
      const { password_reset_token } = body
      try {
         const response = await $api.post('/auth/password/verify-token', { password_reset_token })
         return wrapperSuccessResp(response.data)
      } catch (error: any) {
         console.error('verify token forget password failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const resetPassword = async (body: IForgotPassword) => {
      const { password_reset_token, new_password } = body
      try {
         const response = await $api.post('/auth/password/reset', { password_reset_token, new_password })
         return wrapperSuccessResp(response.data)
      } catch (error: any) {
         console.error('reset passowrd failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const getUserData = async () => {
      try {
         const response = await $api.get('/auth/user')
         return wrapperSuccessResp(response.data)
      } catch (error: any) {
         console.error('get user data failed:', error)
         return wrapperErrorResp(error)
      }
   }

   const acceptForTermAndCondition = async () => {
      try {
         const response = await $api.post('/user/term')
         return wrapperSuccessResp(response.data)
      } catch (error: any) {
         console.error('accept for term and condition failed:', error)
         return wrapperErrorResp(error)
      }
   }

   return {
      login,
      logout,
      sendEmail,
      verifyEmail,
      registerUser,
      sendEmailForgetPassword,
      verifyTokenForgetPassword,
      resetPassword,
      getUserData,
      acceptForTermAndCondition
   }
}
