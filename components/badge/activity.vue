<template>
   <div
      :class="[
         action == 'add' ? 'bg-blue-50' : '',
         action == 'edit' ? 'bg-warning-50' : '',
         action == 'delete' ? 'bg-pink-50' : '',
         'px-2 rounded-2xl flex items-center h-[22px] w-max',
      ]"
   >
      <div
         :class="[
            action == 'add' ? 'bg-blue-500' : '',
            action == 'edit' ? 'bg-warning-500' : '',
            action == 'delete' ? 'bg-pink-500' : '',
            'w-2 h-2 rounded-full me-[6px]',
         ]"
      ></div>
      <label :class="[action == 'add' ? 'text-blue-700' : '', action == 'edit' ? 'text-warning-700' : '', action == 'delete' ? 'text-pink-700' : '', 'text-xs']">{{
         action == "add" ? $t("add") : action == "edit" ? $t("edit") : $t("delete")
      }}</label>
   </div>
</template>
<script setup>
defineProps({
   action: String,
});
</script>
