<template>
    <UBadge :class="[
        type === 'RequestEdit' ? '!bg-[#F3B698]' :
            type === 'PendingEdit' ? '!bg-[#F7A29B]' :
                type === 'Send' ? '!bg-[#86CBAF]' :
                    type === 'PendingSend' ? '!bg-[#D0D5DD]' :
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
