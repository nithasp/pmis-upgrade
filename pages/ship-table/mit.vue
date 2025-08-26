<template>
   <h1 class="font-anuphan-semi-bold text-[30px] text-grayy-400">{{ $t("mit_boat_schedule") }}</h1>
   <div id="mit" class="pb-5">
      <div class="mit-docking-list mt-[26px]">
         <h2 class="font-anuphan-bold text-lg text-grayy-400 mb-6">{{ $t("mit_docking_list") }}</h2>
         <div class="bg-white rounded-[20px]">
            <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
               <div class="flex justify-between">
                  <h1 class="font-normal text-base text-grayy-25">{{ $t("all_mit_docking_ships") }}</h1>
                  <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2
                  whitespace-nowrap h-6 self-center
                  ">{{
                     mitList.length }} {{ $t("items") }}</div>
               </div>
            </div>
            <UTable @select="selectRowMit" :ui="{
               base: 'u-table-list',
            }" :rows="mitList" :columns="columnMit">

               <template v-for="column in filteredColumnsMit" :key="column.key" v-slot:[column.key+'-header']>
                  <div @click="toggleSortMit(column.key)" class="cursor-pointer flex items-center">
                     <span>{{ column.label }}</span>
                     <span v-if="sortFieldMit === mapColumnToSortFieldMit(column.key) && sortOrderMit === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span v-else-if="sortFieldMit === mapColumnToSortFieldMit(column.key) && sortOrderMit === 'desc'">
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

               <template #actions-data="{ row }" >
                  <UDropdown :items="getMenuTable(row, 'mit')" @click.stop>
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </template>
            </UTable>
         </div>
      </div>

      <div class="mit-waiting-docking-list mt-[26px]">
         <h2 class="font-anuphan-bold text-lg text-grayy-400 mb-6">{{ $t("ships_waiting_to_dock_at_mit") }}</h2>
         <div class="bg-white rounded-[20px]">
            <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
               <div class="flex justify-between">
                  <h1 class="font-normal text-base text-grayy-25">{{ $t("all_ships_waiting_to_dock_at_mit") }}</h1>
                  <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 whitespace-nowrap h-6 self-center">
                     {{ mitWaitingList.length }} {{ $t("items") }}
                  </div>
               </div>
            </div>
            <UTable @select="selectRowMitWaiting" :ui="{
               base: 'u-table-list',
            }" :rows="mitWaitingList" :columns="columnMitWaiting">

               <template v-for="column in filteredColumnsMitWaiting" :key="column.key" v-slot:[column.key+'-header']>
                  <div @click="toggleSortMitWaiting(column.key)" class="cursor-pointer flex items-center">
                     <span>{{ column.label }}</span>
                     <span
                        v-if="sortFieldMitWaiting === mapColumnToSortFieldMitWaiting(column.key) && sortOrderMitWaiting === 'asc'">
                        <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                     </span>
                     <span
                        v-else-if="sortFieldMitWaiting === mapColumnToSortFieldMitWaiting(column.key) && sortOrderMitWaiting === 'desc'">
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
                  <UDropdown :items="getMenuTable(row, 'mitWaiting')" @click.stop>
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </template>
            </UTable>
         </div>
      </div>
   </div>
   <MitForm :isDialogOpen="isDialogMitFormOpen" :dialogCancel="dialogMitCancel" :dialogConfirm="dialogMitConfirm"
      :mode="actionMode" :itemData="itemDataMit" />
   <MitWaitingForm :isDialogOpen="isDialogMitWaitingFormOpen" :dialogCancel="dialogMitWaitingCancel"
      :dialogConfirm="dialogMitWaitingConfirm" :mode="actionMode" :itemData="itemDataMitWaiting" />
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
import type { IDocumentBerthMit, IDocumentVesselInMit } from "~/core/interfaces/IShipTable";
import { RoleTypeEnum } from "~/utils/enums/RoleTypeEnum";

const documentService = useDocumentService();
const authStore = useAuthStore();
const { t } = useI18n();
const isAgency = authStore.profileUser.roleType === RoleTypeEnum.Agency;
const isLoading = ref<boolean>(false);
const actionMode = ref<string>("");
const itemDataMit = ref<IDocumentBerthMit>();
const itemDataMitWaiting = ref<IDocumentVesselInMit>();
const mitList = ref<IDocumentBerthMit[]>([]);
const mitWaitingList = ref<IDocumentVesselInMit[]>([]);

