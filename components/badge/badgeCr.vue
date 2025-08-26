<template>
   <UBadge
      :class="[
         type === 'Approved' || type === 'Berth' || type === 'Arrival'
            ? '!bg-[#86CBAF]'
            : type === 'PendingApproval' ||
              type === 'PendingConfirmation' ||
              type === 'PendingConfirmation1' ||
              type === 'PendingConfirmation2' ||
              type === 'PendingReview' ||
              type === 'PendingBerth' ||
            type === 'Aweigh' ||
            type === 'Aweight'
            ? '!bg-[#FBF1CA]'
            : type === 'PendingEdit' || type === 'Canceled' || type === 'AdminCanceled' || type === 'Cancel' || type === 'Departure' || type === 'Anchor'
            ? '!bg-[#F7A29B]'
            : '!bg-[#D0D5DD]',
         'rounded-full',
         'text-[#1C1C1C]',
      ]"
      :label="label || '-'"
      :ui="{
         rounded: '!text-black',
         font: 'font-anuphan-semi-bold',
      }"
   />
</template>
<script setup>
defineProps({
   type: String,
   label: String,
});
</script>
