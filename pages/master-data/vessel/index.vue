<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black">{{ $t("vessel_topic") }}</h1>
   <div id="settings" class="py-6">
      <div id="tab-name" class="flex gap-4">
         <div
            v-for="(menu, indexMenu) in tabName"
            :key="`tab-${menu.name}`"
            class="relative font-anuphan-semi-bold text-sm color-[#704A9E] cursor-pointer"
            @click="() => (currentTab = menu.key)"
         >
            <span>{{ menu.name }}</span>
            <div v-if="currentTab === menu.key" class="absolute -translate-x-2/4 bottom-[-18px] left-2/4 w-[105%] h-[2px] bg-[#704A9E]"></div>
         </div>
      </div>
      <div class="h-[1px] w-full bg-[#E4E7EC] my-4"></div>
      <div class="setting-content">
         <Type v-if="currentTab === 'type'" />
         <Flag v-if="currentTab === 'flag'" />
      </div>
   </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import Type from "./type.vue";
import Flag from "./flag.vue";

const tabName = [
   {
      name: t('vessel_type_tab'),
      key: "type",
   },
   {
      name: t('vessel_flag_tab'),
      key: "flag",
   },
];
const currentTab = ref("");

onMounted(() => {
   currentTab.value = tabName[0].key;
});
</script>
