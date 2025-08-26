<template>
   <div :class="[status ? 'bg-success-50' : 'bg-error-100', 'px-2 rounded-2xl flex items-center h-[26px] w-max']">
      <div :class="[status ? 'bg-success-500' : 'bg-error-500', 'w-2 h-2 rounded-full me-[6px]']"></div>
      <label :class="[status ? 'text-success-700' : 'text-error-700', 'text-sm']">{{ status ? "ใช้งาน" : "ไม่ใช้งาน" }}</label>
   </div>
</template>
<script setup>
defineProps({
   status: Boolean,
});
</script>
