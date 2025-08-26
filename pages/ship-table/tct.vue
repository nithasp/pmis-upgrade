<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-grayy-400">{{ $t("tct_boat_schedule") }}</h1>
   <div id="tct" class="pb-5">
      <div class="tct-docking-list mt-[26px]">
         <h2 class="font-anuphan-bold text-lg text-grayy-400 mb-6">{{ $t("tct_docking_list") }}</h2>
         <div class="bg-white rounded-[20px]">
            <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
               <div class="flex justify-between">
                  <h1 class="font-normal text-base text-grayy-25">{{ $t("all_tct_docking_ships") }}</h1>
                  <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">{{
                     tctList.length }} {{ $t("items") }}</div>
               </div>
            </div>
            <UTable @select="selectRowTct" :ui="{
               base: 'u-table-list',
            }" :rows="tctList" :columns="columnTct">

               <template v-for="column in filteredColumnsTct" :key="column.key" v-slot:[column.key+'-header']>
                  <div @click="toggleSortTct(column.key)" class="cursor-pointer flex items-center">
                     <span>{{ column.label }}</span>
                     <span v-if="sortFieldTct === mapColumnToSortFieldTct(column.key) && sortOrderTct === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else-if="sortFieldTct === mapColumnToSortFieldTct(column.key) && sortOrderTct === 'desc'">
                        <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else>
                        <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                     </span>
                  </div>
               </template>

               <template #id-data="{ index }">
                  <div class="text-center">
                     {{ index + 1 }}
                  </div>
               </template>

               <template #eta-data="{ row }">
                  <div>{{ row.eta ? renderDateFormat(row.eta) : "" }}</div>
                  <div class="text-grayy-75">{{ row.eta ? renderTimeFormat(row.eta) : "" }}</div>
               </template>

               <template #etd-data="{ row }">
                  <div>{{ row.etd ? renderDateFormat(row.etd) : "" }}</div>
                  <div class="text-grayy-75">{{ row.etd ? renderTimeFormat(row.etd) : "" }}</div>
               </template>

               <template #grt-data="{ row }">
                  <div>
                     {{ getInputDecimal(row.grt?.toString(), 3) }}
                  </div>
               </template>

               <template #loa-data="{ row }">
                  <div>
                     {{ getInputDecimal(row.loa?.toString(), 3) }}
                  </div>
               </template>

               <template #vesselInfo-data="{ row }">
                  <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                     <div>
                        <img :src="row.vesselFlagImage" :alt="row.vesselFlagName" class="w-6 h-6 rounded-[50%]" />
                     </div>
                     <div>
                        <h3 class="text-grayy-900 font-anuphan-medium">{{ row.vesselName }}</h3>
                        <p class="text-grayy-600">{{ row.imoNumber }}/{{ row.officialNumber }}</p>
                     </div>
                  </div>
               </template>

               <template #berthSaveDate-data="{ row }">
                  <div>{{ row.berthSaveDate ? renderDateFormat(row.berthSaveDate) : "" }}</div>
                  <div class="text-grayy-75">{{ row.berthSaveDate ? renderTimeFormat(row.berthSaveDate) : "" }}</div>
               </template>

               <template #approveDate-data="{ row }">
                  <div>{{ row.approveDate ? renderDateFormat(row.approveDate) : "" }}</div>
                  <div class="text-grayy-75">{{ row.approveDate ? renderTimeFormat(row.approveDate) : "" }}</div>
               </template>

               <template #actions-data="{ row }">
                  <UDropdown :items="getMenuTable(row, 'tct')" @click.stop>
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </template>
            </UTable>
         </div>
      </div>

      <div class="tct-waiting-docking-list mt-[26px]">
         <h2 class="font-anuphan-bold text-lg text-grayy-400 mb-6">{{ $t("ships_waiting_to_dock_at_tct") }}</h2>
         <div class="bg-white rounded-[20px]">
            <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
               <div class="flex justify-between">
                  <h1 class="font-normal text-base text-grayy-25">{{ $t("all_ships_waiting_to_dock_at_tct") }}</h1>
                  <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">
                     {{ tctWaitingList.length }} {{ $t("items") }}
                  </div>
               </div>
            </div>
            <UTable @select="selectRowTctWaiting" :ui="{
               base: 'u-table-list',
            }" :rows="tctWaitingList" :columns="columnTctWaiting">

               <template v-for="column in filteredColumnsTctWaiting" :key="column.key" v-slot:[column.key+'-header']>
                  <div @click="toggleSortTctWaiting(column.key)" class="cursor-pointer flex items-center">
                     <span>{{ column.label }}</span>
                     <span v-if="sortFieldTctWaiting === mapColumnToSortFieldTctWaiting(column.key) && sortOrderTctWaiting === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else-if="sortFieldTctWaiting === mapColumnToSortFieldTctWaiting(column.key) && sortOrderTctWaiting === 'desc'">
                        <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else>
                        <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                     </span>
                  </div>
               </template>

               <template #id-data="{ index }">
                  <div class="text-center">
                     {{ index + 1 }}
                  </div>
               </template>

               <template #eta-data="{ row }">
                  <div>{{ row.eta ? renderDateFormat(row.eta) : "" }}</div>
                  <div class="text-grayy-75">{{ row.eta ? renderTimeFormat(row.eta) : "" }}</div>
               </template>

               <template #etb-data="{ row }">
                  <div>{{ row.etb ? renderDateFormat(row.etb) : "" }}</div>
                  <div class="text-grayy-75">{{ row.etb ? renderTimeFormat(row.etb) : "" }}</div>
               </template>

               <template #etd-data="{ row }">
                  <div>{{ row.etd ? renderDateFormat(row.etd) : "" }}</div>
                  <div class="text-grayy-75">{{ row.etd ? renderTimeFormat(row.etd) : "" }}</div>
               </template>

               <template #grt-data="{ row }">
                  <div>
                     {{ getInputDecimal(row.grt?.toString(), 3) }}
                  </div>
               </template>

               <template #loa-data="{ row }">
                  <div>
                     {{ getInputDecimal(row.loa?.toString(), 3) }}
                  </div>
               </template>

               <template #vesselInfo-data="{ row }">
                  <div class="grid grid-cols-[24px_1fr] items-center gap-3">
                     <div>
                        <img :src="row.vesselFlagImage" :alt="row.vesselFlagName" class="w-6 h-6 rounded-[50%]" />
                     </div>
                     <div>
                        <h3 class="text-grayy-900 font-anuphan-medium">{{ row.vesselName }}</h3>
                        <p class="text-grayy-600">{{ row.imoNumber }}/{{ row.officialNumber }}</p>
                     </div>
                  </div>
               </template>

               <template #approveDate-data="{ row }">
                  <div>{{ row.approveDate ? renderDateFormat(row.approveDate) : "" }}</div>
                  <div class="text-grayy-75">{{ row.approveDate ? renderTimeFormat(row.approveDate) : "" }}</div>
               </template>

               <template #actions-data="{ row }">
                  <UDropdown :items="getMenuTable(row, 'tctWaiting')" @click.stop>
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </template>
            </UTable>
         </div>
      </div>
   </div>
   <MitForm :isDialogOpen="isDialogTctFormOpen" :dialogCancel="dialogTctCancel" :dialogConfirm="dialogTctConfirm"
      :mode="actionMode" :itemData="itemDataTct" />
   <MitWaitingForm :isDialogOpen="isDialogTctWaitingFormOpen" :dialogCancel="dialogTctWaitingCancel"
      :dialogConfirm="dialogTctWaitingConfirm" :mode="actionMode" :itemData="itemDataTctWaiting" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Loading from "~/components/loading.vue";
