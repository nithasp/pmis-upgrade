<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        width: 'w-[800px]',
        rounded: 'rounded-xl',
        margin: 'p-6',
    }" :initialFocus="removeAutoFocus">
        <div id="vessel-import-error">
            <img :src="WarningIcon" alt="warning-icon" class="w-12 h-12" />
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-2 mt-5">{{ $t("import_list") }}</div>
            <div v-for="(item, indexMenu) in props.itemData" :key="indexMenu">
                <span class="text-error-500">ข้อมูลแถวที่ {{ item.rowNo }} </span>
                <span class="text-error-500 mx-1">{{ item.vesselName }}</span>
                <span class="text-grayy-75">{{ item.note }}</span>
            </div>
            <div class="text-grayy-75 my-5">{{ $t("check_vessel_and_contact") }}</div>
            <div class="mt-5">
                <UButton size="lg" color="white" variant="solid" :label="$t('close')" block
                    class="rounded-lg w-full border border-gray-100 outline-none" @click="() => dialogCancel!(false)"
                    ref="removeAutoFocus" />
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import WarningIcon from "~/assets/icons/dialog/warning.png";
import type { IVesselImportError } from "~/core/interfaces/IVesselImport";

const props = defineProps({
    isDialogOpen: Boolean,
    mode: String,
    title: String,
    desc: String,
    icon: String,
    labelCancel: String,
    labelConfirm: String,
    dialogCancel: Function,
    dialogConfirm: Function,
    itemData: {
        type: Array as PropType<IVesselImportError[]>
    },
});

const removeAutoFocus = ref<Boolean>(false);
</script>