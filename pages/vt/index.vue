<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black">จัดการข้อมูลท่าเรือ</h1>
   <div class="grid grid-cols-4 gap-4">
      <UCard class="" v-for="(item, i) in totalCard" :key="i">
         <template #header>
            <div class="flex justify-between">
               <NuxtIcon class="" :name="item.icon" size="xl" />
            </div>
         </template>
         <div class="flex justify-between align-">
            <div class="text-end text-xs my-auto">{{ item.name }}</div>
            <div class="text-end text-2xl">{{ item.count }}</div>
         </div>
      </UCard>
   </div>
   <div id="settings" class="py-6">
      <div id="tab-name" class="flex gap-4">
         <div v-for="menu in tabName" :key="`tab-${menu.name}`" class="relative" @click="() => (currentTab = menu.key)">
            <span :class="[currentTab === menu.key ? 'text-primaryy-500' : '', 'font-anuphan-semi-bold text-sm text-grayy-75 cursor-pointer']">{{ menu.name }}</span>
            <div v-if="currentTab === menu.key" class="absolute -translate-x-2/4 bottom-[-18px] left-2/4 w-[105%] h-[2px] bg-primaryy-500"></div>
         </div>
      </div>
      <div class="h-[1px] w-full bg-[#E4E7EC] my-4"></div>
      <div class="setting-content">
         <Request v-if="currentTab === 'request'" />
         <DockShip v-if="currentTab === 'dock-ship'" />
         <AnchorShip v-if="currentTab === 'anchor-ship'" />
         <LogBook v-if="currentTab === 'log-book'" />
      </div>
   </div>
</template>

<script setup lang="ts">
import Request from "./request.vue";
import DockShip from "./dock-ship.vue";
import AnchorShip from "./anchor-ship.vue";
import LogBook from "./log-book.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import vtService from "~/core/services/vtms/tableService.ts";

import { useI18n } from "vue-i18n";
const { getVtConclusion } = vtService();
const { t } = useI18n();

const tabName = [
   {
      name: "รายการคำร้อง",
      key: "request",
   },
   {
      name: "เรือเทียบท่า",
      key: "dock-ship",
   },
   {
      name: "เรือทิ้งสมอ",
      key: "anchor-ship",
   },
   {
      name: "Log Book",
      key: "log-book",
   },
];
const currentTab = ref("");

const totalCard = ref([
   {
      name: t("vtms_total_card_arrivals"),
      count: 100,
      icon: "sign-in",
   },
   {
      name: t("vtms_total_card_departure"),
      count: 50,
      icon: "sign-out",
   },
   {
      name: t("vtms_total_card_dock_ship"),
      count: 20,
      icon: "ship-side",
   },
   {
      name: t("vtms_total_card_anchor_ship"),
      count: 10,
      icon: "marker",
   },
]);

onMounted(() => {
   currentTab.value = tabName[0].key;
   getVtTotal();
});
const getVtTotal = async () => {
   console.log("getVtTotal");
   try {
      const resp = await getVtConclusion();
      if (resp.statusCode === 200) {
         const { vessel_in, vessel_out, vessel_dock, anchor } = resp.data;
         totalCard.value = [
            {
               name: t("vtms_total_card_arrivals"),
               count: vessel_in,
               icon: "sign-in",
            },
            {
               name: t("vtms_total_card_departure"),
               count: vessel_out,
               icon: "sign-out",
            },
            {
               name: t("vtms_total_card_dock_ship"),
               count: vessel_dock,
               icon: "ship-side",
            },
            {
               name: t("vtms_total_card_anchor_ship"),
               count: anchor,
               icon: "marker",
            },
         ];
      }
   } catch (error) {
      console.error(error);
   } finally {
   }
};
</script>
