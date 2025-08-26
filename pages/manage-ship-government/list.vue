<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("vessel_management") }}</h1>
      <div>
         <UButton v-if="canCreate" @click="handleClickCreateShipGovernment" icon="i-heroicons-plus-circle" size="md"
            :label="$t('create')" />
      </div>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-4 gap-4">
         <div class="col-span-2">
            <Input label="ชื่อเรือ/หมายเลขเรือราชการ" placeholder="ค้นหา" v-model="search"
               icon="i-heroicons-magnifying-glass-20-solid" />
         </div>
         <div class="col-span-2">
            <div class="justify-end flex ml-2 mt-7">
               <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
            </div>
         </div>
      </div>
   </div>
   <div id="request-form-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-lg text-white">รายการเรือราชการทั้งหมด</h1>
            <div v-if="search || vesselType" class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{
               vesselGovernmentList.length }} รายการ</div>
         </div>
      </div>
      <UTable @select="selectRow" :columns="columns" :rows="vesselGovernmentList" :ui="{
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
         <template #name-data="{ row }">
            <div class="flex items-center">
               <UAvatar v-if="renderFlagAvatar(row.vesselFlagId)" size="xs" :src="renderFlagAvatar(row.vesselFlagId)"
                  alt="Avatar" />
               <div class="ml-3">
                  <div class="text-black font-semibold">
                     {{ row.name }}
                  </div>
                  <div class="text-grayy-75">{{ row.officialNumber }}</div>
               </div>
            </div>
         </template>
         <template #lengthOverall-data="{ row }">
            <div class="text-black font-semibold">
               {{ formatNumber(row.lengthOverall) }}
            </div>
         </template>
         <template #breadthExtreme-data="{ row }">
            <div class="text-black font-semibold">
               {{ formatNumber(row.breadthExtreme) }}
            </div>
         </template>
         <template #depth-data="{ row }">
            <div class="text-black font-semibold">
               {{ formatNumber(row.depth) }}
            </div>
         </template>
         <template #displacement-data="{ row }">
            <div class="text-black font-semibold">
               {{ formatNumber(row.displacement) }}
            </div>
         </template>
         <template #actions-data="{ row }">
            <UDropdown @click.stop :items="getMenuTable(row)" :ui="{
               rounded: 'rounded-lg',
               width: 'max-w-[158px]',
               item: {
                  base: 'hover:bg-grayy-50',
                  label: 'font-anuphan-medium text-grayy-400 ml-1',
                  size: 'text-sm',
                  avatar: {
                     base: '[&_img]:rounded-none [&_img]:w-4 [&_img]:h-4',
                  },
                  padding: 'p-[8px_6px_8px_12px]',
               },
            }">
               <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
            </UDropdown>
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
   <DialogAlert title="บันทึกข้อมูล" desc="ข้อมูลนี้ถูกบันทึกแล้ว" type="success" :isOpen="isDialogSuccessOpen"
      :setDialog="handleCloseSuccessDialog" />
   <DialogConfirm :title="'ลบ Log Book '"
      :desc="'คุณต้องการลบ Log Book นี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก'" icon="danger"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmDeleteDialogOpen" :dialogCancel="dialogCancelDeleteLogBook"
      :dialogConfirm="dialogConfirmDelete" color-confirm="red" />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import USelect from "~/components/form/u-select.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";

import type { IFilterVessel } from "~/core/interfaces/IFilterVessel";
import useVesselGovernmentService from "~/core/services/masterDataShipService/vesselGovernmentService";
import type { IVesselGovernmentData } from "~/core/interfaces/IVesselGovernmentData";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";

// const canCreate = allowPermission('create_vessel_data')
// const canView = allowPermission('view_vessel_data')
// const canEdit = allowPermission('edit_vessel_data')
// const canDelete = allowPermission('delete_vessel_data')
const canCreate = true;
const canView = true;
const canEdit = true;
const canDelete = true;
const vesselOptionsStore = useVesselOptionsStore();
console.log("canCreate=>", canCreate);
console.log("canView=>", canView);
console.log("canEdit=>", canEdit);
console.log("canDelete=>", canDelete);

