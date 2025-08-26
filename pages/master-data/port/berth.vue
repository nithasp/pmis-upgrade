<template>
   <div id="berth">
      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex flex-col md:flex-row gap-4 w-full">
          <Input
            :label="$t('search_label')"
            name="search"
            :placeholder="$t('search_placeholder')"
            v-model="filter.search"
            icon="i-heroicons-magnifying-glass-20-solid"
            class="w-full md:max-w-[367px]"
          />
          <USelect
            :label="$t('vessel_type_label')"
            name="vesselType"
            :placeholder="$t('vessel_type_placeholder')"
            :options="vesselTypeList"
            v-model="filter.vessel_type_id"
            class="w-full md:max-w-[240px]"
          />
        </div>
        <div class="flex justify-end md:items-end">
          <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
        </div>
      </div>
    </div>
      <div id="request-form-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-base text-grayy-25">{{ $t("berth_info") }}</h1>
               <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">{{
                  berthList.length }} {{ $t("items") }}</div>
            </div>
            <div>
               <UButton class="bg-white hover:bg-white text-grayy-400 [&_span]:font-anuphan-semi-bold" outlined
                  icon="i-heroicons-plus-circle" size="md" :label="$t('add')"
                  @click="() => handleBerthForm(true, 'create')" />
            </div>
         </div>
         <UTable @select="selectRow" :columns="columns" :rows="berthList" :ui="{
            base: 'u-table-list',
         }">
            <template v-for="column in filteredColumns" :key="column.key" v-slot:[column.key+'-header']>
               <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
                  <span>{{ column.label }}</span>
                  <span
                     v-if="sortField === (column.key === 'name' ? 'name_th' : column.key) && sortOrder === 'asc'">
                     <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span
                     v-else-if="sortField === (column.key === 'name' ? 'name_th' : column.key) && sortOrder === 'desc'">
                     <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span v-else>
                     <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
               </div>
            </template>
            <template #id-data="{ index }">
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>
            <template #status-data="{ row }">
               <Badge
                  :label="row.status === true ? $t('vessel_flag_table_status_activate') : $t('vessel_flag_table_status_disable')"
                  :type="row.status === true ? 'success' : 'error'" />
            </template>
            <template #name-data="{ row }">
               <div class="text-grayy-400 text-sm font-anuphan-medium">{{ row.name_th }}</div>
               <div class="text-grayy-75 text-sm">{{ row.name_en }}</div>
            </template>
            <template #jettysList-data="{ row }">
               <div class="flex flex-wrap w-[140px] text-grayy-75">
                  <div v-for="(item, index) in row.jettys" :key="item.id">
                     <span>{{ item.name }}</span>
                     <span v-if="index !== row.jettys.length - 1">,</span>
                  </div>
               </div>
            </template>
            <template #updated_at-data="{ row }">
               <div>{{ renderDateFormat(row.updated_at) }}</div>
               <div class="text-grayy-75">{{ renderTimeFormat(row.updated_at) }}</div>
            </template>
            <template #actions-data="{ row }">
               <div class="text-right">
                  <UDropdown :items="getMenuTable(row)" @click.stop>
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </div>
            </template>
            <template #empty-state>
               <EmptyNotFoundTable />
            </template>
         </UTable>
         <div class="flex justify-between px-6 py-3 overflow-auto">
            <div class="flex items-center">
               <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
               <USelect :options="limitRowTable" v-model="filter.limit" />
            </div>

            <UPagination
               :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: $t('prev'), color: 'gray' }"
               :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: $t('next'), color: 'gray' }"
               v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit"
               @update:modelValue="onPageChange" />
         </div>
      </div>
   </div>
   <BerthForm :isDialogOpen="isDialogBerthFormOpen" :dialogCancel="dialogBerthCancel"
      :dialogConfirm="dialogBerthConfirm" :mode="actionMode" :itemId="berthData?.id" />
   <DialogConfirm icon="warning" :title="dialogConfirmProps.title" :desc="dialogConfirmProps.desc"
      :labelConfirm="$t('confirm')" :isDialogOpen="isDialogConfirmOpen" :dialogCancel="dialogCancel"
      :dialogConfirm="dialogConfirm" />
   <DialogAlert type="success" :title="dialogAlertProps.title" :desc="dialogAlertProps.desc" :isOpen="isDialogAlertOpen"
      :btnName="$t('close')" :setDialog="handleCloseDialogAlert" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import Badge from "~/components/badge/badge.vue";
import BerthForm from "~/components/dialog/master-data/port/berth-form.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import type { IBerthGet } from "~/core/interfaces/IBerth";
import type { IFilterBerth } from "~/core/interfaces/IFilterBerth";
import type { IVesselTypeList } from "~/core/interfaces/IVessel";
import type { IFilterVesselType } from "~/core/interfaces/IFilterVesselType";

import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";

