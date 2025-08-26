<template>
   <div>
      <div id="cargoType">
         <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6">
            <div class="flex justify-between gap-4">
               <div class="flex gap-4 w-full">
                  <Input
                     :label="$t('cargo_type')"
                     name="cargoType"
                     :placeholder="$t('search')"
                     v-model="filter.search"
                     icon="i-heroicons-magnifying-glass-20-solid"
                     class="max-w-[367px] w-full"
                     @keyup="
                        (e) => {
                           performSearch(e.target.value);
                        }
                     "
                  />
                  <USelect :label="$t('status')" name="status" placeholder="" :options="statusList" v-model="filter.status" class="max-w-[240px] w-full" />
               </div>
               <div class="content-end">
                  <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
               </div>
            </div>
         </div>
         <div id="request-form-content" class="bg-white rounded-[20px]">
            <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
               <div class="flex justify-between">
                  <h1 class="font-normal text-base text-grayy-25">{{ $t("info_cargo_type") }}</h1>
                  <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2">
                     {{ cargoTypeList.length }} {{ $t("items") }}
                  </div>
               </div>
               <div>
                  <UButton
                     class="bg-white hover:bg-white text-grayy-400 [&_span]:font-anuphan-semi-bold"
                     outlined
                     icon="i-heroicons-plus-circle"
                     size="md"
                     :label="$t('add')"
                     @click="() => handleCargoTypeForm(true, 'create')"
                  />
               </div>
            </div>
            <UTable
               @select="selectRow"
               :columns="columns"
               :rows="cargoTypeList"
               :ui="{
                  base: 'u-table-list',
               }"
            >
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
                     :type="row.status === true ? 'success' : 'error'"
                  />
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
               <template #empty-state> <EmptyNotFoundTable /></template>
            </UTable>
            <div class="flex justify-between px-6 py-3">
               <div class="flex items-center">
                  <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
                  <USelect :options="limitRowTable" v-model="filter.limit" />
               </div>

               <UPagination
                  :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                  :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
                  v-model="filter.page"
                  :total="paginationData.totalItems"
                  :page-count="filter.limit"
                  @update:modelValue="onPageChange"
               />
            </div>
         </div>
      </div>
      <CargoTypeForm
         :isDialogOpen="isDialogCargoTypeFormOpen"
         :dialogCancel="dialogCargoTypeCancel"
         :dialogConfirm="dialogCargoTypeConfirm"
         :mode="actionMode"
         :itemId="cargoTypeData?.id"
      />

      <DialogConfirm
         icon="warning"
         :title="dialogConfirmProps.title"
         :desc="dialogConfirmProps.desc"
         :label-confirm="$t('confirm')"
         :isDialogOpen="isDialogConfirmOpen"
         :dialogCancel="dialogCancel"
         :dialogConfirm="dialogConfirm"
      />
      <DialogAlert
         type="success"
         :title="dialogAlertProps.title"
         :desc="dialogAlertProps.desc"
         :isOpen="isDialogAlertOpen"
         :btn-name="$t('close')"
         :setDialog="handleCloseDialogAlert"
      />
      <Loading v-if="isLoading" />
   </div>
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import Badge from "~/components/badge/badge.vue";
import CargoTypeForm from "~/components/dialog/master-data/product/cargo-type-form.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";

import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";

import type { IFilterCargoType } from "~/core/interfaces/IFilterCargoType";
import type { ICargoTypeGet } from "~/core/interfaces/ICargoType";
import useCargoTypeService from "~/core/services/masterDataShipService/product/cargoTypeService";
const { getCargoType, updateCargoType } = useCargoTypeService();
const { t, locale } = useI18n();
const toast = useToast();
const isLoading = ref<boolean>(false);
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<IFilterCargoType>({
   limit: 10,
   page: 1,
   search: "",
   status: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const statusList = ref([
   { id: "", name: `${locale.value === "en" ? "All" : "ทุกประเภท"}` },
   { id: "true", name: `${locale.value === "en" ? "Activate" : "เปิดใช้งาน"}` },
   { id: "false", name: `${locale.value === "en" ? "Deactivate" : "ปิดใช้งาน"}` },
]);
const cargoTypeList = ref<ICargoTypeGet[]>([]);
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
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.search = "";
   filter.value.status = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   getCargoTypeList();
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
      key: "name",
      label: t("cargo_type"),
      class: "w-[200px]",
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
   getCargoTypeList();
});

const getCargoTypeList = async () => {
   isLoading.value = true;
   const resp = await getCargoType(filter.value);
   if (resp.statusCode === 200) {
      cargoTypeList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
};

const performSearch = debounce(() => {
   filter.value.page = 1;
   getCargoTypeList();
}, 500);

watch([() => filter.value.status, () => filter.value.limit], ([status, limit]) => {
   filter.value.page = 1;
   getCargoTypeList();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getCargoTypeList();
};

const actionMode = ref<string>("");
const cargoTypeData = ref<ICargoTypeGet | null>(null);
const getMenuTable = (row: ICargoTypeGet) => {
   const { status } = row;
   const items = [
      [
         {
            label: "แก้ไข",
            avatar: {
               src: EditIcon,
            },
            click: () => {
               cargoTypeData.value = row;
               handleCargoTypeForm(true, "edit");
            },
         },
         {
            label: `${status ? t("disable") : t("enable")}`,
            avatar: {
               src: `${status ? CrossIcon : CheckIcon}`,
            },
            click: () => {
               cargoTypeData.value = row;
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

const updateCargoTypeStatus = async () => {
   const body = {
      ...cargoTypeData.value!,
      status: !cargoTypeData.value?.status,
   };

   isLoading.value = true;
   const resp = await updateCargoType(cargoTypeData.value?.id!, body);
   if (resp.statusCode === 200) {
      handleResetFilter();

      dialogAlertProps.value = {
         title: `${body.status ? t("enable") : t("disable")}`,
         desc: `${body.status ? t("enable_success") : t("disable_success")}`,
      };
      isDialogAlertOpen.value = true;
      isDialogConfirmOpen.value = false;
   } else {
      console.error("update cargoType error:", resp);
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
   updateCargoTypeStatus();
};

const isDialogCargoTypeFormOpen = ref(false);
const handleCargoTypeForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogCargoTypeFormOpen.value = status;
};
const dialogCargoTypeCancel = () => {
   isDialogCargoTypeFormOpen.value = false;
};
const dialogCargoTypeConfirm = (status: boolean, type: string = "") => {
   isDialogCargoTypeFormOpen.value = status;
   if (type === "refresh") {
      filter.value.page = 1;
      getCargoTypeList();
   }
};

const selectRow = (row: ICargoTypeGet) => {
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
   getCargoTypeList();
};
</script>
