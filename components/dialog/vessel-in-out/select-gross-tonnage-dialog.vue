<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[400px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="ShipVariant" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">ยืนยัน Gross Tonnage</div>
                    <p class="text-gray-500 text-sm">กรุณาเลือกรายการ Gross Tonnage ที่ถูกต้อง</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <USelect label="Gross Tonnage" name="grossTonnage" required :options="grossTonnageOptions"
                        v-model="formGroup.grossTonnage" />
                </div>
                <div class="mt-8 grid grid-cols-2 gap-3">
                    <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
                        class="rounded-lg w-full  border border-gray-100 outline-none" @click="dialogCancel" />
                    <UButton size="lg" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full"
                        type="submit" />
                </div>
            </div>
        </UForm>
    </UModal>
</template>
<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import USelect from "~/components/form/u-select.vue";
import ShipVariant from "~/assets/icons/dialog/ship-variant.png";
import useVesselImportService from "~/core/services/vesselImport";

const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore()
const vesselImportService = useVesselImportService();

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: {
        type: Function as PropType<(...args: any[]) => void>,
        default: () => { },
    },
    vesselImportId: {
        type: Number,
        required: true,
    },
    vesselImportMapDetail: {
        type: Object,
        required: true,
    },
    confirmApproveWithSelectedGrossTonnage: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
    deletedFiles: {
        type: Array,
        defalut: []
    }
});

onMounted(() => {
    if (props.vesselImportMapDetail) {
        getGrossOption()
    }
});

const vesselImportId = computed(() => props.vesselImportId)
const vesselImportMapDetail = computed(() => props.vesselImportMapDetail)
const deletedFiles = computed(() => props.deletedFiles)
console.log('vesselImportMapDetail', vesselImportMapDetail.value)
interface GrossTonnageOption {
    id: number;
    name: string;
}

const grossTonnageOptions = ref<GrossTonnageOption[]>([])
const createSchema = () => {
    return z.object({
        grossTonnage: z.number().min(1, { message: t('please_enter_a_value') }),
    })
}

const formSchema = ref(createSchema())

const formGroup = reactive<any>({
    grossTonnage: 0,
})

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    // const findData: any = grossTonnageOptions.value.map(e => e.id === event.data.grossTonnage)
    // if (findData) {
    //     const payload = {
    //         grossTonnage: findData.name
    //     }
    //     const resp = await vesselImportService.approveVesselImport(vesselImportId.value, payload)
    //     if (resp.statusCode === 200) {
    //         props.confirmApproveWithSelectedGrossTonnage(true, resp)
    //     } else {
    //         props.confirmApproveWithSelectedGrossTonnage(false, resp)
    //     }
    // }

    // New logic updated 2025-01-12
    const findData: any = grossTonnageOptions.value.find(e => e.id === formGroup.grossTonnage)
    if (findData) {
        const files = deletedFiles.value?.map((e: any) => ({
            id: e.id,
            is_delete: true
        }))

        const payload = {
            grossTonnage: removeCommaAndConvertToNumber(findData.value),
            files
        }
        const resp = await vesselImportService.approveVesselImport(vesselImportId.value, payload)
        if (resp.statusCode === 200) {
            props.confirmApproveWithSelectedGrossTonnage(true, resp)
        } else {
            props.confirmApproveWithSelectedGrossTonnage(false, resp)
        }
    }

}

const getGrossOption = () => {
    // const arrays = [
    //     {
    //         id: 1,
    //         name: formatNumber(vesselImportMapDetail.value.grossTonnageAgency)
    //     },
    //     {
    //         id: 2,
    //         name: formatNumber(vesselImportMapDetail.value.grossTonnageVT)
    //     },
    //     {
    //         id: 3,
    //         name: formatNumber(vesselImportMapDetail.value.grossTonnageVS)
    //     },
    // ]
    // const newArray = Array.from(
    //     new Map(arrays.map(item => [item.name, item])).values()
    // ).map((item, index) => ({
    //     ...item,
    //     id: index + 1 // Renumber IDs sequentially
    // }));
    // grossTonnageOptions.value = newArray


    // New logic updated 2025-01-12
    const arrays = [
        {
            id: 1,
            name: 'Agency - ' + getInputDecimal(vesselImportMapDetail.value.grossTonnageAgency.toString(), 3),
            value: getInputDecimal(vesselImportMapDetail.value.grossTonnageAgency.toString(), 3)
        },
        {
            id: 2,
            name: 'VT - ' + getInputDecimal(vesselImportMapDetail.value.grossTonnageVT.toString(), 3),
            value: getInputDecimal(vesselImportMapDetail.value.grossTonnageVT.toString(), 3)
        },
        {
            id: 3,
            name: 'VS - ' + getInputDecimal(vesselImportMapDetail.value.grossTonnageVS.toString(), 3),
            value: getInputDecimal(vesselImportMapDetail.value.grossTonnageVS.toString(), 3)
        },
    ]
    grossTonnageOptions.value = arrays.filter(item => parseFloat(item.value) !== 0);
}

watch(
    () => props.isDialogOpen,
    () => {
        if (props.vesselImportMapDetail) {
            getGrossOption()
        }
    }
)

watch(
    () => props.vesselImportMapDetail,
    () => {
        if (props.vesselImportMapDetail) {
            getGrossOption()
        }
    }
)

</script>
