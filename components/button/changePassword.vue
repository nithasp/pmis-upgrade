<template>
   <UButton
      type="submit"
      color=""
      variant="solid"
      :label="$t('change_password_title')"
      size="xl"
      block
      class="font-anuphan-semi-bold text-sm text-grayy-400 rounded-lg w-full h-10 border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border-solid border-[#D0D5DD] sm:max-w-[180px]"
   >
      <template #trailing>
         <img :src="UnlockIconDialog" alt="unlock-icon-dialog" />
      </template>
   </UButton>
</template>

<script setup lang="ts">
import UnlockIconDialog from "~/assets/icons/dialog/fi-rs-unlock-dialog.svg";
</script>
