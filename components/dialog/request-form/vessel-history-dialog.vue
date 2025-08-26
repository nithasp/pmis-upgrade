<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center !p-4',
        rounded: 'rounded-xl !max-w-[1400px]',
    }">
        <div class="p-6">
            <div class="flex justify-between items-center mb-8">
                <h1 class="font-bold text-[30px]">{{ $t('ประวัติเรือ') }}</h1>
                <div>
                    <UButton @click="dialogCancel" class="border border-grayy-100" size="md" color="gray"
                        :label="$t('close')" />
                </div>
            </div>
            <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
                <div class="flex justify-between gap-4">
                    <div class=" max-w-[314px] w-full">
                        <UFormGroup :label="$t('วันที่อัพเดทข้อมูล')">
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                                    :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                                    :placeholder="$t('search_title_placeholder')" :ui="{
                                        wrapper: 'w-full rounded-md bg-white',
                                    }" />

                                <template #panel="{ close }">
                                    <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                                        <DatePicker v-model="selectedDate" @close="close"
                                            v-on:date-change="onSelectedDateChange" />
                                    </div>
                                </template>
                            </UPopover>
                        </UFormGroup>
                    </div>
                    <div class=" flex items-end justify-end">
                        <div class="ml-2 mb-0.5">
                            <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
                        </div>
                    </div>

                </div>
            </div>
            <div id="request-form-content" class="bg-white rounded-[20px]">
                <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
                    <div class="flex justify-between">
                        <h1 class="font-normal text-lg text-white">รายการยื่นคำร้องทั้งหมด</h1>
                        <div v-if="(search || vesselType)" class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{
                            vesselList.length }} รายการ</div>
                    </div>
                </div>
                <UTable :columns="columns" :rows="vesselList" :ui="{
                    base: 'u-table-list',
                }">

                    <template #id-data="{ index }">
                        {{ getNumCountPagination(index, filter.page, filter.limit) }}
                    </template>
                    <template #name-data="{ row }">
                        <div class="flex items-center">
                            <UAvatar v-if="renderFlagAvatar(row.vesselFlagId)" size="xs"
                                :src="renderFlagAvatar(row.vesselFlagId)" alt="Avatar" />
                            <div class="ml-3">
                                <div class="text-black font-semibold">
                                    {{ row.name }}
                                </div>
                                <div class="text-grayy-75">{{ row.imoNumber }}/{{ row.officialNumber }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #vesselTypeId-data="{ row }">
                        {{ renderVesselType(row.vesselTypeId) }}
                    </template>
                    <template #grossTonnage-data="{ row }">
                        <div class="text-black font-semibold">
                            {{ formatNumber(row.grossTonnage) }}
                        </div>
                        <div class="text-grayy-75">{{ formatNumber(row.netTonnage) }}/{{ formatNumber(row.loadWeight) }}
                        </div>
                    </template>
                    <template #lengthOverall-data="{ row }">
                        <div class="text-black font-semibold">
                            {{ formatNumber(row.lengthOverall) }}
                        </div>
                        <div class="text-grayy-75">{{ formatNumber(row.breadthExtreme) }}/{{ formatNumber(row.depth) }}
                        </div>
                    </template>
                    <template #empty-state>
                        <EmptyNotFoundTable />
                    </template>
                </UTable>
                <div class="flex justify-between px-6 py-3 overflow-auto">
                    <div class="flex items-center">
                        <span class="text-sm text-grayy-75 mr-3.5">แสดง</span>
                        <USelect :options="limitRowTable" v-model="filter.limit" />
                    </div>

                    <UPagination
                        :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                        :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
                        v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit" />
                </div>

            </div>
            <Loading v-if="isLoading" />
        </div>
    </UModal>
</template>
<script setup lang="ts">
import Input from '~/components/form/u-input.vue';

import USelect from '~/components/form/u-select.vue';
import Loading from '~/components/loading.vue';
import DatePicker from "~/components/form/v-datepicker.vue";
import EmptyNotFoundTable from '~/components/ui/emptyNotFoundTable.vue';
import type { IFilterVesselHistory } from '~/core/interfaces/IFilterVesselHistory';
import { format } from 'date-fns';
import useVesselService from '~/core/services/vesselService';
import type { IVesselData } from '~/core/interfaces';

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: {
        type: Function as PropType<(...args: any[]) => void>,
        default: () => { },
    },
    documentId: {
        type: Number,
        required: true,
    },
    vesselId: {
        type: Number,
        required: true,
    },
});

