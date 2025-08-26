<template>
  <UBadge
    v-if="badgeStyles[type]" 
    :class="badgeStyles[type].class"
    :label="label"
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

const badgeStyles = computed(() => ({
  success: { class: 'rounded-full bg-[#C3E5D7] text-[#0E9860]' },
  warning: { class: 'rounded-full bg-[#F9DBCB] text-[#E76E31]' },
  error: { class: 'rounded-full bg-[#FBD0CD] text-[#F04438]' },
  cancel: { class: 'rounded-full bg-[#D0D5DD] text-[#344054]' },
  primary: { class: 'rounded-full' },
  orange: { class: 'rounded-full bg-[#F9DBCB] text-[#E76E31]' },
  red: { class: 'rounded-full bg-[#FBD0CD] text-[#F04438]' },
  blue: { class: 'rounded-full bg-[#C9D1FF] text-[#561EF3]' },
  purple: { class: 'rounded-full bg-[#E3D4F6] text-[#704A9E]' },
  green: { class: 'rounded-full bg-[#C3E5D7] text-[#0E9860]' },
  'white-gray': { class: 'rounded-full bg-[#F2F4F7] text-[#344054]' },
  gray: { class: 'rounded-full bg-[#D0D5DD] text-[#344054]' },
  none: { class: 'rounded-full bg-transparent text-[#344054]' }
}));

</script>
