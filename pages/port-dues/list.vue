<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("portdues_list") }}</h1>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-4 gap-4">
         <div class="col-span-1">
            <Input label="ชื่อเรือ/IMO/Official No." placeholder="ค้นหา" v-model="search"
               icon="i-heroicons-magnifying-glass-20-solid" />
         </div>
         <div class="col-span-1">
            <Input label="รหัสลูกค้า/ชื่อลูกค้า" placeholder="ค้นหา" v-model="customerName"
               icon="i-heroicons-magnifying-glass-20-solid" />
         </div>
         <div class="col-span-1">
            <USelect label="ท่าเรือ" placeholder="ท่าเรือ" :options="documentOptionsStore.berthsOption"
               v-model="berthId" />
         </div>
         <div class="col-span-1">
            <div class="flex items-end">
               <div class="w-full">
                  <UFormGroup :label="$t('vessel_entry_date')">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                           :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                           :placeholder="$t('vessel_entry_date')" :ui="{
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
            <h1 class="font-normal text-lg text-white">{{ $t("all_portdues") }}</h1>
            <div v-if="search || vesselType" class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{
               vesselList.length
            }} รายการ</div>
         </div>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
         <ExpandableTable :headers="columns" :rows="portDuesList" @rowSelected="selectRow" @sort="toggleSort"
            :sortField="sortField" :sortOrder="sortOrder">
            <template #details="{ row }: any">
               <tr v-for="(subRow, subIndex) in row.refDocuments" :key="subIndex">
                  <td v-for="(column, colIndex) in columns" :key="colIndex"
                     class="whitespace-nowrap px-4 py-4 text-grayy-400 text-sm">
                     <!-- Render the value dynamically based on the column key -->
                     <template v-if="column.key">
                        <span class="text-grayy-75">
                           <template v-if="column.key === 'invoiceNo'">
                              {{ subRow.portDueNumber }}
                           </template>
                           <template v-if="column.key === 'grt_portdues'">
                              <!-- {{ subRow[column.key]?.grt || "-" }} {{ subRow[column.key]?.portDue || "-" }} -->
                              {{ `฿ ${formatNumber(subRow.total)}` }}
                           </template>
                           <template v-else-if="column.key === 'invoice_issuer_date'">
                              <div class="text-grayy-75">{{ row.createdAt &&
                                 renderDateFormat(row.createdAt)
                              }}</div>
                           </template>
                           <template v-else-if="column.key === 'payment_duedate'">
                              <div class="text-grayy-75">{{ row.invoice.dueDate &&
                                 renderDateFormat(row.invoice.dueDate)
                              }}</div>
                           </template>
                           <template v-else-if="column.key === 'payment_date'">
                              <div class="text-grayy-75">{{ row.paidDate &&
                                 renderDateFormat(row.paidDate)
                              }}</div>
                           </template>
                           <template v-else>

                           </template>
                        </span>
                     </template>
                  </td>
               </tr>
               <tr class="relative !bg-white">
                  <td colspan="3"></td>
                  <td :colspan="columns.length - 3">
                     <div class="text-sm p-4">
                        <span class="text-red-600">{{ t('remarks') }} {{ row.cancelNote }}</span>
                        <!-- <span class="text-grayy-75"> ({{ renderDateFormat(row.canceledAt) + ' ' + renderTimeFormat(row.canceledAt) }})</span> -->
                     </div>
                  </td>
               </tr>
            </template>
            <template #status-data="{ row }: any">
               <Badge :label="row.status" :type="row.statusKey === PortDuesEnum.created ? 'success' : 'error'" />
            </template>
            <template #invoiceNo-data="{ row }: any">
               {{ row.portDueNumber }}
            </template>
            <template #id-data="{ index }: any">{{ getNumCountPagination(index, filter.page, filter.limit) }}
            </template>
            <template #name-data="{ row }: any">
               <div class="flex items-center">
                  <UAvatar size="xs" :src="row?.vessel.vesselFlagPath" alt="Avatar" />
                  <div class="ml-3">
                     <div class="text-black font-semibold">
                        {{ row?.vessel.vesselName }}
                     </div>
                     <div class="text-grayy-75">{{ row?.vessel.vesselImoNumber }}/{{ row?.vessel.vesselOfficialNumber }}
                     </div>
                  </div>
               </div>
            </template>

            <template #grt_portdues-data="{ row }: any">
               <div class="text-black font-semibold">
                  {{ formatNumber(row.grossTonnage, 3) }}
               </div>
               <div class="text-grayy-75">{{ row.invoice.total && `฿ ${formatNumber(row.invoice.total)}` }}</div>
            </template>
            <template #ports-data="{ row }: any">
               <div class="text-grayy-75 w-20 truncate">{{ row.berthName }}</div>
            </template>
            <template #actions-data="{ row }">
               <ActionMenuTable :items="getActionsList(row)" @click.stop />
            </template>
            <template #departure_date-data="{ row }: any">
               <div class="text-black font-semibold">{{ row.departuredAt && renderDateFormat(row.departuredAt) }}
               </div>
               <div class="text-grayy-75">{{ row.departuredAt && renderTimeFormat(row.departuredAt) }}</div>
            </template>
            <template #mooring_date-data="{ row }: any">
               <div class="text-black font-semibold">{{ row.berthAt && renderDateFormat(row.berthAt) }}</div>
               <div class="text-grayy-75">{{ row.berthAt && renderTimeFormat(row.berthAt) }}</div>
            </template>
            <!-- invoice_issuer_date -->
            <template #invoice_issuer_date-data="{ row }: any">
               <div class="text-grayy-75">{{ row.createdAt &&
                  renderDateFormat(row.createdAt)
               }}</div>
            </template>
            <template #payment_duedate-data="{ row }: any">
               <div class="text-grayy-75">{{ row.invoice.dueDate &&
                  renderDateFormat(row.invoice.dueDate)
               }}</div>
            </template>
            <template #payment_date-data="{ row }: any">
               <div class="text-grayy-75">{{ row.requestDate &&
                  renderDateFormat(row.requestDate)
               }}</div>
            </template>
            <template #clientIdName-data="{ row }: any">
               <div class="text-black font-semibold">
                  {{ row?.invoice.customerCode }}
               </div>
               <div class="text-grayy-75">{{ row?.invoice.name }}</div>
            </template>
            <template #paymentMethod-data="{ row }: any">
               <div class="text-grayy-75">{{ row.paymentMethod }}</div>
            </template>
            <template #empty-state>
               <EmptyNotFoundTable />
            </template>
         </ExpandableTable>

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
   </div>

   <DialogCancelPortDue icon="warning" :labelConfirm="t('confirm')" :label-cancel="$t('cancel')"
      :isDialogOpen="isConfirmCancelDialogOpen" :dialogCancel="dialogCancel" :formGroup="formGroup"
      :dialogConfirm="() => handleConfirmCancelDocument(formGroup.note)" />

   <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="modalAlertTitle" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import { format } from "date-fns";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import EditAltIcon from "~/assets/icons/fi-rs-edit-alt.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import Badge from '~/components/badge/badge.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogCancelPortDue from "~/components/dialog/port-dues/confirm-cancel-port-due.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Input from "~/components/form/u-input.vue";
