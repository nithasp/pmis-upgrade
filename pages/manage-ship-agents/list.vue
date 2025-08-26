<template>
    <div class="flex justify-between items-center mb-8">
        <h1 class="font-bold text-[30px]">{{ $t("vessel_agents_management") }}</h1>
        <div>
            <UButton @click="handleClickCreateShipAgent" icon="i-heroicons-plus-circle" size="md"
                :label="$t('create')" />
        </div>
    </div>
    <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
        <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
                <Input
                    :label="`${$t('email')}/${$t('company')}/${$t('contact_person')}/${$t('taxpayer_identification_no')}`"
                    name="email" :placeholder="$t('search_title_placeholder')" v-model="search"
                    icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <div class="col-span-1">
                <UFormGroup :label="$t('search_request_date')">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                            :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                            :placeholder="$t('search_title_placeholder')" :ui="{
                                wrapper: 'w-full rounded-md bg-white',
                            }" />

                        <template #panel="{ close }">
                            <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                                <DatePicker v-model="selectedDate" @close="close" />
                            </div>
                        </template>
                    </UPopover>
                </UFormGroup>
            </div>
            <div class="col-span-1">
                <USelect :label="$t('person_type')" name="personType" :placeholder="$t('person_type')"
                    :options="personTypeOption" v-model="personType" />
            </div>
            <div class="col-span-1">
                <div class="flex items-end">
                    <div class="w-full">
                        <USelect :label="$t('status')" name="status" :placeholder="$t('status')" :options="statusOption"
                            v-model="status" />
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
                <h1 class="font-normal text-lg text-white">{{ $t("vessel_agents_all") }}</h1>
                <div v-if="search || personType || status || dateValue"
                    class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">
                    {{ paginationData.totalItems }} รายการ
                </div>
            </div>
        </div>
        <UTable @select="selectRow" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
            :columns="columns" :rows="vesselAgentList" :ui="{
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
            <template #createdAt-data="{ row }">
                {{ row.createdAt && renderDateFormat(row.createdAt) }}
                <div class="text-grayy-75">{{ row.createdAt && renderTimeFormat(row.createdAt) }}</div>
            </template>
            <template #status-data="{ row }">
                <Badge :label="renderStatusText(t, row.status)" :type="renderStatusType(row.status)" />
            </template>
            <template #personType-data="{ row }">
                {{ renderPersonType(row.personType) }}
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
                <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
                <USelect :options="limitRowTable" v-model="filter.limit" />
            </div>

            <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
                v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit" />
        </div>
    </div>
    <DialogConfirm :title="$t('reset_password')" :desc="$t('confirm_reset_password')" icon="warning"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmDialogResetPasswordOpen"
        :dialogCancel="dialogCancelResetPassword" :dialogConfirm="dialogConfirmResetPasword" />
    <DialogConfirm :title="$t('cancel_vessel_agent')" :desc="$t('confirm_cancel_vessel_agent')" icon="danger"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmCancelDialogOpen"
        :dialogCancel="dialogCancelDeleteVesselAgent" :dialogConfirm="dialogConfirmDeleteVesselAgent"
        color-confirm="red" />
    <DialogAlert :isOpen="isAlertDialogResetPasswordOpen" :desc="modalAlertMessage" :title="$t('reset_password')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogResetPassword" :btnName="$t('close')" />
    <DialogAlert :isOpen="isAlertCancelDialogOpen" :desc="modalAlertMessage" :title="$t('cancel_vessel_agent')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import { format } from "date-fns";
import DatePicker from "~/components/form/v-datepicker.vue";
import USelect from "~/components/form/u-select.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import useVesselAgentService from "~/core/services/vesselAgentService";
import type { IFilterVesselAgent } from "~/core/interfaces/IFilterVesselAgent";
import type { IVesselAgentData } from "~/core/interfaces/IVesselAgentData";
import useAuthService from "~/core/services/authService";
import Badge from "~/components/badge/badge.vue";
import Loading from "~/components/loading.vue";
import ActionMenuTable from "~/components/ui/actionMenuTable.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import RefreshIcon from "~/assets/icons/fi-rs-refresh.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import { UserStatusEnum } from "~/utils/enums/UserStatusEnum";
import { renderStatusText, renderStatusType } from "./utils/ui";
import { canResetPassword } from "./utils/permissions";
import { useDocumentStore } from "~/stores/documentStore";