const columnMit = computed(() => {
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

const columnMitWaiting = computed(() => {
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

const filteredColumnsMit = computed(() =>
   columnMit.value.filter((column: any) => !["id", "actions"].includes(column.key))
);
const filteredColumnsMitWaiting = computed(() =>
   columnMitWaiting.value.filter((column: any) => !["id", "actions"].includes(column.key))
);

onMounted(() => {
   getTableData();
});

const getTableData = async () => {
   isLoading.value = true;

   const respVesselInMit = await documentService.getDocumentVesselIn("mit");
   const respBerthMit = await documentService.getDocumentBerth("mit");

   mitList.value = respVesselInMit.data;
   mitWaitingList.value = respBerthMit.data;

   isLoading.value = false;
};

const getDocumentVesselIn = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentVesselIn("mit", filterMit.value);
   if (resp.statusCode === 200) {
      mitList.value = resp.data;
   }
   isLoading.value = false;
};

const getDocumentBerth = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentBerth("mit", filterMitWaiting.value);
   if (resp.statusCode === 200) {
      mitWaitingList.value = resp.data;
   }
   isLoading.value = false;
};

const getMenuTable = (row: IDocumentBerthMit | IDocumentVesselInMit, type: string) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               if (type === "mit") {
                  handleMitForm(true, "edit");
                  itemDataMit.value = row as IDocumentBerthMit;
               }
               if (type === "mitWaiting") {
                  handleMitWaitingForm(true, "edit");
                  itemDataMitWaiting.value = row as IDocumentVesselInMit;
               }
            },
         },
      ],
   ];
   return items;
};

const isDialogMitFormOpen = ref(false);
const handleMitForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogMitFormOpen.value = status;
};
const dialogMitCancel = () => {
   isDialogMitFormOpen.value = false;
};
const dialogMitConfirm = (status: boolean, type: string = "") => {
   isDialogMitFormOpen.value = status;
   if (type === "refresh") {
      getDocumentVesselIn();
   }
};

const isDialogMitWaitingFormOpen = ref(false);
const handleMitWaitingForm = (status: boolean, mode: string) => {
   actionMode.value = mode;
   isDialogMitWaitingFormOpen.value = status;
};
const dialogMitWaitingCancel = () => {
   isDialogMitWaitingFormOpen.value = false;
};
const dialogMitWaitingConfirm = (status: boolean, type: string = "") => {
   isDialogMitWaitingFormOpen.value = status;
   if (type === "refresh") {
      getDocumentBerth();
   }
};

const selectRowMit = (row: any, type = 'mit') => {
   if(isAgency) return;
   const menuItems = getMenuTable(row, type);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const selectRowMitWaiting = (row: any, type = 'mitWaiting') => {
   if(isAgency) return;
   const menuItems = getMenuTable(row, type);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const sortFieldMit = ref("");
const sortOrderMit = ref("");
const filterMit = ref({
   Order: [{ column: sortFieldMit.value, dir: sortOrderMit.value }]
});

const sortMappingMit: Record<string, string> = {
   vesselInfo: "vesselName",
};
const mapColumnToSortFieldMit = (column: string): string => {
   return sortMappingMit[column] || column;
};
const toggleSortMit = (column: string) => {
   const sortColumn = mapColumnToSortFieldMit(column);
   if (sortFieldMit.value !== sortColumn) {
      sortFieldMit.value = sortColumn;
      sortOrderMit.value = "asc";
   } else {
      if (sortOrderMit.value === "asc") {
         sortOrderMit.value = "desc";
      } else if (sortOrderMit.value === "desc") {
         sortFieldMit.value = "";
         sortOrderMit.value = "";
      } else {
         sortOrderMit.value = "asc";
      }
   }
   filterMit.value.Order = [{ column: sortFieldMit.value, dir: sortOrderMit.value }];
   getDocumentVesselIn();
};

const sortFieldMitWaiting = ref("");
const sortOrderMitWaiting = ref("");
const filterMitWaiting = ref({
   Order: [{ column: sortFieldMitWaiting.value, dir: sortOrderMitWaiting.value }]
});

const sortMappingMitWaiting: Record<string, string> = {
   vesselInfo: "vesselName",
};
const mapColumnToSortFieldMitWaiting = (column: string): string => {
   return sortMappingMitWaiting[column] || column;
};
const toggleSortMitWaiting = (column: string) => {
   const sortColumn = mapColumnToSortFieldMitWaiting(column);
   if (sortFieldMitWaiting.value !== sortColumn) {
      sortFieldMitWaiting.value = sortColumn;
      sortOrderMitWaiting.value = "asc";
   } else {
      if (sortOrderMitWaiting.value === "asc") {
         sortOrderMitWaiting.value = "desc";
      } else if (sortOrderMitWaiting.value === "desc") {
         sortFieldMitWaiting.value = "";
         sortOrderMitWaiting.value = "";
      } else {
         sortOrderMitWaiting.value = "asc";
      }
   }
   filterMitWaiting.value.Order = [{ column: sortFieldMitWaiting.value, dir: sortOrderMitWaiting.value }];
   getDocumentBerth();
};
</script>
