<template>
   <UButton
      color="primary"
      variant="solid"
      :label="$t('save')"
      block
      :class="[width ? `${width}` : 'w-[63px]', height ? `${height}` : 'h-9', '']"
   ></UButton>
</template>
<script setup>
defineProps({
   width: String,
   height: String,
});
</script>