const { t } = useI18n();
const route: any = useRoute();
const isLoading = ref(false);
const search = ref("");
const personType = ref("");
const status = ref("");
const dateValue = ref<any>("");
const selectedDate = ref<any>({ start: new Date(), end: new Date() });
const vesselAgentId = ref();
const vesselEmail = ref("");
const vesselAgentService = useVesselAgentService();
const authService = useAuthService();
const authStore = useAuthStore();
const documentStore = useDocumentStore();
const user = authStore.profileUser;
const sortField = ref("createdAt");
const sortOrder = ref("desc");

const filter = ref<IFilterVesselAgent>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    personType: "",
    begin: "",
    end: "",
    Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const vesselAgentList = ref<IVesselAgentData[]>([]);
const paginationData = ref({
    totalItems: 0,
    totalPages: 0,
});

const isConfirmDialogResetPasswordOpen = ref(false);
const isConfirmCancelDialogOpen = ref(false);
const isAlertCancelDialogOpen = ref(false);
const isAlertDialogResetPasswordOpen = ref(false);
const modalAlertMessage = ref("");
const modalAlertType = ref("");

const limitRowTable = ref([
    {
        id: 10,
        name: 10,
    },
    {
        id: 20,
        name: 20,
    },
    {
        id: 50,
        name: 50,
    },
    {
        id: 100,
        name: 100,
    },
]);

const getMenuTable = (row: IVesselAgentData) => {
    return [
        [
            {
                label: t("view"),
                avatar: {
                    src: ViewIcon,
                },
                click: () => {
                    navigateTo(`/manage-ship-agents/view?id=${row.id}`);
                },
            },
            {
                label: t("reset_password"),
                avatar: {
                    src: RefreshIcon,
                },
                visible: canResetPassword(row),
                click: () => {
                    isConfirmDialogResetPasswordOpen.value = true;
                    vesselAgentId.value = row.id;
                    vesselEmail.value = row.email;
                },
            },
            {
                label: t("edit"),
                avatar: {
                    src: EditIcon,
                },
                click: () => {
                    navigateTo(`/manage-ship-agents/edit?id=${row.id}`);
                },
            },
            {
                label: t("cancel"),
                avatar: {
                    src: DeleteIcon,
                },
                click: () => {
                    isConfirmCancelDialogOpen.value = true;
                    vesselAgentId.value = row.id;
                },
            },
        ],
    ];
};

const handleClickResetFitler = () => {
    search.value = "";
    personType.value = "";
    status.value = "";
    dateValue.value = "";

    filter.value = {
        page: 1,
        limit: 10,
        search: "",
        status: "",
        personType: "",
        begin: "",
        end: "",
        Order: [{ column: sortField.value, dir: sortOrder.value }]
    };

    getVesselAgentList(filter.value);
};

const handleClickCreateShipAgent = () => {
    navigateTo("/manage-ship-agents/create");
};

const columns = [
    {
        key: "id",
        label: t("number_no"),
    },
    {
        key: "createdAt",
        label: "วันที่ยื่นคำขอ",
    },
    {
        key: "email",
        label: t("email"),
    },
    {
        key: "company",
        label: "บริษัท/ผู้ติดต่อ",
    },
    {
        key: "personType",
        label: t("legal_entities"),
    },
    {
        key: "tax",
        label: t("taxpayer_identification_no"),
    },
    {
        key: "phone",
        label: t("telephone_no"),
    },
    {
        key: "status",
        label: t("status"),
    },
    {
        key: "actions",
        sortable: false,
    },
];

onMounted(() => {
    if (!route.query.status) {
        getVesselAgentList(filter.value);
    } else {
        status.value = route.query.status;
        documentStore.setManageShipAgentsQueryType(route.query.status);
        getVesselAgentList({ ...filter.value, status: route.query.status, page: 1 });
    }
});

const getVesselAgentList = async (
    filter: IFilterVesselAgent = {
        page: 1,
        limit: 10,
        search: "",
        status: "",
        personType: "",
        begin: "",
        end: "",
        Order: [{ column: sortField.value, dir: sortOrder.value }]
    }
) => {
    isLoading.value = true;
    const resp = await vesselAgentService.getVesselAgentList(filter);
    if (resp.statusCode === 200) {
        vesselAgentList.value = resp.data.data;
        paginationData.value.totalItems = resp.data.totalItems;
        paginationData.value.totalPages = resp.data.totalPages;
    }
    isLoading.value = false;
};

const handleClickByAction = (key: string, id: number, email: string) => {
    switch (key) {
        case "edit":
            navigateTo(`/manage-ship-agents/edit?id=${id}`);
            break;
        case "view":
            navigateTo(`/manage-ship-agents/view?id=${id}`);
            break;
        case "resetPassword":
            isConfirmDialogResetPasswordOpen.value = true;
            vesselAgentId.value = id;
            vesselEmail.value = email;
            break;
        case "delete":
            isConfirmCancelDialogOpen.value = true;
            vesselAgentId.value = id;
            break;
        default:
            break;
    }
};

