<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black py-4">{{ $t("sailing_log") }}</h1>
   <div id="settings" class="bg-white px-4 md:px-8 py-6 rounded-[0px_0px_20px_20px]">
      <div id="tab-name" class="flex gap-4">
         <div v-for="menu in tabName" :key="`tab-${menu.nameEn}`" class="relative" @click="() => (currentTab = menu.key)">
            <span :class="[currentTab === menu.key ? 'text-primaryy-500' : '', 'font-anuphan-semi-bold text-sm text-grayy-75 cursor-pointer']">{{
               locale === "th" ? menu.nameTh : menu.nameEn
            }}</span>
            <div v-if="currentTab === menu.key" class="absolute -translate-x-2/4 bottom-[-18px] left-2/4 w-[105%] h-[2px] bg-primaryy-500"></div>
         </div>
      </div>
      <div class="h-[1px] w-full bg-[#E4E7EC] mt-4"></div>
      <div class="type-tab mt-6">
         <RequestForm v-if="currentTab === 'request-form'" :documentId="documentId" />
         <AnchorDropping v-if="currentTab === 'anchor-dropping'" :documentId="documentId" />
         <Navigation v-if="currentTab === 'navigation'" :documentId="documentId" />
      </div>
   </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
import RequestForm from "~/components/vtms/sailing-log/request-form.vue";
import AnchorDropping from "~/components/vtms/sailing-log/anchor-dropping-form.vue";
import Navigation from "~/components/vtms/sailing-log/navigation/index.vue";

import { useVtmsStore } from "~/stores/vtmsStore";
import { storeToRefs } from 'pinia';
const vtmsStore = useVtmsStore();
const { vtmsTab } = storeToRefs(vtmsStore);

const route = useRoute();
const tabName = ref<any>([]);
const currentTab = ref("");

onMounted(() => {
   currentTab.value = vtmsStore.sailingLogType || "request-form";
});

watch(vtmsTab, (newValue) => {
   tabName.value = newValue
});

const documentId = computed(() => {
   const documentId = route.params.documentId;
   return Array.isArray(documentId) ? Number(documentId[0]) : documentId ? Number(documentId) : undefined;
});
</script>
