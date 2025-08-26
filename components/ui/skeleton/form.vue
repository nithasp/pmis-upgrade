<template>
   <div class="grid gap-4">
      <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-4 gap-y-2" v-for="loop in count" :key="`skeleton-form-${loop}`">
         <USkeleton class="h-4 w-[150px] tablet:ml-auto" />
         <USkeleton class="h-[38px] w-full tablet:w-[300px]" />
      </div>
   </div>
</template>

<script setup>
defineProps({
   count: Number,
});
</script>