import USelect from "~/components/form/u-select.vue";
import DatePicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import ExpandableTable from '~/components/ui/expandTable.vue';
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import type { IFilterPortDuesPending } from "~/core/interfaces/IFilterPortDuesPending";
import type { IPortDuesSaveDetail } from "~/core/interfaces/IPortDuesSaveDetail";
import usePortDuesService from "~/core/services/portDuesService";
import { PortDuesEnum } from "~/utils/enums/PortDuesEnum";
import ActionMenuTable from '~/components/ui/actionMenuTable.vue';

const { t, locale } = useI18n();

const isLoading = ref(false);
const documentId = ref()
const search = ref("");
const customerName = ref('')
const berthId = ref(0)
const vesselType = ref(0);
const dateValue = ref<any>("");
const sortField = ref("");
const sortOrder = ref("");
const selectedDate = ref(new Date())
const vesselOptionsStore = useVesselOptionsStore();
const documentOptionsStore = useDocumentOptionsStore()
const portDuesService = usePortDuesService()

const filter = ref<IFilterPortDuesPending>({
   customerName: "",
   berthId: 0,
   begin: '',
   end: '',
   page: 1,
   limit: 10,
   search: '',
   Order: [{ column: sortField.value, dir: sortOrder.value }]
});

const formGroup = reactive<any>({
   note: '',
})

