<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black mb-6 mt-1">{{ $t("port_management_title") }}</h1>
   <div id="port" class="rounded-[0px_0px_20px_20px]">
      <div id="tab-name" class="flex gap-4">
         <div v-for="menu in tabName" :key="`tab-${menu.nameEn}`" class="relative" @click="() => (currentTab = menu.key)">
            <span :class="[currentTab === menu.key ? 'text-primaryy-500' : '', 'font-anuphan-semi-bold text-sm text-grayy-75 cursor-pointer']">{{
               locale === "th" ? menu.nameTh : menu.nameEn
            }}</span>
            <div v-if="currentTab === menu.key" class="absolute -translate-x-2/4 bottom-[-18px] left-2/4 w-[105%] h-[2px] bg-primaryy-500"></div>
         </div>
      </div>
      <div class="h-[1px] w-full bg-[#E4E7EC] mt-4"></div>
      <div class="setting-content">
         <Berth v-if="currentTab === 'berth'" />
         <Purpose v-if="currentTab === 'purpose'" />
         <Port v-if="currentTab === 'port'" />
         <Locate v-if="currentTab === 'locate'" />
         <UseBerth v-if="currentTab === 'use-berth'" />
      </div>
   </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
import Berth from "./berth.vue";
import Purpose from "./purpose.vue";
import Port from "./port.vue";
import Locate from "./locate.vue";
import UseBerth from "./use-berth.vue";

const tabName = [
   {
      nameTh: "ท่าเทียบเรือ",
      nameEn: "Berth",
      key: "berth",
   },
   {
      nameTh: "วัตถุประสงค์",
      nameEn: "Purpose",
      key: "purpose",
   },
   {
      nameTh: "ท่าเรือ",
      nameEn: "Port",
      key: "port",
   },
   // {
   //    nameTh: "ตำแหน่งเทียบท่า",
   //    nameEn: "Locate",
   //    key: "locate",
   // },
   // {
   //    nameTh: "การใช้ท่าสินค้า",
   //    nameEn: "Use Berth",
   //    key: "use-berth",
   // },
];
const currentTab = ref("");

onMounted(() => {
   currentTab.value = tabName[0].key;
});

</script>
