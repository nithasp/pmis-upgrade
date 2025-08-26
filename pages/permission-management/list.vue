<template>
    <div class="flex justify-between items-center mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('permission_management') }}</h1>
        <div>
            <UButton @click="handleClickCreateShipAgent" icon="i-heroicons-plus-circle" size="md" label="สร้าง" />
        </div>
    </div>
    <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
        <div class="grid grid-cols-8 gap-4">
            <div class="col-span-4">
                <Input :label="$t('user_permission')" name="keyword" v-model="search"
                    :placeholder="$t('search_title_placeholder')" icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <div class="col-span-4 flex justify-end h-full">
                <div class="mt-6">
                    <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
                </div>
            </div>
        </div>
    </div>
    <div id="request-form-content" class="bg-white rounded-[20px]">
        <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
                <h1 class="font-normal text-lg text-white">{{ $t('user_permission_all') }}</h1>
                <div v-if="(search)" class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{
                    paginationData.totalItems }} รายการ
                </div>
            </div>
        </div>
        <UTable @select="selectRow" :columns="columns" :rows="roleList" :ui="{
            base: 'u-table-list',
        }">
            <template v-for="column in filteredColumns" :key="column.key" v-slot:[`${column.key}-header`]>
                <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
                    <span>{{ column.label }}</span>
                    <span v-if="sortField === column.key && sortOrder === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                    </span>
                    <span v-else-if="sortField === column.key && sortOrder === 'desc'">
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
            <template #updatedAt-data="{ row }">
                {{ row.updatedAt && renderDateFormat(row.updatedAt) }}
                <div class="text-grayy-75">{{ row.updatedAt && renderTimeFormat(row.updatedAt) }}</div>
            </template>
            <template #activated-data="{ row }">
                <Badge :label="row.activated ? $t('activate') : $t('deactivate')"
                    :type="row.activated ? 'success' : 'error'" />
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

    <DialogConfirm :title="modalTitleDialog" :desc="modalDialogMessage" :icon="modalDialogType"
        :labelConfirm="$t('confirm')" :labelCancel="$t('cancel')" :isDialogOpen="isConfirmActivateDialogOpen"
        :dialogCancel="dialogCloseActivateStatus" :dialogConfirm="dialogConfirmActivateUserPermission" />
    <DialogConfirm :title="$t('cancel_user_permission')" :desc="$t('confirm_cancel_user_permission')" icon="danger"
        :labelConfirm="$t('confirm')" :labelCancel="$t('cancel')" :isDialogOpen="isConfirmCancelDialogOpen"
        :dialogCancel="dialogCloseCancelUserPermission" :dialogConfirm="dialogConfirmCancelUserPermission"
        color-confirm="red" />
    <ChangeUserPermissionDialog :title="$t('change_user_permission')" :desc="$t('confirm_change_user_permission')"
        :labelConfirm="$t('confirm')" :labelCancel="$t('cancel')" :isDialogOpen="isConfirmAssignNewRoleDialogOpen"
        :dialogCancel="dialogCloseChangeUserPermission" :dialogConfirm="dialogConfirmChangeUserPermission"
        :roleOptionsNoRoleIdExpectedRemove="roleOptionsNoRoleIdExpectedRemove" />
    <DialogAlert :isOpen="isAlertDialogActivateOpen" :desc="modalAlertMessage" :title="modalTitleDialog"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogActivate" />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from '~/components/form/u-input.vue';

import USelect from '~/components/form/u-select.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Badge from '~/components/badge/badge.vue';
import Loading from '~/components/loading.vue';
import ActionMenuTable from '~/components/ui/actionMenuTable.vue';
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import useRoleService from '~/core/services/roleService';
import type { IFilter } from '~/core/interfaces/IFilter';
import type { IRoleList } from '~/core/interfaces/IRoleList';
import { UserTypeEnum } from '~/utils/enums/UserTypeEnum';
import EmptyNotFoundTable from '~/components/ui/emptyNotFoundTable.vue';
import ChangeUserPermissionDialog from '~/components/dialog/user-permission/change-user-permission-dialog.vue';

const { t } = useI18n();

const isLoading = ref(false)
const search = ref('')
const roleId = ref()
const countUser = ref(0)
const roleOptionsNoRoleIdExpectedRemove = ref([])
const isStatusActivated = ref(false)
const rolesOptionsStore = useRolesOptionsStore()
const roleService = useRoleService()
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<IFilter>({
    page: 1,
    limit: 10,
    search: '',
    Order: [{ column: sortField.value, dir: sortOrder.value }]
})
const roleList = ref<IRoleList[]>([])
const paginationData = ref({
    totalItems: 0,
    totalPages: 0
})

const isConfirmCancelDialogOpen = ref(false)
const isConfirmActivateDialogOpen = ref(false)
const isConfirmAssignNewRoleDialogOpen = ref(false)
const isAlertDialogActivateOpen = ref(false)
const modalTitleDialog = ref('')
const modalDialogMessage = ref('')
const modalDialogType = ref('')
const modalAlertMessage = ref('')
const modalAlertType = ref('')

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