const isConfirmCancelDialogOpen = ref(false)
const isAlertDialogOpen = ref(false)
const modalAlertTitle = ref('')
const modalAlertMessage = ref('')
const modalAlertType = ref('')
const portDuesList = ref<IPortDuesSaveDetail[]>([]);

const vesselList = ref<any[]>([
   {
      id: 1,
      requestNo: "3578",
      mooring_date: "2024-11-11T23:31:23.269+07:00",
      departure_date: "2024-12-08T01:55:41.629+07:00",
      berth_id: 5,
      berth_name: "บริษัท โกลว์ เอสพีพี3 จำกัด",
      jetty_id: 14,
      jetty_name: "MIT-1",
      document_berth_id: 0,
      document_number: "",
      vessel_flag: "https://pmis-apidev.wisdomcloud.net/data/flag/af.png",
      name: "NP BANGPAKONG",
      imoNumber: "9020455",
      officialNumber: "570001110 ",
      vessel_type_id: 2,
      vessel_type_name: "BULK CARRIER",
      voyage: "2345",
      gross_tonnage: 10,
      depth: 10,
      purpose_id: 1,
      purpose_name: "เผื่อส่งข้อมูลไปที่ท่าเรือในประเทศ",
      agency_name: "VTMS",
      clientId: "SCM33005",
      clientName: "บริษัท เอส ซี กรุ๊ป โฮลดิ้ง",
      grt_portdues: { grt: "3,501.000", portDue: "฿ 29,968.56" },
      ports: "PTT TANK",
      paymentMethod: "Bank Guarantee",

   }

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

const getActionsList = (row: any) => {
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: EditAltIcon,
            },

            click: () => { navigateTo(`/port-dues/view?id=${row.id}`) },
         },
         {
            label: t("print_invoice"),
            avatar: {
               src: EditIcon,
            },
            click: () => { },
         },
         {
            label: t("cancel"),
            avatar: {
               src: CrossCircleIcon,
            },
            visible: !row.canceledAt,
            click: () => {
               documentId.value = row.id
               isConfirmCancelDialogOpen.value = true
            },
         },
      ],
   ];
   return items;
};

const handleClickResetFitler = () => {
   search.value = "";
   customerName.value = ''
   berthId.value = 0
   dateValue.value = ""
   filter.value.page = 1;
   filter.value.limit = 10;
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   getPortDuesInvoiceList({
      customerName: "",
      berthId: 0,
      begin: '',
      end: '',
      page: 1,
      limit: 10,
      search: '',
      Order: [{ column: sortField.value, dir: sortOrder.value }]
   });
};


const columns = [
   { key: "id", label: "ลำดับ", sortable: false },
   { key: "show", label: "แสดง", expandButton: true, sortable: false },
   { key: "status", label: "สถานะ", sortable: true },
   { key: "invoiceNo", label: "เลขที่ใบแจ้งหนี้", sortable: true },
   { key: "clientIdName", label: "รหัส/ชื่อลูกค้า", sortable: true },
   { key: "name", label: "ชื่อเรือ/IMO/Official No.", sortable: true },
   { key: "grt_portdues", label: "GRT/Port Dues", sortable: true },
   { key: "ports", label: "ท่าเรือ", sortable: true },
   { key: "mooring_date", label: "วันที่เรือเข้า VT", sortable: true },
   { key: "invoice_issuer_date", label: "วันที่ออกใบแจ้งหนี้", sortable: true },
   { key: "payment_duedate", label: "วันครบกำหนดชำระ", sortable: true },
   { key: "payment_date", label: "วันที่ชำระเงิน", sortable: true },
   { key: "actions", label: "", sortable: false },
];