const isLoading = ref(false);
const search = ref("");
const sortField = ref("");
const sortOrder = ref("");
const vesselType = ref(0);
const vesselFlag = ref(0);
const vesselGovernmentService = useVesselGovernmentService();
const filter = ref<IFilterVessel>({
   flag: 0,
   owner: "",
   type: 0,
   page: 1,
   limit: 10,
   search: "",
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});
const vesselGovernmentList = ref<IVesselGovernmentData[]>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});
const vesselFlagData = ref({
   avatar: "",
   flagName: "",
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

const getActionsList = () => {
   const action = [];
   if (canView) {
      action.push({
         key: "view",
         icon: "eye",
         label: "ดู",
      });
   }

   if (canEdit) {
      action.push({
         key: "edit",
         icon: "edit-2",
         label: "แก้ไข",
      });
   }
   action.push({
      key: "delete",
      icon: "edit-2",
      label: "ลบ",
   });
   return action;
};
const rowId = ref(0);
const getMenuTable = (row) => {
   const { id, status } = row;
   const items = [
      [
         {
            label: "ดู",
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               navigateTo(`/manage-ship-government/view?id=${id}`);
            },
         },
         {
            label: "แก้ไข",
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`/manage-ship-government/edit?id=${id}`);
            },
         },
         {
            label: "ลบ",
            avatar: {
               src: DeleteIcon,
            },
            click: () => {
               isConfirmDeleteDialogOpen.value = true;
               rowId.value = row.id;
            },
         },
      ],
   ];
   return items;
};
const handleClickResetFitler = () => {
   search.value = "";
   filter.value.page = 1;
   filter.value.limit = 10;
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   getVesselGovernmentList({
      ...filter.value,
      page: 1,
      limit: 10,
      search: "",
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};

const handleClickCreateShipGovernment = () => {
   navigateTo("/manage-ship-government/create");
};

const columns = [
   {
      key: "id",
      label: "ลำดับ",
   },
   {
      key: "name",
      label: "ชื่อเรือ/หมายเลขเรือราชการ",
   },
   {
      key: "lengthOverall",
      label: "ความยาว(LOA)",
   },
   {
      key: "breadthExtreme",
      label: "ความยาว(Breadth)",
   },
   {
      key: "depth",
      label: "กินน้ำลึก(Depth)",
   },
   {
      key: "displacement",
      label: "ระวางขับน้ำ(Displacement)",
   },
   {
      key: "actions",
      sortable: false,
   },
];

onMounted(() => {
   getVesselGovernmentList(filter.value);
});
const renderFlagAvatar = (vesselFlagId: number) => {
   if (vesselFlagId) {
      const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === vesselFlagId);
      if (findVesselFlag) {
         return findVesselFlag.path;
      }
      return "";
   }
   return "";
};
const getVesselGovernmentList = async (filter: any) => {
   try {
      isLoading.value = true;
      const resp = await vesselGovernmentService.getVesselGovernment(filter);
      if (resp.statusCode === 200) {
         vesselGovernmentList.value = resp.data.data;
         console.log("getVesselGovernmentList", resp);
         paginationData.value.totalItems = resp.data.totalItems;
         paginationData.value.totalPages = resp.data.totalPages;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

const handleClickByAction = (key: string, id: number) => {
   switch (key) {
      case "view":
         navigateTo(`/manage-ship-government/view?id=${id}`);
         break;
      default:
         break;
   }
};

const performSearch = debounce((query: any) => {
   filter.value.search = query;
   filter.value.page = 1;
   getVesselGovernmentList({
      ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
}, 500);

watch(search, (newVal) => {
   performSearch(newVal);
});

watch(
   () => filter.value.page,
   (value) => {
      getVesselGovernmentList({
         ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getVesselGovernmentList({
         ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
      });
   }
);
const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

const isConfirmDeleteDialogOpen = ref(false);

const dialogConfirmDelete = async () => {
   isLoading.value = true;
   if (rowId) {
      const resp = await vesselGovernmentService.deleteVesselGovernment(rowId.value);
      if (resp.statusCode === 200) {
         isDialogSuccessOpen.value = true;
      } else {
         isDialogSuccessOpen.value = true;
      }
      getVesselGovernmentList(filter.value);
   }

   isLoading.value = false;
   isConfirmDeleteDialogOpen.value = false;
};
const dialogCancelDeleteLogBook = () => {
   isConfirmDeleteDialogOpen.value = false;
};

const selectRow = (row: IVesselGovernmentData) => {
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
   getVesselGovernmentList({ ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] });
};
</script>
