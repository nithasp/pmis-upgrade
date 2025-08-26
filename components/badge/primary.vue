<template>
   <div class="px-2 py-[2px] rounded-2xl bg-primary-50 flex items-center">
      <label class="text-xs text-primary-500 w-max">{{ label }}</label>
   </div>
</template>
<script setup>
defineProps({
   label: String,
   dot: Boolean,
});
</script>
