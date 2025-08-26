<template>
   <div class="bg-red-100 py-2 px-4 flex justify-between items-center rounded-md">
      <p class="text-sm text-red-600">{{ message }}</p>
      <div class="py-1 flex" @click="action">
         <UIcon name="i-heroicons-x-mark" class="text-red-600 w-5 h-5 cursor-pointer" />
      </div>
   </div>
</template>
<script setup>
defineProps({
   action: Function,
   message: String,
});
</script>
