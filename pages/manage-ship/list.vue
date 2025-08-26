<template>
    <div class="flex justify-between items-center mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('vessel_management') }}</h1>
        <div>
            <UButton v-if="canCreate" @click="handleClickCreateShipAgent" icon="i-heroicons-plus-circle" size="md"
                :label="$t('create')" />
        </div>
    </div>
    <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
        <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
                <USelect :label="$t('search_vessel')" :options="searchTypeList" value-attribute="value"
                    v-model="searchType" />
            </div>
            <div class="col-span-1">
                <Input label="ชื่อเรือ/IMO/Official No." placeholder="ค้นหา" v-model="search"
                    icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <div class="col-span-1">
                <USelect label="ประเภทเรือ" placeholder="ประเภทเรือ" :options="vesselOptionsStore.vesselTypeOption"
                    v-model="vesselType" />
            </div>
            <div class="col-span-1">
                <div class="flex items-end">
                    <div class="w-full">
                        <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId" required>
                            <USelectMenu v-model="vesselFlag" size="md" variant="outline" color="purple"
                                :ui="{ wrapper: 'rounded-md bg-white' }" value-attribute="id" option-attribute="name"
                                searchable :options="vesselOptionsStore.vesselFlagsOption"
                                placeholder="สัญชาติเรือ/ธงเรือ">
                                <template #leading>
                                    <UAvatar v-if="vesselFlagData.avatar" size="xs" :src="vesselFlagData.avatar"
                                        alt="Avatar" />
                                    <NuxtIcon v-else name="flag" size="xl" />
                                </template>
                            </USelectMenu>
                        </UFormGroup>
                    </div>
                    <div class="ml-2 mb-0.5">
                        <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
                    </div>
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
        <UTable @select="selectRow" :columns="columns" :rows="vesselList" :ui="{
            base: 'u-table-list',
        }">
            <template v-for="column in filteredColumns" :key="column.key" v-slot:[column.key+'-header']>
                <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
                    <span>{{ column.label }}</span>
                    <span
                        v-if="sortField === (column.key === 'shipDetails' ? 'vesselName' : column.key) && sortOrder === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                    </span>
                    <span
                        v-else-if="sortField === (column.key === 'shipDetails' ? 'vesselName' : column.key) && sortOrder === 'desc'">
                        <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                    </span>
                    <span v-else>
                        <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                    </span>
                </div>
            </template>
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
            <template #actions-data="{ row }">
                <ActionMenuTable :items="getMenuTable(row)" @click.stop />
            </template>
            <template #empty-state>
                <EmptyNotFoundTable />
            </template>
        </UTable>
        <div class="flex justify-between px-6 py-3">
            <div class="flex items-center">
                <span class="text-sm text-grayy-75 mr-3.5">แสดง</span>
                <USelect :options="limitRowTable" v-model="filter.limit" />
            </div>

            <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
                v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit" />
        </div>

    </div>
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from '~/components/form/u-input.vue';

import USelect from '~/components/form/u-select.vue';
import NuxtIcon from '~/components/ui/nuxtIcon.vue';
import Loading from '~/components/loading.vue';
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import DocIcon from "~/assets/icons/fi-rs-document-2.svg";
import useVesselService from '~/core/services/vesselService';
import type { IFilterVessel, IOption, IVesselData } from '~/core/interfaces';
import EmptyNotFoundTable from '~/components/ui/emptyNotFoundTable.vue';
import ActionMenuTable from '~/components/ui/actionMenuTable.vue';
import { useDocumentStore } from "~/stores/documentStore";

const canCreate = allowPermission('create_vessel_data')
const canView = allowPermission('view_vessel_data')
const canEdit = allowPermission('edit_vessel_data')
const canDelete = allowPermission('delete_vessel_data')
const { t } = useI18n();
const route: any = useRoute();
const isLoading = ref(false)
const search = ref('')
const searchType = ref(false)
const vesselType = ref(0)
const vesselFlag = ref(0)
const vesselService = useVesselService()
const vesselOptionsStore = useVesselOptionsStore()
const vesselStore = useVesselStore()
const documentStore = useDocumentStore();
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<IFilterVessel>({
    flag: 0,
    owner: '',
    type: 0,
    page: 1,
    limit: 10,
    search: '',
    showAll: false,
    Order: [{ column: sortField.value, dir: sortOrder.value }]
})
const searchTypeList = ref<IOption[]>([
    { name: "เรือของท่าน", value: false },
    { name: "เรือทั้งหมด", value: true },
])

