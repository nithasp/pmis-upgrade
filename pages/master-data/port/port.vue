<template>
   <div id="port">
      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex flex-col md:flex-row gap-4 w-full">
          <Input
            :label="$t('locode_port')"
            name="locode"
            :placeholder="$t('search')"
            v-model="filter.search"
            icon="i-heroicons-magnifying-glass-20-solid"
            class="w-full md:max-w-[367px]"
          />
          <USelect
            :label="$t('country')"
            name="country_id"
            :placeholder="$t('search_country')"
            :options="countryOption"
            v-model="filter.country_id"
            searchable
            class="w-full md:max-w-[240px]"
          />
          <USelect
            :label="$t('status')"
            name="status"
            placeholder=""
            :options="statusList"
            v-model="filter.status"
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
               <h1 class="font-normal text-base text-grayy-25">{{ $t("port_info") }}</h1>
               <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">{{
                  portList.length }} {{ $t("items") }}</div>
            </div>
            <div>
               <UButton class="bg-white hover:bg-white text-grayy-400 [&_span]:font-anuphan-semi-bold" outlined
                  icon="i-heroicons-plus-circle" size="md" :label="$t('add')"
                  @click="() => handlePortForm(true, 'create')" />
            </div>
         </div>
         <UTable @select="selectRow" :columns="columns" :rows="portList" :ui="{
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
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>
            <template #status-data="{ row }">
               <Badge
                  :label="row.status === true ? $t('vessel_flag_table_status_activate') : $t('vessel_flag_table_status_disable')"
                  :type="row.status === true ? 'success' : 'error'" />
            </template>
            <template #updated_at-data="{ row }">
               <div>{{ renderDateFormat(row.updated_at) }}</div>
               <div class="text-grayy-75">{{ renderTimeFormat(row.updated_at) }}</div>
            </template>
            <template #country-data="{ row }">
               <div class="text-grayy-75">{{ getCountryValue(row.country_id) }}</div>
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

            <UPagination :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
               :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
               v-model="filter.page" :total="paginationData.totalItems" :page-count="filter.limit"
               @update:modelValue="onPageChange" />
         </div>
      </div>
   </div>
   <PortForm :isDialogOpen="isDialogPortFormOpen" :dialogCancel="dialogPortCancel" :dialogConfirm="dialogPortConfirm"
      :mode="actionMode" :itemId="portData?.id" />

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
import PortForm from "~/components/dialog/master-data/port/port-form.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";

import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";

import type { IFilterPort } from "~/core/interfaces/IFilterPort";
import type { IPortGet } from "~/core/interfaces/IPort";
import type { ICountries } from "~/core/interfaces/ICountries";
import usePortService from "~/core/services/masterDataShipService/port/portService";
import useMasterDataService from "~/core/services/masterDataService";
const { getPort, updatePort } = usePortService();
const { getCountries } = useMasterDataService();
const { t, locale } = useI18n();
const toast = useToast();
const isLoading = ref<boolean>(false);
const allowFetch = ref<boolean>(true);
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<any>({
   country_id: "",
   limit: 10,
   page: 1,
   search: "",
   status: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const statusList = ref<any>([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   { id: "true", name: `${locale.value === "en" ? "Activate" : "เปิดใช้งาน"}` },
   { id: "false", name: `${locale.value === "en" ? "Deactivate" : "ปิดใช้งาน"}` },
]);

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
   filter.value.country_id = "";
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.search = "";
   filter.value.status = "";
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
      key: "locode",
      label: t("locode"),
   },
   {
      key: "name",
      label: t("name"),
   },
   {
      key: "country",
      label: t("country"),
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

const portList = ref<IPortGet[]>([]);
const countryOption = ref<ICountries[]>([
   {
      id: "",
      name: `${locale.value === "en" ? "All" : "ทั้งหมด"}`,
   },
]);
onMounted(() => {
   getPortList();
   getCountriesOptions();
});

const getPortList = async () => {
   isLoading.value = true;
   const resp = await getPort(filter.value);
   if (resp.statusCode === 200) {
      portList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      status: filter.value.status,
      search: filter.value.search,
      country_id: filter.value.country_id,
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

const handleFilterSearch = debounceFilterSearch(
   () => {
      filter.value.page = 1;
      getPortList();
   }
);

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getPortList();
};

const actionMode = ref<string>("");
const portData = ref<IPortGet | null>(null);
const getMenuTable = (row: IPortGet) => {
   const { status } = row;
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               portData.value = row;
               handlePortForm(true, "edit");
            },
         },
         {
            label: `${status ? t("disable") : t("enable")}`,
            avatar: {
               src: `${status ? CrossIcon : CheckIcon}`,
            },
            click: () => {
               portData.value = row;
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

const getCountriesOptions = async () => {
   const resp = await getCountries();
   if (resp.statusCode === 200) {
      countryOption.value.push(...resp.data.map((item: ICountries) => ({ id: item.id, name: locale.value === "en" ? item.nameEn : item.nameTh })));
   }
};

const getCountryValue = (country_id: number) => {
   const countryName = countryOption.value.find((item) => item.id === country_id)?.name;
   return countryName;
};

const updatePortStatus = async () => {
   const body = {
      ...portData.value!,
      status: !portData.value?.status,
   };

   isLoading.value = true;
   const resp = await updatePort(portData.value?.id!, body);
   if (resp.statusCode === 200) {
      handleResetFilter();

      dialogAlertProps.value = {
         title: `${body.status ? t("enable") : t("disable")}`,
         desc: `${body.status ? t("enable_success") : t("disable_success")}`,
      };
      isDialogAlertOpen.value = true;
      isDialogConfirmOpen.value = false;
   } else {
      console.error("update port error:", resp);
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

const dialogConfirmProps = ref({
   title: "",
   desc: "",
});
const isDialogConfirmOpen = ref(false);
const dialogCancel = () => {
   isDialogConfirmOpen.value = false;
};
const dialogConfirm = () => {
   updatePortStatus();
};

const isDialogPortFormOpen = ref(false);
const handlePortForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogPortFormOpen.value = status;
};
const dialogPortCancel = () => {
   isDialogPortFormOpen.value = false;
};
const dialogPortConfirm = (status: boolean, type: string = "") => {
   isDialogPortFormOpen.value = status;
   if (type === "refresh") {
      filter.value.page = 1;
      getPortList();
   }
};

const selectRow = (row: IPortGet) => {
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
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   filter.value.page = 1;
   getPortList();
};
</script>