const performSearch = debounce((query: any) => {
    filter.value.search = query;
    filter.value.page = 1;
    getVesselAgentList({ ...filter.value, search: query, page: 1 });
}, 500);

watch(search, (newVal) => {
    performSearch(newVal);
});

watch(
    () => selectedDate.value,
    (value) => {
        dateValue.value = value;
    }
);

watch(
    () => dateValue.value,
    (value) => {
        const beginDate = value ? new Date(value.start).toISOString() : "";
        const endDate = value ? new Date(value.end).toISOString() : "";
        filter.value.begin = beginDate;
        filter.value.end = endDate;
        filter.value.page = 1;
        getVesselAgentList({ ...filter.value, begin: beginDate, end: endDate, page: 1 });
    }
);

watch(
    () => personType.value,
    (value) => {
        filter.value.personType = value;
        filter.value.page = 1;
        getVesselAgentList({ ...filter.value, personType: value, page: 1 });
    }
);

watch(
    () => status.value,
    (value) => {
        filter.value.status = value;
        filter.value.page = 1;
        getVesselAgentList({ ...filter.value, status: value, page: 1 });
    }
);

watch(
    () => filter.value.page,
    (value) => {
        getVesselAgentList({ ...filter.value, page: value });
    }
);

watch(
    () => filter.value.limit,
    (value) => {
        filter.value.page = 1;
        getVesselAgentList({ ...filter.value, limit: value, page: 1 });
    }
);

watch(
    () => route.query.status,
    (newQueryStatus) => {
        filter.value = {
            page: 1,
            limit: filter.value.limit,
            search: "",
            personType: "",
            status: newQueryStatus,
            begin: "",
            end: "",
            Order: [{ column: sortField.value, dir: sortOrder.value }]
        };

        search.value = "";
        personType.value = "";
        status.value = "";
        dateValue.value = "";

        getVesselAgentList({ ...filter.value });
        status.value = newQueryStatus;
    }
);

const dialogCancelResetPassword = () => {
    isConfirmDialogResetPasswordOpen.value = false;
};

const dialogConfirmResetPasword = async () => {
    isLoading.value = true;
    if (vesselAgentId.value) {
        const resp = await authService.sendEmailForgetPassword({ email: vesselEmail.value });
        if (resp.statusCode === 200) {
            isAlertDialogResetPasswordOpen.value = true;
            modalAlertMessage.value = "การรีเซ็ตรหัสผ่านของคุณสำเร็จแล้ว กรุณาตรวจสอบอีเมลเพื่อรับรหัสเข้าสู่ระบบ";
            modalAlertType.value = "success";
        } else {
            isAlertDialogResetPasswordOpen.value = true;
            modalAlertMessage.value = resp.message;
            modalAlertType.value = "error";
        }
    }

    isLoading.value = false;
    isConfirmDialogResetPasswordOpen.value = false;
};

const dialogConfirmDeleteVesselAgent = async () => {
    isLoading.value = true;
    if (vesselAgentId) {
        const resp = await vesselAgentService.deleteVesselAgent(vesselAgentId.value);
        if (resp.statusCode === 200) {
            isAlertCancelDialogOpen.value = true;
            modalAlertMessage.value = t("cancel_vessel_agent_success");
            modalAlertType.value = "success";
        } else {
            isAlertCancelDialogOpen.value = true;
            modalAlertMessage.value = resp.message;
            modalAlertType.value = "error";
        }
    }

    isLoading.value = false;
    isConfirmCancelDialogOpen.value = false;
};

const handleCloseAlertDialogResetPassword = () => {
    isAlertDialogResetPasswordOpen.value = false;
};

const dialogCancelDeleteVesselAgent = () => {
    isConfirmCancelDialogOpen.value = false;
};

const handleCloseAlertDialog = () => {
    isAlertCancelDialogOpen.value = false;
    getVesselAgentList(filter.value);
};

const selectRow = (row: IVesselAgentData) => {
    const menuItems = getMenuTable(row);
    if (menuItems.length > 0 && menuItems[0].length > 0) {
        const firstAction = menuItems[0][0];
        if (firstAction.click) {
            firstAction.click();
        }
    }
};
 
const filteredColumns = computed(() => columns.filter((column) => !["id", "phone", "status", "actions"].includes(column.key)));
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
    getVesselAgentList({ ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] });
};
</script>
