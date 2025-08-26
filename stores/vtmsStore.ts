import { defineStore } from "pinia";

export const useVtmsStore = defineStore("vtmsStore", {
   state: () => ({
      sailingLogType: "",
      vtmsDocumentStatus: "",
      vtmsTab: [] as any[],
      countType: "",
   }),
   actions: {
      setSailingLogType(type: string) {
         this.sailingLogType = type;
      },
      setVtmsDocumentStatus(status: string) {
         this.vtmsDocumentStatus = status;
      },
      getVtmsTab() {
         if (
            this.vtmsDocumentStatus === "PendingCheck" ||
            this.vtmsDocumentStatus === "PendingEdit" ||
            this.vtmsDocumentStatus === "PendingApproval" ||
            this.vtmsDocumentStatus === "PendingReview"
         ) {
            this.vtmsTab = [
               {
                  nameTh: "ใบคำร้อง",
                  nameEn: "Request Form",
                  key: "request-form",
               },
               {
                  nameTh: "การทิ้งสมอ",
                  nameEn: "Anchor Dropping",
                  key: "anchor-dropping",
               },
            ];
         } else if (this.vtmsDocumentStatus === "Approved") {
            this.vtmsTab = [
               {
                  nameTh: "ใบคำร้อง",
                  nameEn: "Request Form",
                  key: "request-form",
               },
               {
                  nameTh: "การทิ้งสมอ",
                  nameEn: "Anchor Dropping",
                  key: "anchor-dropping",
               },
               {
                  nameTh: "การเดินเรือ",
                  nameEn: "Navigation",
                  key: "navigation",
               },
            ];
         } else {
            this.vtmsTab = [
               {
                  nameTh: "ใบคำร้อง",
                  nameEn: "Request Form",
                  key: "request-form",
               },
            ];
         }
         return this.vtmsTab;
      },
      setCountType(countType: string) {
         this.countType = countType;
      },
   },
});
