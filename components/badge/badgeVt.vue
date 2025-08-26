<template>
    <UBadge :class="[
        type === 'Pending' ? '!bg-[#C8D5FF]' :
            type === 'Arrival' ? '!bg-[#86CBAF]' :
                (type === 'Departure' || type === 'Anchor') ? '!bg-[#F7A29B]' :
                    type === 'Aweight' ? '!bg-[#FBF1CA]' :
                    '!bg-[#D0D5DD]',
        'rounded-full',
        'text-[#1C1C1C]'
    ]" :label="label || '-'" :ui="{
    rounded: '!text-black',
    font: 'font-anuphan-semi-bold',
}" />

</template>
<script setup>
defineProps({
    type: String,
    label: String,
});
</script>