onMounted(() => {
   getPortDuesInvoiceList(filter.value);
   documentOptionsStore.getBerthsOptions()
   // getVesselList(filter.value);
   // vesselOptionsStore.getVesselTypeOption();
   // vesselOptionsStore.getVesselFlagOption();
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


onMounted(() => {
   getPortDuesInvoiceList(filter.value);
   documentOptionsStore.getBerthsOptions()
   // vesselOptionsStore.getVesselTypeOption();
   // vesselOptionsStore.getVesselFlagOption();
});

const getPortDuesInvoiceList = async (filter: IFilterPortDuesPending = {
   customerName: "",
   berthId: 0,
   begin: '',
   end: '',
   page: 1,
   limit: 10,
   search: '',
   Order: [{ column: sortField.value, dir: sortOrder.value }]
}) => {
   isLoading.value = true
   const resp = await portDuesService.getPortDuesInvoiceList(filter)
   if (resp.statusCode === 200) {
      portDuesList.value = resp.data.data
      console.log('portDuesList.value==>', portDuesList.value)
      paginationData.value.totalItems = resp.data.totalItems
      paginationData.value.totalPages = resp.data.totalPages
   }
   isLoading.value = false
}

const performSearch = debounce((query: any) => {
   filter.value.search = query;
   filter.value.page = 1;
   getPortDuesInvoiceList({
      ...filter.value, search: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }]
   }
   );
}, 500);

const performSearchCustomerName = debounce((query: any) => {
   filter.value.customerName = query;
   filter.value.page = 1;
   getPortDuesInvoiceList({ ...filter.value, customerName: query, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] });
}, 500);

watch(search, (newVal) => {
   performSearch(newVal);
});

watch(customerName, (newVal) => {
   performSearchCustomerName(newVal);
});

watch(
   () => filter.value.page,
   (value) => {
      getPortDuesInvoiceList({ ...filter.value, page: value, Order: [{ column: sortField.value, dir: sortOrder.value }] });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getPortDuesInvoiceList({ ...filter.value, limit: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] });
   }
);

watch(
   () => berthId.value,
   (value) => {
      filter.value.page = 1;
      getPortDuesInvoiceList({ ...filter.value, berthId: value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] });
   }
);

watch(
   () => selectedDate.value,
   (value) => {
      dateValue.value = value;
   }
);

watch(
   () => dateValue.value,
   (value) => {
      const beginDate = value ? adjustToUTC(value.start) : '';
      const endDate = value ? adjustToUTC(value.end) : '';
      filter.value.begin = beginDate
      filter.value.end = endDate
      filter.value.page = 1
      getPortDuesInvoiceList({ ...filter.value, page: 1, Order: [{ column: sortField.value, dir: sortOrder.value }] })
   }
);

const dialogCancel = () => {
   isConfirmCancelDialogOpen.value = false
};

const handleConfirmCancelDocument = async (note: string) => {
   if (documentId.value) {
      const resp = await portDuesService.cancelPortDues(documentId.value, note)
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true
         isConfirmCancelDialogOpen.value = false

         modalAlertTitle.value = t('cancel_invoice')
         modalAlertMessage.value = t('cancel_invoice_success')
         modalAlertType.value = 'success'
      } else {
         isAlertDialogOpen.value = true
         modalAlertTitle.value = t('cancel_invoice')
         modalAlertMessage.value = resp.message
         modalAlertType.value = 'error'
      }
   } else {
      navigateTo('/request-form/list')
   }
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === 'success') {
      getPortDuesInvoiceList({ ...filter.value, Order: [{ column: sortField.value, dir: sortOrder.value }] })
   }
   isConfirmCancelDialogOpen.value = false
   isAlertDialogOpen.value = false
}

const selectRow = (row: IPortDuesSaveDetail) => {
   const menuItems = getActionsList(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
}

const sortMapping: Record<string, string> = {
   invoiceNo: "portDueNumber",
   clientIdName: "invoiceName",
   name: "vesselVesselName",
   grt_portdues: "grossTonnage",
   ports: "berthName",
   mooring_date: "berthAt",
   departure_date: "departuredAt",
   invoice_issuer_date: "createdAt",
   payment_duedate: "invoiceDueDate",
   payment_date: "paidDate",
};

const mapColumnToSortField = (columnKey: string): string => {
   return sortMapping[columnKey] || columnKey;
};

const toggleSort = (columnKey: string) => {
   const column = columns.find((col) => col.key === columnKey);
   if (column && column.sortable === false) return;

   const sortColumn = mapColumnToSortField(columnKey);

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
   filter.value.page = 1;
   getPortDuesInvoiceList({
      ...filter.value,
      page: 1,
      Order: [{ column: sortField.value, dir: sortOrder.value }],
   });
};

</script>