import useBerthService from "~/core/services/masterDataShipService/port/berthService";
import masterDataShipService from "~/core/services/masterDataShipService/vesselService";
const { getBerth, updateBerth } = useBerthService();
const { getVesselType } = masterDataShipService();
const { t } = useI18n();
const toast = useToast();
const isLoading = ref<boolean>(false);
const allowFetch = ref<boolean>(true);
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<IFilterBerth>({
   limit: 10,
   page: 1,
   search: "",
   vessel_type_id: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const filterVesselType = ref<IFilterVesselType>({
   limit: -1,
   page: 1,
   search: "",
   status: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const berthList = ref<IBerthGet[]>([]);
const vesselTypeList = ref<IVesselTypeList[]>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});

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

const handleResetFilter = () => {
   allowFetch.value = true;
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.search = "";
   filter.value.vessel_type_id = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
};

const columns = [
   {
      key: "id",
      label: t("id"),
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: t("status"),
      class: "w-[97px] text-center",
   },
   {
      key: "name_alt",
      label: t("name_alt"),
      class: "w-[89px]",
   },
   {
      key: "name",
      label: t("name"),
   },
   {
      key: "jettysList",
      label: t("jettys_list"),
      class: "w-[140px]",
   },
   {
      key: "berth_type_name",
      label: t("vessel_type_name"),
   },
   {
      key: "updated_at",
      label: t("updated_at"),
   },
   {
      key: "updated_by",
      label: t("updated_by"),
   },
   {
      key: "actions",
      sortable: false,
   },
];

onMounted(() => {
   getBerthList();
   getVesselTypeList();
});

const getBerthList = async () => {
   isLoading.value = true;
   const resp = await getBerth(filter.value);
   if (resp.statusCode === 200) {
      berthList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
};

const getVesselTypeList = async () => {
   isLoading.value = true;
   const filterParams = convertObjToQueryString(filterVesselType.value);
   const resp = await getVesselType(filterParams);
   if (resp.statusCode === 200) {
      vesselTypeList.value = resp.data.data;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      vessel_type_id: filter.value.vessel_type_id,
      search: filter.value.search,
   }),
   (newValue, oldValue) => {
      if (newValue.search !== oldValue.search && newValue.search) {
         handleFilterSearch(500);
      } else if (newValue.page !== oldValue.page) {
         filter.value.page = newValue.page;
         if (allowFetch.value) {
            handleFilterSearch(0);
         }
      } else {
         handleFilterSearch(0);
      }
   }
);

const handleFilterSearch = debounceFilterSearch(() => {
   filter.value.page = 1;
   getBerthList();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getBerthList();
};

const actionMode = ref<string>("");
const berthData = ref<any>(null);
const getMenuTable = (row: IBerthGet) => {
   const { status } = row;
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               berthData.value = row;
               handleBerthForm(true, "edit");
            },
         },
         {
            label: `${status ? t("disable") : t("enable")}`,
            avatar: {
               src: `${status ? CrossIcon : CheckIcon}`,
            },
            click: () => {
               berthData.value = row;
               dialogConfirmProps.value = {
                  title: `${status ? t("disable") : t("enable")}`,
                  desc: `${status ? t("disable_confirm") : t("enable_confirm")}`,
               };
               isDialogConfirmOpen.value = true;
            },
         },
      ],
   ];
   return items;
};

const updateBerthStatus = async () => {
   const body = {
      ...berthData.value!,
      status: !berthData.value?.status,
   };

   isLoading.value = true;
   const resp = await updateBerth(berthData.value?.id!, body);
   if (resp.statusCode === 200) {
      handleResetFilter();

      dialogAlertProps.value = {
         title: `${body.status ? t("enable") : t("disable")}`,
         desc: `${body.status ? t("enable_success") : t("disable_success")}`,
      };
      isDialogAlertOpen.value = true;
      isDialogConfirmOpen.value = false;
   } else {
      console.error("update berth error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

const dialogAlertProps = ref({
   title: "",
   desc: "",
});
const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
};

const isDialogBerthFormOpen = ref(false);
const handleBerthForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogBerthFormOpen.value = status;
};
const dialogBerthCancel = () => {
   isDialogBerthFormOpen.value = false;
};
const dialogBerthConfirm = (status: boolean, type: string = "") => {
   isDialogBerthFormOpen.value = status;
   if (type === "refresh") {
      filter.value.page = 1;
      getBerthList();
   }
};

const dialogConfirmProps = ref({
   title: "",
   desc: "",
});
const isDialogConfirmOpen = ref(false);
const dialogCancel = () => {
   isDialogConfirmOpen.value = false;
};
const dialogConfirm = () => {
   updateBerthStatus();
};

const selectRow = (row: IBerthGet) => {
   const menuItems = getMenuTable(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const toggleSort = (column: string) => {
   let sortColumn = column;
   if (column === "name") {
      sortColumn = "name_th";
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
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   filter.value.page = 1;
   getBerthList();
};
</script>
