<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black py-4">{{ $t("settings_title") }}</h1>
   <div id="settings" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
      <div id="tab-name" class="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
         <div v-for="menu in tabName" :key="`tab-${menu.nameEn}`" class="relative" @click="() => (settingStore.settingTabName = menu.key)">
            <span :class="[currentTab === menu.key ? 'text-primaryy-500' : '', 'font-anuphan-semi-bold text-sm text-grayy-75 cursor-pointer']">{{
               locale === "th" ? menu.nameTh : menu.nameEn
            }}</span>
            <div v-if="currentTab === menu.key" class="absolute -translate-x-1/2 bottom-[-4px] left-1/2 w-full h-[2px] bg-primaryy-500 md:w-[110%] lg:w-[115%] line-submenu"></div>
         </div>
      </div>
      <div class="h-[1px] w-full bg-[#E4E7EC] mt-4"></div>
      <div class="setting-content">
         <General v-if="currentTab === 'general'" />
         <ShipAgentInformation v-if="currentTab === 'ship-agent-information'" />
         <InvoiceAddress v-if="currentTab === 'invoice-address'" />
         <OfficerInformation v-if="currentTab === 'officer-information'" />
         <ShipAgentAddress v-if="currentTab === 'ship-agent-address'" />
      </div>
   </div>
</template>
<script setup lang="ts">
const { locale } = useI18n();
import General from "./general.vue";
import OfficerInformation from "./officer-information.vue";
import ShipAgentInformation from "./ship-agent-information.vue";
import InvoiceAddress from "./invoice-address.vue";
import ShipAgentAddress from "./ship-agent-address/index.vue";
import { useSettingStore } from "~/stores/settingStore";
import type { ITabName } from "~/core/interfaces/ITabName";

const authStore = useAuthStore();
const settingStore = useSettingStore();
const isAgency = authStore.profileUser.type === "Agency";
const currentTab = ref<string>("");
const tabName = ref<ITabName[]>([]);
const renderTabName = () => {
   if (isAgency) {
      tabName.value = [
         {
            nameTh: "ทั่วไป",
            nameEn: "General",
            key: "general",
         },
         {
            nameTh: "ข้อมูลตัวแทนเรือ",
            nameEn: "Ship Agent Information",
            key: "ship-agent-information",
         },
         {
            nameTh: "ที่อยู่ออกใบแจ้งหนี้",
            nameEn: "Invoice Address",
            key: "invoice-address",
         },
         {
            nameTh: "ที่อยู่ตัวแทนเรือ",
            nameEn: "Ship Agent Address",
            key: "ship-agent-address",
         },
      ];
   } else {
      tabName.value = [
         {
            nameTh: "ทั่วไป",
            nameEn: "General",
            key: "general",
         },
         {
            nameTh: "ข้อมูลเจ้าหน้าที่",
            nameEn: "Officer Information",
            key: "officer-information",
         }
      ];
   }
};

onMounted(() => {
   renderTabName();
   currentTab.value = settingStore.settingTabName ? settingStore.settingTabName : tabName.value[0].key;
});

watch(
   () => settingStore.settingTabName,
   (newTabName) => {
      currentTab.value = newTabName;
   }
);
</script>

<style lang="scss" scoped>
  @media (min-width: 580px) {
    .line-submenu {
      bottom: -17px;
    }
  }
</style>