const getMenuTable = (row: IRoleList) => {

    const items = [
        [
            {
                label: t('view'),
                avatar: {
                    src: ViewIcon,
                },
                click: () => {
                    navigateTo(`/permission-management/view?id=${row.id}`)
                },
            },
            {
                label: t('edit'),
                avatar: {
                    src: EditIcon,
                },
                visible: row.canEdit,
                click: () => {
                    navigateTo(`/permission-management/edit?id=${row.id}`)
                },
            },
            {
                label: row.activated ? t('deactivate') : t('activate'),
                avatar: {
                    src: row.activated ? CrossIcon : CheckIcon,
                },
                visible: row.canDeActivate,
                click: () => {
                    isConfirmActivateDialogOpen.value = true
                    modalTitleDialog.value = row.activated ? t('deactivate_user_permission') : t('activate_user_permission')
                    modalDialogType.value = 'warning'
                    modalDialogMessage.value = row.activated ? t('confirm_deactivate_user_permission') : t('confirm_activate_user_permission')
                    roleId.value = row.id
                    isStatusActivated.value = row.activated
                },
            },
            {
                label: t('cancel'),
                avatar: {
                    src: DeleteIcon,
                },
                visible: row.canDelete,
                click: () => {
                    isConfirmCancelDialogOpen.value = true
                    roleId.value = row.id
                    countUser.value = row.countUser
                },
            },
        ],
    ];

    return items;
};

const handleClickResetFitler = () => {
    search.value = ''
    filter.value.page = 1
    filter.value.limit = 10
    getRolesList({
        ...filter.value, page: 1,
        limit: 10,
        search: '',
        Order: [{ column: sortField.value, dir: sortOrder.value }]
    })
}

const handleClickCreateShipAgent = () => {
    navigateTo('/permission-management/create')
}

const columns = [{
    key: 'id',
    label: t('number_no'),
},
{
    key: 'name',
    label: t('user_permission'),
}, {
    key: 'countUser',
    label: t('user_amount'),
}, {
    key: 'activated',
    label: t('status'),
},
{
    key: 'updatedAt',
    label: t('updated_at'),
},
{
    key: 'updatedName',
    label: t('updated_by'),
},
{
    key: 'actions',
    sortable: false
}]

onMounted(() => {
    getRolesList(filter.value)
    rolesOptionsStore.getRolesOptions()
})

const getRolesList = async (filter: IFilter = {
    page: 1,
    limit: 10,
    search: '',
    Order: [{ column: sortField.value, dir: sortOrder.value }]
}) => {
    isLoading.value = true
    const resp = await roleService.getRolesList(filter)
    if (resp.statusCode === 200) {
        roleList.value = resp.data.data
        paginationData.value.totalItems = resp.data.totalItems
        paginationData.value.totalPages = resp.data.totalPages
    }
    isLoading.value = false
}

const performSearch = debounce((query: any) => {
    filter.value.search = query
    filter.value.page = 1
    getRolesList({ ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] })
}, 500);

watch(search, (newVal) => {
    performSearch(newVal);
});

watch(
    () => filter.value.page,
    (value) => {
        getRolesList({ ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }] })
    }
);

watch(
    () => filter.value.limit,
    (value) => {
        filter.value.page = 1
        getRolesList({ ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] })
    }
);

const dialogConfirmActivateUserPermission = async () => {
    isLoading.value = true
    if (roleId) {
        const resp = await roleService.updateRoleStatus(roleId.value, !isStatusActivated.value)
        if (resp.statusCode === 200) {
            isAlertDialogActivateOpen.value = true
            modalAlertMessage.value = isStatusActivated.value ? t('deactivate_user_permission_success') : t('activate_user_permission_success')
            modalAlertType.value = 'success'
        } else {
            isAlertDialogActivateOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    }

    isLoading.value = false
    isConfirmActivateDialogOpen.value = false
}

const dialogConfirmCancelUserPermission = async () => {
    isLoading.value = true
    if (countUser.value === 0 && roleId) {
        const resp = await roleService.cancelRole(roleId.value)
        if (resp.statusCode === 200) {
            isAlertDialogActivateOpen.value = true
            modalTitleDialog.value = t('cancel_user_permission')
            modalAlertMessage.value = t('cancel_user_permission_success')
            modalAlertType.value = 'success'
        } else {
            isAlertDialogActivateOpen.value = true
            modalTitleDialog.value = t('cancel_user_permission')
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    } else {
        isConfirmAssignNewRoleDialogOpen.value = true
        roleOptionsNoRoleIdExpectedRemove.value = rolesOptionsStore.rolesOption.filter((e: any) => e.id !== roleId.value)
    }

    isLoading.value = false
    isConfirmCancelDialogOpen.value = false
}

const dialogConfirmChangeUserPermission = async (newRoleId: number) => {
    isLoading.value = true
    if (roleId) {
        const resp = await roleService.cancelRole(roleId.value, newRoleId)
        if (resp.statusCode === 200) {
            isAlertDialogActivateOpen.value = true
            modalTitleDialog.value = t('cancel_user_permission')
            modalAlertMessage.value = t('cancel_user_permission_success')
            modalAlertType.value = 'success'
        } else {
            isAlertDialogActivateOpen.value = true
            modalTitleDialog.value = t('cancel_user_permission')
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    }

    isLoading.value = false
    isConfirmCancelDialogOpen.value = false
    isConfirmAssignNewRoleDialogOpen.value = false
}

const handleCloseAlertDialogActivate = () => {
    isAlertDialogActivateOpen.value = false
    getRolesList(filter.value)
}


const dialogCloseActivateStatus = () => {
    isConfirmActivateDialogOpen.value = false
}

const dialogCloseCancelUserPermission = () => {
    isConfirmCancelDialogOpen.value = false
}

const dialogCloseChangeUserPermission = () => {
    isConfirmAssignNewRoleDialogOpen.value = false
}

const selectRow = (row: IRoleList) => {
    const menuItems = getMenuTable(row);
    if (menuItems.length > 0 && menuItems[0].length > 0) {
        const firstAction = menuItems[0][0];
        if (firstAction.click) {
            firstAction.click();
        }
    }
}

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const toggleSort = (column: string) => {
    if (sortField.value !== column) {
        sortField.value = column;
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
    getRolesList({ ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] })
};
</script>
