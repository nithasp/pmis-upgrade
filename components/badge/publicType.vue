<template>
   <div :class="[publicType ? 'bg-purple-50' : 'bg-blue-50', 'px-2 rounded-2xl flex items-center h-[22px] w-max']">
      <div :class="[publicType ? 'bg-purple-500' : 'bg-blue-500', 'w-2 h-2 rounded-full me-[6px]']"></div>
      <label :class="[publicType ? 'text-purple-700' : 'text-blue-700', 'text-xs']">{{ publicType ? $t("limited_time") : $t("all_time") }}</label>
   </div>
</template>
<script setup>
defineProps({
   publicType: Number,
});
</script>