import MitForm from "~/components/dialog/ship-table/mit/mit-form.vue";
import MitWaitingForm from "~/components/dialog/ship-table/mit/mit-waiting-form.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import useDocumentService from "~/core/services/documentService";
import type { IDocumentBerthTct, IDocumentVesselInMit, IDocumentVesselInTct } from "~/core/interfaces/IShipTable";
import { RoleTypeEnum } from "~/utils/enums/RoleTypeEnum";

const documentService = useDocumentService();
const authStore = useAuthStore();
const { t } = useI18n();
const isLoading = ref<boolean>(false);
const isAgency = authStore.profileUser.roleType === RoleTypeEnum.Agency;

const tctList = ref<IDocumentBerthTct[]>([]);
const tctWaitingList = ref<IDocumentVesselInTct[]>([]);
const itemDataTct = ref<any>();
const itemDataTctWaiting = ref<any>();
const actionMode = ref<string>("");

const columnTct = computed(() => {
  const cols: any = [
    {
      key: 'id',
      label: t('number_no'),
      class: 'w-[60px] text-center',
    },
    {
      key: 'eta',
      label: t('eta'),
      class: 'text-center',
    },
    {
      key: 'vesselInfo',
      label: t('vn_imo_on'),
    },
    {
      key: 'grt',
      label: t('grt'),
    },
    {
      key: 'loa',
      label: t('loa'),
    },
    {
      key: 'berthSaveDate',
      label: t('berth_time'),
    },
    {
      key: 'jettyName',
      label: t('jettys_list'),
    },
    {
      key: 'etd',
      label: t('etd'),
    },
    {
      key: 'cargoWorkTime',
      label: t('cargo_work_time'),
    },
    {
      key: 'agencyName',
      label: t('shipping_agent_company_name'),
    },
    {
      key: 'approveDate',
      label: t('approval_date'),
    },
  ];
  if (!isAgency) {
    cols.push({ key: 'actions', sortable: false });
  }
  return cols;
});

