import { defineStore } from "pinia";

export const useSettingStore = defineStore("settingStore", {
   state: () => ({
      settingTabName: "",
   }),
   actions: {
      setSettingTabName(tabName: string) {
         this.settingTabName = tabName;
      },
   },
});
