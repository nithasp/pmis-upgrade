import { UserTypeEnum } from "~/utils/enums/UserTypeEnum";

export default defineNuxtRouteMiddleware((to: any) => {
   const access_token = localStorage.getItem('access_token')
   const profileJSON = localStorage.getItem('profileUser') || '{}'
   const profileUser = JSON.parse(profileJSON)
   const privatePath = [
      "index",
      "main",
      "request-form-create",
      "ship-entry-waiting",
      "ship-entry-entering-and-leaving",
      "manage-ship-list",
      "manage-ship-create",
      "manage-ship-view",
      "manage-ship-agents-list",
      "manage-ship-agents-mode",
      "manage-ship-agents-view",
      "master-data-vessel",
      "master-data-port",
      "master-data-products",
      "master-data-account",
      "request-form-list",
      "request-form-mode",
      "request-form-view",
      "vessel-awaiting-import-list",
      "vessel-awaiting-import-mode",
      "vessel-awaiting-import-view",
      "vessel-in-out-list",
      "vessel-in-out-mode",
      "vessel-in-out-view",
      "port-dues-invoice-list",
      "port-dues-save",
      "port-dues-list",
      "port-dues-view"
   ]
   const keysToFilter = [
      "index",
      "main",
      "ship-entry-waiting",
      "ship-entry-entering-and-leaving",
      "manage-ship-list",
      "manage-ship-create",
      "manage-ship-view",
      "manage-ship-agents-list",
      "manage-ship-agents-mode",
      "manage-ship-agents-view",
      "master-data-vessel",
      "master-data-port",
      "master-data-products",
      "master-data-account",
      "request-form-list",
      "request-form-mode",
      "request-form-view",
      "vessel-awaiting-import-list",
      "vessel-awaiting-import-mode",
      "vessel-awaiting-import-view",
      "vessel-in-out-list",
      "vessel-in-out-mode",
      "vessel-in-out-view",
      "port-dues-invoice-list",
      "port-dues-save",
      "port-dues-list",
      "port-dues-view"
   ];
   if (access_token && to.name == "login") {
      // return navigateTo("/");
   }
   if (access_token && Object.keys(profileUser).length !== 0 && privatePath.includes(to.name)) {
      if (profileUser.isFirstLogin) {
         return navigateTo("/first-login");
      }

      if (!profileUser.isAcceptedTerm) {
         return navigateTo("/accept-term");
      }

      if (profileUser.type === UserTypeEnum.Agency && !keysToFilter.includes(to.name)) {
         return navigateTo('/main')
      }
   }

   if (!access_token && privatePath.includes(to.name)) {
      return navigateTo("/login");
   }
});