const columnTctWaiting = computed(() => {
  const cols: any = [
    {
      key: 'id',
      label: t('number_no'),
      class: 'w-[60px] text-center',
    },
    {
      key: 'eta',
      label: t('eta'),
      class: 'text-center',
    },
    {
      key: 'vesselInfo',
      label: t('vn_imo_on'),
    },
    {
      key: 'grt',
      label: t('grt'),
    },
    {
      key: 'loa',
      label: t('loa'),
    },
    {
      key: 'etb',
      label: t('etb'),
    },
    {
      key: 'jettyName',
      label: t('jettys_list'),
    },
    {
      key: 'etd',
      label: t('etd'),
    },
    {
      key: 'cargoWorkTime',
      label: t('cargo_work_time'),
    },
    {
      key: 'agencyName',
      label: t('shipping_agent_company_name'),
    },
    {
      key: 'approveDate',
      label: t('approval_date'),
    },
  ];
  if (!isAgency) {
    cols.push({ key: 'actions', sortable: false });
  }
  return cols;
});

onMounted(() => {
   getTableData();
});

const getTableData = async () => {
   isLoading.value = true;
   const respVesselInTct = await documentService.getDocumentVesselIn("tct");
   const respBerthTct = await documentService.getDocumentBerth("tct");

   tctList.value = respVesselInTct.data;
   tctWaitingList.value = respBerthTct.data;
   isLoading.value = false;
};

const getDocumentVesselIn = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentVesselIn("tct", filterTct.value);
   if (resp.statusCode === 200) {
      tctList.value = resp.data;
   }
   isLoading.value = false;
};

const getDocumentBerth = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentBerth("tct", filterTctWaiting.value);
   if (resp.statusCode === 200) {
      tctWaitingList.value = resp.data;
   }
   isLoading.value = false;
};

const getMenuTable = (row: any, type: string) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               if (type === "tct") {
                  handleTctForm(true, "edit");
                  itemDataTct.value = row;
               }
               if (type === "tctWaiting") {
                  handleTctWaitingForm(true, "edit");
                  itemDataTctWaiting.value = row;
               }
            },
         },
      ],
   ];
   return items;
};

