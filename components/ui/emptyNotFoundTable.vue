<template>
  <div class="flex flex-col my-10 items-center justify-center">
    <img :src="SearchAlert" />
    <h2 class="my-3 text-md font-bold">{{ $t('no_item_found') }}</h2>
    <p class="text-sm text-grayy-600">{{ $t('no_item_found_desc_1') }}</p>
    <p class="text-sm text-grayy-600">{{ $t('no_item_found_desc_2') }}</p>
  </div>
</template>

<script setup>
import SearchAlert from "~/assets/icons/search-alert.svg";
</script>