const { t } = useI18n();
const isLoading = ref(false)
const search = ref('')
const vesselType = ref(0)
const vesselService = useVesselService()
const vesselOptionsStore = useVesselOptionsStore()
const vesselId = computed(() => props.vesselId)
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const filter = ref<IFilterVesselHistory>({
    approvedDateBegin: '',
    approvedDateEnd: '',
    page: 1,
    limit: 10,
    search: ''
})

const vesselList = ref<IVesselData[]>([])
const paginationData = ref({
    totalItems: 0,
    totalPages: 0
})

const limitRowTable = ref([{
    id: 10,
    name: 10
}, {
    id: 20,
    name: 20
}, {
    id: 50,
    name: 50
}, {
    id: 100,
    name: 100
}])

const handleClickResetFitler = () => {
    dateValue.value = "";
    selectedDate.value = { start: new Date(), end: new Date() };
    filter.value.page = 1
    filter.value.limit = 10
    getVesselDocHistoryList({
        approvedDateBegin: '',
        approvedDateEnd: '',
        page: 1,
        limit: 10,
        search: ''
    })
}

const columns = [{
    key: 'id',
    label: 'ลำดับ',
},
{
    key: 'owner',
    label: 'เจ้าของเรือ',
}, {
    key: 'name',
    label: 'ชื่อเรือ/IMO/Official No.',
}, {
    key: 'vesselTypeId',
    label: 'ประเภทเรือ',
},
{
    key: 'mmsiNumber',
    label: 'MMSI No.',
},
{
    key: 'callSign',
    label: 'สัญญาณเรียกขาน',
},
{
    key: 'grossTonnage',
    label: 'GRT/NRT/DWT',
},
{
    key: 'lengthOverall',
    label: 'LOA/BEAM /DRAFT ',
}]

onMounted(() => {
    getVesselDocHistoryList(filter.value)
    vesselOptionsStore.getVesselTypeOption()
    vesselOptionsStore.getVesselFlagOption()
})

const onSelectedDateChange = (newDate: any) => {
    dateValue.value = newDate;
};

const getVesselDocHistoryList = async (filter: IFilterVesselHistory = {
    approvedDateBegin: '',
    approvedDateEnd: '',
    page: 1,
    limit: 10,
    search: ''
}) => {
    isLoading.value = true
    if (vesselId) {
        const resp = await vesselService.getVesselHistoryList(filter, vesselId.value)
        if (resp.statusCode === 200) {
            vesselList.value = resp.data.data
            paginationData.value.totalItems = resp.data.totalItems
            paginationData.value.totalPages = resp.data.totalPages
        }
    }
    isLoading.value = false
}

const renderFlagAvatar = (vesselFlagId: number) => {
    if (vesselFlagId) {
        const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === vesselFlagId)
        if (findVesselFlag) {
            return findVesselFlag.path
        }
        return ''
    }
    return ''
}

const renderVesselType = (vesselTypeId: number) => {
    if (vesselTypeId) {
        const findVesselType: any = vesselOptionsStore.vesselTypeOption.find((e: any) => e.id === vesselTypeId)
        if (findVesselType) {
            return findVesselType.name
        }
        return '-'
    }
    return '-'
}

watch(
    () => filter.value.page,
    (value) => {
        getVesselDocHistoryList({ ...filter.value, page: value })
    }
);

watch(
    () => filter.value.limit,
    (value) => {
        filter.value.page = 1
        getVesselDocHistoryList({ ...filter.value, limit: value, page: 1 })
    }
);

watch(
    () => dateValue.value,
    (value) => {
        const beginDate = value ? adjustToUTC(value.start) : "";
        const endDate = value ? adjustToUTC(value.end) : "";
        filter.value.approvedDateBegin = beginDate;
        filter.value.approvedDateEnd = endDate;
        filter.value.page = 1;
        getVesselDocHistoryList({ ...filter.value, approvedDateBegin: beginDate, approvedDateEnd: endDate, page: 1 });
    }
);

watch(
    () => props.isDialogOpen,
    (value) => {
        if (value) {
            filter.value.page = 1
            getVesselDocHistoryList({ ...filter.value, page: 1 })
        }
    }
);


</script>
