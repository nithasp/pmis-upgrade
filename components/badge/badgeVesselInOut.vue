<template>
    <UBadge :class="[
        type === VesselInOutStatusEnum.Approved ? '!bg-[#86CBAF]' :
        type === VesselInOutStatusEnum.PendingApproval ? '!bg-[#F7A29B]' :
        type === VesselInOutStatusEnum.RequestEdit ? '!bg-[#F3B698]' :
        type === VesselInOutStatusEnum.PendingEdit ? '!bg-[#F7A29B]' :
        type === VesselInOutStatusEnum.PendingCheck ? '!bg-[#FBF1CA]' :
                    '!bg-[#D0D5DD]',
        'rounded-full',
        'text-[#1C1C1C]'
    ]" :label="label || '-'" :ui="{
    rounded: '!text-black',
    font: 'font-anuphan-semi-bold',
}" />
</template>
<script setup>
import { VesselInOutStatusEnum } from "~/utils/enums/VesselInOutStatusEnum";
defineProps({
    type: String,
    label: String,
});
</script>