const vesselList = ref<IVesselData[]>([])
const paginationData = ref({
    totalItems: 0,
    totalPages: 0
})
const vesselFlagData = ref({
    avatar: '',
    flagName: ''
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

const getActionsList = () => {
    const action = []
    if (canView) {
        action.push({
            key: 'view',
            icon: 'eye',
            label: 'ดู'
        })
    }

    if (canEdit) {
        action.push({
            key: 'edit',
            icon: 'edit-2',
            label: 'ยืนคำร้อง'
        })
    }

    return action
}

const getMenuTable = (row: IVesselData) => {

    const items: { label: string; avatar: { src: string }; click: () => void }[][] = [
        []
    ];
    if (canView) {
        items[0].push({
            label: t('view'),
            avatar: {
                src: ViewIcon,
            },
            click: () => {
                navigateTo(`/manage-ship/view?id=${row.id}`)
            },
        });
    }
    if (canEdit) {
        items[0].push({
            label: t('ยื่นคำร้อง'),
            avatar: {
                src: DocIcon,
            },
            click: () => {
                vesselStore.setVesselId(row.id)
                navigateTo(`/request-form/create`)
            },
        });
    }
    return items

};

const handleClickResetFitler = () => {
    search.value = ''
    searchType.value = false
    vesselType.value = 0
    vesselFlag.value = 0
    vesselFlagData.value.avatar = ''
    vesselFlagData.value.flagName = ''
    filter.value.page = 1
    filter.value.limit = 10
    filter.value.flag = 0
    filter.value.type = 0
    filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }]
    getVesselList({
        ...filter.value,
        page: 1,
        limit: 10,
        search: '',
        type: 0,
        flag: 0,
        Order: [{ column: sortField.value, dir: sortOrder.value }]
    })
}

const handleClickCreateShipAgent = () => {
    navigateTo('/manage-ship/create')
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
},
{
    key: 'actions',
    sortable: false
}]

onMounted(() => {
    getVesselList(filter.value)
    vesselOptionsStore.getVesselTypeOption()
    vesselOptionsStore.getVesselFlagOption()

    if (!route.query.status) {
        getVesselList(filter.value);
    } else {
        searchType.value = route.query.status === 'true' ? true : false;
        documentStore.setManageShipQueryType(route.query.status)
    }
})

const getVesselList = async (filter: IFilterVessel = {
    flag: 0,
    owner: '',
    type: 0,
    page: 1,
    limit: 10,
    search: '',
    showAll: false,
    Order: [{ column: sortField.value, dir: sortOrder.value }]
}) => {
    isLoading.value = true
    const resp = await vesselService.getVesselList(filter)
    if (resp.statusCode === 200) {
        vesselList.value = resp.data.data
        paginationData.value.totalItems = resp.data.totalItems
        paginationData.value.totalPages = resp.data.totalPages
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

const handleClickByAction = (key: string, id: number) => {
    switch (key) {
        case 'view':
            navigateTo(`/manage-ship/view?id=${id}`)
            break;
        case 'view':
            navigateTo(`/manage-ship/view?id=${id}`)
            break;
        default:
            break;
    }
}

const selectRow = (row: IVesselData) => {
    const menuItems = getMenuTable(row);
    if (menuItems.length > 0 && menuItems[0].length > 0) {
        const firstAction = menuItems[0][0];
        if (firstAction.click) {
            firstAction.click();
        }
    }
}

const performSearch = debounce((query: any) => {
    filter.value.search = query
    filter.value.page = 1
    getVesselList({
        ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
    })
}, 500);

watch(
    () => searchType.value,
    (value) => {
        filter.value.showAll = value
        filter.value.page = 1
        getVesselList({
            ...filter.value, showAll: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
        })
    }
);

watch(search, (newVal) => {
    performSearch(newVal);
});

watch(
    () => filter.value.page,
    (value) => {
        getVesselList({
            ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }]
        })
    }
);

watch(
    () => filter.value.limit,
    (value) => {
        filter.value.page = 1
        getVesselList({
            ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
        })
    }
);

watch(
    () => vesselType.value,
    (value) => {
        filter.value.type = value
        filter.value.page = 1
        getVesselList({
            ...filter.value, type: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
        })
    }
);

watch(
    () => vesselFlag.value,
    (value) => {
        if (value) {
            const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value)
            if (findVesselFlag) {
                vesselFlagData.value.avatar = findVesselFlag.path
                vesselFlagData.value.flagName = findVesselFlag.name
            }
            filter.value.page = 1
            getVesselList({
                ...filter.value, flag: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
            })
        }
    }
);

watch(
    () => route.query.status,
    (newQueryStatus) => {
        console.log('route.query.status', route.query.status)
        console.log('newQueryStatus', newQueryStatus)

        searchType.value = newQueryStatus === 'true' ? true : false;

        filter.value = {
            flag: 0,
            owner: '',
            type: 0,
            page: 1,
            limit: filter.value.limit,
            search: '',
            showAll: newQueryStatus,
            Order: [{ column: sortField.value, dir: sortOrder.value }]
        };

        vesselFlag.value = 0;
        vesselType.value = 0;
        search.value = "";
        vesselFlagData.value = { avatar: "", flagName: "" };
        getVesselList({
            ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }]
        });
    }
);

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const toggleSort = (column: string) => {
    let sortColumn = column;
    if (column === "shipDetails") {
        sortColumn = "vesselName";
    }
    if (sortField.value !== sortColumn) {
        sortField.value = sortColumn;
        sortOrder.value = "asc";
    } else {
        if (sortOrder.value === "asc") {
            sortOrder.value = "desc";
        } else if (sortOrder.value === "desc") {
            sortField.value = "";
            sortOrder.value = "";
        } else {
            sortOrder.value = "asc";
        }
    }
    getVesselList({ ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] });
};
</script>