const isDialogTctFormOpen = ref(false);
const handleTctForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogTctFormOpen.value = status;
};
const dialogTctCancel = () => {
   isDialogTctFormOpen.value = false;
};
const dialogTctConfirm = (status: boolean, type: string = "") => {
   isDialogTctFormOpen.value = status;
   if (type === "refresh") {
      getDocumentVesselIn();
   }
};

const isDialogTctWaitingFormOpen = ref(false);
const handleTctWaitingForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogTctWaitingFormOpen.value = status;
};
const dialogTctWaitingCancel = () => {
   isDialogTctWaitingFormOpen.value = false;
};
const dialogTctWaitingConfirm = (status: boolean, type: string = "") => {
   isDialogTctWaitingFormOpen.value = status;
   if (type === "refresh") {
      getDocumentBerth();
   }
};

const selectRowTct = (row: any, type = 'tct') => {
   if(isAgency) return;
   const menuItems = getMenuTable(row, type);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};
const selectRowTctWaiting = (row: any, type = 'tctWaiting') => {
   if(isAgency) return;
   const menuItems = getMenuTable(row, type);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const sortFieldTct = ref("");
const sortOrderTct = ref("");
const filterTct = ref({
   Order: [{ column: sortFieldTct.value, dir: sortOrderTct.value }]
});
const filteredColumnsTct = computed(() =>
   columnTct.value.filter((column: any) => !["id", "actions"].includes(column.key))
);
const sortMappingTct: Record<string, string> = {
   vesselInfo: "vesselName",
};
const mapColumnToSortFieldTct = (column: string): string => {
   return sortMappingTct[column] || column;
};
const toggleSortTct = (column: string) => {
   const sortColumn = mapColumnToSortFieldTct(column);
   if (sortFieldTct.value !== sortColumn) {
      sortFieldTct.value = sortColumn;
      sortOrderTct.value = "asc";
   } else {
      if (sortOrderTct.value === "asc") {
         sortOrderTct.value = "desc";
      } else if (sortOrderTct.value === "desc") {
         sortFieldTct.value = "";
         sortOrderTct.value = "";
      } else {
         sortOrderTct.value = "asc";
      }
   }
   filterTct.value.Order = [{ column: sortFieldTct.value, dir: sortOrderTct.value }];
   getDocumentVesselIn();
};

const sortFieldTctWaiting = ref("");
const sortOrderTctWaiting = ref("");
const filterTctWaiting = ref({
   Order: [{ column: sortFieldTctWaiting.value, dir: sortOrderTctWaiting.value }]
});
const filteredColumnsTctWaiting = computed(() =>
   columnTctWaiting.value.filter((column: any) => !["id", "actions"].includes(column.key))
);
const sortMappingTctWaiting: Record<string, string> = {
   vesselInfo: "vesselName",
};
const mapColumnToSortFieldTctWaiting = (column: string): string => {
   return sortMappingTctWaiting[column] || column;
};
const toggleSortTctWaiting = (column: string) => {
   const sortColumn = mapColumnToSortFieldTctWaiting(column);
   if (sortFieldTctWaiting.value !== sortColumn) {
      sortFieldTctWaiting.value = sortColumn;
      sortOrderTctWaiting.value = "asc";
   } else {
      if (sortOrderTctWaiting.value === "asc") {
         sortOrderTctWaiting.value = "desc";
      } else if (sortOrderTctWaiting.value === "desc") {
         sortFieldTctWaiting.value = "";
         sortOrderTctWaiting.value = "";
      } else {
         sortOrderTctWaiting.value = "asc";
      }
   }
   filterTctWaiting.value.Order = [{ column: sortFieldTctWaiting.value, dir: sortOrderTctWaiting.value }];
   getDocumentBerth();
};
</script>
