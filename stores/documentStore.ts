import { defineStore } from "pinia";

export const useDocumentStore = defineStore("document", {
   state: () => ({
      requestFormQueryType: "",
      vesselInOutQueryType: "",
      manageShipAgentsQueryType: "",
      manageShipQueryType: "",
      refreshTrigger: false,
   }),
   actions: {
      setRequestFormQueryType(type: string) {
         this.requestFormQueryType = type;
      },
      setVesselInOutQueryType(type: string) {
         this.vesselInOutQueryType = type;
      },
      setManageShipAgentsQueryType(type: string) {
         this.manageShipAgentsQueryType = type;
      },
      setManageShipQueryType(type: string) {
         this.manageShipQueryType = type;
      },
      triggerRefresh() {
         this.refreshTrigger = !this.refreshTrigger;
      },
   },
});
