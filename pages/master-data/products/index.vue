<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-black">{{ $t("products_topic") }}</h1>
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
         <Product v-if="currentTab === 'product'" />
      </div>
      <div class="setting-content">
         <ProductType v-if="currentTab === 'product-type'" />
      </div>
      <div class="setting-content">
         <CargoType v-if="currentTab === 'cargo-type'" />
      </div>
      <div class="setting-content">
         <CargoWharfage v-if="currentTab === 'cargo-wharfage'" />
      </div>
   </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
import Product from "./product.vue";
import ProductType from "./product-type.vue";
import CargoType from "./cargo-type.vue";
import CargoWharfage from "./cargo-wharfage.vue";

const tabName = [
   {
      name: t("products_tab"),
      key: "product",
   },
   {
      name: t("products_group_tab"),
      key: "product-type",
   },
   {
      name: t("products_cargo_type_tab"),
      key: "cargo-type",
   },
   {
      name: t("products_cargo_wharfage_tab"),
      key: "cargo-wharfage",
   },
];
const currentTab = ref("");

onMounted(() => {
   currentTab.value = tabName[0].key;
});
</script>
