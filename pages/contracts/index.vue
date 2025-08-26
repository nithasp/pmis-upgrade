<template>
   <header class="flex items-center justify-between">
      <h1 class="font-anuphan-semi-bold text-[30px] text-black">{{ $t("รายการสัญญา") }}</h1>
      <div class="flex gap-3 justify-end">
         <UButton class="[&_span]:font-anuphan-semi-bold max-w-[120px] w-[85px] h-10" outlined size="md" @click="() => navigateTo(`/contracts/create`)">
            <template #default>
               <div class="flex gap-2 text-right w-full justify-center">
                  <img :src="AddIconWhite" alt="add-icon" class="w-5 h-5" />
                  <span>{{ $t("create") }}</span>
               </div>
            </template>
         </UButton>
      </div>
   </header>

   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl my-6">
      <div class="block justify-between gap-4 mobile:flex">
         <div class="block gap-4 w-full mobile:flex">
            <Input
               :label="$t('เลขที่สัญญา')"
               :placeholder="$t('search')"
               v-model="filter.contractNumber"
               icon="i-heroicons-magnifying-glass-20-solid"
               class="max-w-[495px] w-full"
            />
            <Select
               :label="$t('port')"
               :placeholder="$t('port')"
               :options="documentOptionsStore.berthsOption"
               v-model="filter.berthId"
               class="max-w-[495px] w-full mt-3 mobile:mt-0"
            />
         </div>
         <div class="content-end mt-3 mobile:mt-0 justify-self-start mobile:justify-self-end">
            <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
         </div>
      </div>
   </div>
   <div id="sailing-log-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-base text-grayy-25">{{ $t("all_request_form") }}</h1>
            <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2">{{ contractList.length }} {{ $t("items") }}</div>
         </div>
      </div>

      <UTable
         @select="selectRow"
         :columns="columns"
         :rows="contractList"
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

         <template #start-data="{ row }">
            <div>{{ row.start ? renderDateFormat(row.start) : "" }}</div>
         </template>

         <template #end-data="{ row }">
            <div v-if="!row.terminatedDate">{{ renderDateFormat(row.end) }}</div>
            <div v-else>{{ renderDateFormat(row.terminatedDate) }}</div>
         </template>

         <template #actions-data="{ row }">
            <div class="text-right">
               <UDropdown :items="getMenuTable(row)" @click.stop>
                  <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
               </UDropdown>
            </div>
         </template>
      </UTable>

      <div class="flex justify-between px-6 py-3">
         <div class="flex items-center">
            <span class="text-sm text-grayy-75 mr-3.5">{{ $t("show") }}</span>
            <Select :options="limitRowTable" v-model="filter.limit" />
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

   <DialogConfirm
      descriptionWrapperClass="max-w-[220px] mt-5 mb-0 mx-auto"
      buttonWrapperClass="!mt-4"
      icon="danger"
      colorConfirm="red"
      :title="$t('ลบข้อมูลสัญญา')"
      :desc="$t('คุณต้องการลบข้อมูลสัญญานี้ใช่หรือไม่ หากลบแล้วจะไม่สามารถกู้คืนได้อีก')"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogDeleteContractOpen"
      :dialogCancel="dialogDeleteContractCancel"
      :dialogConfirm="dialogDeleteContractConfirm"
   />
   <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseDialogAlert"
      :btnName="$t('close')"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import AddIconWhite from "~/assets/icons/fi-rs-add-white.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";

const documentOptionsStore = useDocumentOptionsStore();
import useContractsService from "~/core/services/contractsService";
const contractsService = useContractsService();

const { t } = useI18n();
import type { IContractDetail, IContractFilter } from "~/core/interfaces/IContracts";
const isLoading = ref<boolean>(false);
const allowFetch = ref<boolean>(true);
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<IContractFilter>({
   limit: 10,
   page: 1,
   contractNumber: "",
   berthId: 0,
   Order: [{ column: sortField.value, dir: sortOrder.value }],
});
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});
const dialogAlertProps = ref({
   title: "",
   desc: "",
   type: "",
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

const columns = [
   {
      key: "id",
      label: t("number_no"),
      class: "w-[60px] text-center",
   },
   {
      key: "contractNo",
      label: t("เลขที่สัญญา"),
   },
   {
      key: "berthName",
      label: t("ท่าเทียบเรือ"),
   },
   {
      key: "start",
      label: t("วันที่เริ่มต้นสัญญา"),
   },
   {
      key: "end",
      label: t("วันที่สิ้นสุดสัญญา"),
   },
   {
      key: "actions",
      sortable: false,
   },
];

const contractList = ref<IContractDetail[]>([]);
const contractId = ref<number>(0);

const handleResetFilter = () => {
   allowFetch.value = true;
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.contractNumber = "";
   filter.value.berthId = 0;
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
};

onMounted(() => {
   getContractList();
   documentOptionsStore.getVesselFlagOptions();
   documentOptionsStore.getVesselTypeOptions();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getJettiesOptions();
});

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      contractNumber: filter.value.contractNumber,
      berthId: filter.value.berthId,
   }),
   (newValue, oldValue) => {
      if (newValue.contractNumber !== oldValue.contractNumber && newValue.contractNumber) {
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
   getContractList();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getContractList();
};

const getContractList = async () => {
   isLoading.value = true;
   const resp = await contractsService.getContractList(filter.value);
   if (resp.statusCode === 200) {
      contractList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

const deleteVesselImport = async () => {
   isLoading.value = true;
   const resp = await contractsService.deleteContract(contractId.value);
   const isSuccess = resp.statusCode === 200;
   dialogAlertProps.value = {
      title: t(isSuccess ? "ลบข้อมูลสัญญา" : "error_title"),
      desc: t(isSuccess ? "การลบข้อมูลสัญญาของคุณสำเร็จแล้ว" : "error_try_again"),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogDeleteContractOpen.value = false;
   isLoading.value = false;
};

const getMenuTable = (row: IContractDetail) => {
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               navigateTo(`/contracts/view?id=${row.id}`);
            },
         },
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`/contracts/edit?id=${row.id}`);
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               contractId.value = row.id;
               isDialogDeleteContractOpen.value = true;
            },
         },
      ],
   ];
   return items;
};

const isDialogDeleteContractOpen = ref(false);
const dialogDeleteContractConfirm = async () => {
   deleteVesselImport();
};
const dialogDeleteContractCancel = () => {
   isDialogDeleteContractOpen.value = false;
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
   getContractList();
};

const selectRow = (row: IContractDetail) => {
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
   getContractList();
};
</script>
