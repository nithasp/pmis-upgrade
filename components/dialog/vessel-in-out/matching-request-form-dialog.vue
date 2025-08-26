<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[806px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="ShipVariant" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">รายการเรือรอนำเข้า</div>
                    <p class="text-gray-500 text-sm">กรุณาเลือกคำร้องที่เกี่ยวข้อง</p>
                </div>
                <div class="mt-5">
                    <UTable :columns="columns" :rows="vtmsLogBookList" :ui="{
                        wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                        thead: 'bg-primary-50',
                        tbody: 'border-none',
                    }">
                        <template #actions-data="{ row, index }">
                            <URadio :value="index" :model-value="selectedItem"
                                @change="() => handleChangeSelectedItem(index, row)" />
                        </template>
                        <template #vesselName-data="{ row }">
                            <div class="flex items-center">
                                <UAvatar v-if="row.vessel_flag" size="xs" :src="row.vessel_flag" alt="Avatar" />
                                <div class="ml-3">
                                    <div class="text-black font-semibold">{{ row.vessel_name }}</div>
                                    <div class="text-grayy-75">{{ row.vessel_imo_number }}/{{ row.vessel_official_number
                                        }}</div>
                                </div>
                            </div>
                        </template>
                        <template #gross_tonnage-data="{ row }">
                            <div class="text-grayy-75">{{ formatNumber(row.gross_tonnage, 3) }}</div>
                        </template>
                        <template #berth_name-data="{ row }">
                            <div class="text-black font-semibold">{{ row.berth_name }}</div>
                            <div class="text-grayy-75">{{ row.jetty_name }}</div>
                        </template>
                        <template #mooring_date-data="{ row }">
                            <div class="text-black font-semibold">{{ row.mooring_date &&
                                renderDateFormat(row.mooring_date) }}</div>
                            <div class="text-grayy-75">{{ row.mooring_date && renderTimeFormat(row.mooring_date) }}
                            </div>
                        </template>
                        <template #departure_date-data="{ row }">
                            <div class="text-black font-semibold">{{ row.departure_date &&
                                renderDateFormat(row.departure_date) }}</div>
                            <div class="text-grayy-75">{{ row.departure_date && renderTimeFormat(row.departure_date) }}
                            </div>
                        </template>
                    </UTable>
                </div>
                <div class="mt-8 grid grid-cols-2 gap-3">
                    <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
                        class="rounded-lg w-full  border border-gray-100 outline-none" @click="dialogCancel" />
                    <UButton size="lg" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full"
                        type="submit" @click="onSubmit" />
                </div>
            </div>
        </UForm>
    </UModal>
</template>
<script setup lang="ts">
import { z } from "zod";
import ShipVariant from "~/assets/icons/dialog/ship-variant.png";
import type { IFilterLogbook } from "~/core/interfaces/IFilterLogbook";
import useVtmsTableService from "~/core/services/vtms/logBookService";
import type { IVtmsLogBookGet } from "~/core/interfaces/IVtmsLogBook";
import useVesselImportService from "~/core/services/vesselImport";

const { t } = useI18n();
const vtmsTableService = useVtmsTableService()
const vesselImportService = useVesselImportService();
const filter = ref<IFilterLogbook>({
    log_type: 'vessel-in',
    berth_id: 0,
    mooring_date: '',
    departure_date: '',
    page: 1,
    limit: 100,
    search: '',
    vesselId: 0
})
const vtmsLogBookList = ref<IVtmsLogBookGet[]>([])
const selectedItem = ref()
const paginationData = ref({
    totalItems: 0,
    totalPages: 0
})

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
    confirmMatchingRequestForm: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
    vesselId: {
        type: Number,
        required: true,
    },
});

const vesselImportId = computed(() => props.vesselImportId)
const vesselId = computed(() => props.vesselId)
const logBookId = ref()

const createSchema = () => {
    return z.object({
        jettyId: z.number().min(1, { message: t('please_enter_a_value') }),
    })
}

const formSchema = ref(createSchema())

const formGroup = reactive<any>({
    jettyId: 0,
})

const columns = [
    {
        key: 'actions',
        sortable: false
    },
    {
        key: 'document_number',
        label: t('เลขที่คำร้อง'),
    },
    {
        key: 'vesselName',
        label: 'ชื่อเรือ/IMO/Official No.',
    },
    {
        key: 'gross_tonnage',
        label: t('GRT'),
    },
    {
        key: 'berth_name',
        label: 'ท่าเรือ/วัตถุประสงค์',
    },
    {
        key: 'mooring_date',
        label: 'วันที่เรือเข้า VT',
    },
    {
        key: 'departure_date',
        label: t('วันที่เรือออก VT'),
    },
]

onMounted(() => {
    getLogBookList(filter.value)
})

const getLogBookList = async (filter: IFilterLogbook = {
    log_type: 'vessel-in',
    berth_id: 0,
    mooring_date: '',
    departure_date: '',
    page: 1,
    limit: 10,
    search: '',
    vesselId: 0
}) => {
    const resp = await vtmsTableService.getVtmsLogBook(filter)
    if (resp.statusCode === 200) {
        vtmsLogBookList.value = resp.data.data.map((e: any) => ({
            ...e,
            isSelected: false
        }))
        paginationData.value.totalItems = resp.data.totalItems
        paginationData.value.totalPages = resp.data.totalPages
    }
}

const handleChangeSelectedItem = (index: number, row: IVtmsLogBookGet) => {
    selectedItem.value = index
    logBookId.value = row.id
}


async function onSubmit() {
    const resp = await vesselImportService.mapVesselImportVSTV(vesselImportId.value, logBookId.value)
    if (resp.statusCode === 200) {
        props.confirmMatchingRequestForm(true, resp)
    } else {
        props.confirmMatchingRequestForm(false, resp)
    }
}

watch(() => props.isDialogOpen, (newValue) => {
    if (newValue) {
        getLogBookList({ ...filter.value, vesselId: vesselId.value })
    }
})

</script>
