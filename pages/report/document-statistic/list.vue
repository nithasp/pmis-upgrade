<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-anuphan-semi-bold text-[30px]">{{ $t("รายงานเจ้าหน้าที่สถิติ") }}</h1>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-4 gap-4">
         <div class="col-span-1">
            <UFormGroup :label="$t('report_date_range')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                     :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                     :placeholder="$t('report_date_range')" :ui="{
                        wrapper: 'w-full rounded-md bg-white',
                     }" />

                  <template #panel="{ close }">
                     <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                        <DatePicker v-model="selectedDate" @close="close" v-on:date-change="onSelectedDateChange" />
                     </div>
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <USelect :label="$t('year_era')" :placeholder="$t('year_era')" :options="yearEraOptions"
               v-model="yearEra" />
         </div>
         <div class="col-span-2 flex justify-end items-end">
            <div class="ml-2 mb-0.5">
               <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
            </div>
         </div>
      </div>
   </div>
   <div id="request-form-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-lg text-white">{{ $t("report_all_list") }}</h1>
         </div>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
         <UTable @select="selectRow" :columns="columns" :rows="reportList" :ui="{
            base: 'u-table-list',
         }">
            <template #id-data="{ index }">
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>
            <template #actions-data="{ row }">
               <div v-if="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(row.id)" class="td text-center">
                  <ActionMenuTable :items="getActionsList(row)" @click.stop />
               </div>
            </template>

            <template #empty-state>
               <EmptyNotFoundTable />
            </template>
         </UTable>
      </div>
   </div>
   <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="modalAlertTitle" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
   <SelectBerthReport6Dialog :isDialogOpen="isOpenSelectBerthReport6" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleConfirmReport6" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <SelectVesselReport45Dialog :isDialogOpen="isOpenSelectBerthReport4And5" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleConfirmReport4And5" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" :reportType="reportType" />


   <Report2 :isDialogOpen="isOpenReport2" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport2" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <Report9 :isDialogOpen="isOpenReport9" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport9" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <Report10 :isDialogOpen="isOpenReport10" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport10" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <Report11 :isDialogOpen="isOpenReport11" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport11" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <Report12 :isDialogOpen="isOpenReport12" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport12" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <Report13 :isDialogOpen="isOpenReport13" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport13" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
   <Report14 :isDialogOpen="isOpenReport14" :dialogCancel="dialogCancel"
      :confirmAfterAction="handleReport14" :start-date="startDate" :end-date="endDate" :yearEra="yearEra"
      :isPreview="isPreview" />
      
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import { format } from "date-fns";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import FileExportIcon from "~/assets/icons/fi-rs-file-export.svg";
import PrintIcon from "~/assets/icons/fi-rs-print.svg";
import DialogAlert from "~/components/dialog/alert.vue";
import Input from "~/components/form/u-input.vue";
import USelect from "~/components/form/u-select.vue";
import DatePicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import type { IFilterPortDuesPending } from "~/core/interfaces/IFilterPortDuesPending";
import usePortDuesService from "~/core/services/portDuesService";
import ActionMenuTable from "~/components/ui/actionMenuTable.vue";
import useReportService from "~/core/services/reportService";
import SelectBerthReport6Dialog from "~/components/dialog/report/select-berth-report-6-dialog.vue";
import { YearEraEnum } from "~/utils/enums/YearEraEnum";
import SelectVesselReport45Dialog from "~/components/dialog/report/select-vessel-report-4-5-dialog.vue";
import Report2 from "~/components/dialog/report/statistic/report2.vue";
import Report9 from "~/components/dialog/report/statistic/report9.vue";
import Report10 from "~/components/dialog/report/statistic/report10.vue";
import Report11 from "~/components/dialog/report/statistic/report11.vue";
import Report12 from "~/components/dialog/report/statistic/report12.vue";
import Report13 from "~/components/dialog/report/statistic/report13.vue";
import Report14 from "~/components/dialog/report/statistic/report14.vue";

const { t, locale } = useI18n();
const isLoading = ref(false);
const search = ref("");
const customerName = ref('')
const berthId = ref(0)
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() })
const documentOptionsStore = useDocumentOptionsStore()
const reportService = useReportService()
const accessToken = ref(localStorage.getItem('access_token'))
const yearEraOptions = ref([
   {
      id: YearEraEnum.BUDDHIST,
      name: 'พุทธศักราช (พ.ศ.)',
   },
   {
      id: YearEraEnum.CHRISTIAN,
      name: 'คริสตศักราช (ค.ศ.)',
   }
])
const startDate = ref('')
const endDate = ref('')
const yearEra = ref(YearEraEnum.CHRISTIAN)
const reportType = ref(0)

const filter = ref<IFilterPortDuesPending>({
   customerName: "",
   berthId: 0,
   begin: '',
   end: '',
   page: 1,
   limit: 10,
   search: ''
});

const isConfirmCancelDialogOpen = ref(false)
const isAlertDialogOpen = ref(false)
const isOpenSelectBerthReport6 = ref(false)
const isOpenSelectBerthReport4And5 = ref(false)

const isOpenReport2 = ref(false)
const isOpenReport9 = ref(false)
const isOpenReport10 = ref(false)
const isOpenReport11 = ref(false)
const isOpenReport12 = ref(false)
const isOpenReport13 = ref(false)
const isOpenReport14 = ref(false)

const modalAlertTitle = ref('')
const modalAlertMessage = ref('')
const modalAlertType = ref('')
const isPreview = ref(false)

const reportList = ref<any[]>([
   {
      id: 1,
      reportName: "SUMMARY IMPORT - EXPORT CARGOS",
   },
   {
      id: 2,
      reportName: "IMPORT - EXPORT CLASSIFIED BY KIND OF GOODS",
   },
   {
      id: 3,
      reportName: "สรุปข้อมูลเรือ ผ่านเข้า-ออกท่าเรืออุตสาหกรรมมาบตาพุด",
   },
   {
      id: 4,
      reportName: "สรุปข้อมูลเรือ ตามประเภทเรือ",
   },
   {
      id: 5,
      reportName: "สรุปการใช้ท่าเทียบเรือ",
   },
   {
      id: 6,
      reportName: "สรุปผลงานบริการเรือ",
   },
   {
      id: 7,
      reportName: "สรุปรายงานสินค้าผ่านท่า",
   },

   {
      id: 8,
      reportName: "รายงานข้อมูลเรือเข้า-ออก ตรวจแล้ว",
   },
   {
      id: 9,
      reportName: "รายงานข้อมูลเรือและสินค้า",
   },
   {
      id: 10,
      reportName: "สถิติเปรียบเทียบจำนวนเรือจอดทิ้งสมอ ณ จุดทิ้งสมอ",
   },
   {
      id: 11,
      reportName: "สถิติเปรียบเทียบจำนวนเรือจอดทิ้งสมอ รอเทียบท่าตามช่วงเวลา",
   },
   {
      id: 12,
      reportName: "สรุปข้อมูลเรือและสินค้า ผ่านเข้าออกท่าเรืออุตสาหกรรมมาบตาพุด",
   },
   {
      id: 13,
      reportName: "ข้อมูลเรือ ผ่านเข้าออกท่าเรืออุตสาหกรรมมาบตาพุด",
   },
   {
      id: 14,
      reportName: "ข้อมูลสินค้า ผ่านเข้าออกท่าเรืออุตสาหกรรมมาบตาพุด",
   },
]);

onMounted(() => {
   documentOptionsStore.getBerthsOptions()
})


const getActionsList = (row: any) => {
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: ViewIcon,
            },

            click: async () => {
               handlePreviewExcel(row.id)
            },
         },
         {
            label: t("export"),
            avatar: {
               src: FileExportIcon,
            },
            click: () => {
               handleExportExcel(row.id)
            },
         },
         {
            label: t("print_pdf"),
            avatar: {
               src: PrintIcon,
            },
            click: () => {
              
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
   selectedDate.value = { start: new Date(), end: new Date() }
};


const columns = [
   {
      key: "id",
      label: "ลำดับ",
      class: 'text-center w-[50px]'
   },
   {
      key: "reportName",
      label: "ชื่อรายการ",
      expandButton: true
   },
   {
      key: "actions",
      label: "",
      sortable: false,
   },
];

const onSelectedDateChange = (newDate: any) => {
   dateValue.value = newDate
}

const handleExportExcel = async (type: number) => {
   isPreview.value = false
   reportType.value = type
   if (dateValue.value) {
      startDate.value = dateValue.value ? new Date(dateValue.value.start).toISOString().split('T')[0] : '';
      endDate.value = dateValue.value ? new Date(dateValue.value.end).toISOString().split('T')[0] : '';
      if (type === 1) {
         const resp: any = await reportService.downloadExcelReport1({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         if (resp.statusCode === 200) {
            console.log('export success')
         } else {
            alert('error')
         }
      }
      if (type === 2) {
         isOpenReport2.value = true
      }
      if (type === 3) {
         const resp = await reportService.downloadExcelReport3({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         if (resp.statusCode === 200) {
            console.log('export success')
         }
      }
      if ([4, 5].includes(type)) {
         isOpenSelectBerthReport4And5.value = true
      }
      if (type === 6) {
         isOpenSelectBerthReport6.value = true
      }

      if (type === 7) {
         const resp = await reportService.downloadExcelReport7({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         if (resp.statusCode === 200) {
            console.log('export success')
         }
      }
      if (type === 9) {
         isOpenReport9.value = true
      }
      if (type === 10) {
         isOpenReport10.value = true
      }
      if (type === 11) {
         isOpenReport11.value = true
      }
      if (type === 12) {
         isOpenReport12.value = true
      }
      if (type === 13) {
         isOpenReport13.value = true
      }
      if (type === 14) {
         isOpenReport14.value = true
      }
   } else {
      isAlertDialogOpen.value = true
      modalAlertTitle.value = t('please_select_filter')
      modalAlertMessage.value = t('report_filter_message')
      modalAlertType.value = 'warning'
   }
}

const handlePreviewExcel = async (type: number) => {
   isPreview.value = true
   reportType.value = type
   if (dateValue.value) {
      startDate.value = dateValue.value ? new Date(dateValue.value.start).toISOString().split('T')[0] : '';
      endDate.value = dateValue.value ? new Date(dateValue.value.end).toISOString().split('T')[0] : '';
      if (type === 1) {
         const resp = await reportService.previewExcelReport1({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         window.open(resp);
      }
      if (type === 2) {
         const resp = await reportService.previewExcelReport2({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         window.open(resp);
      }
      if (type === 3) {
         const resp = await reportService.previewExcelReport3({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         window.open(resp);
      }
      if ([4, 5].includes(type)) {
         isOpenSelectBerthReport4And5.value = true
      }
      if (type === 6) {
         isOpenSelectBerthReport6.value = true
      }

      if (type === 7) {
         const resp = await reportService.previewExcelReport7({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
         })
         window.open(resp);
      }
   } else {
      isAlertDialogOpen.value = true
      modalAlertTitle.value = t('please_select_filter')
      modalAlertMessage.value = t('report_filter_message')
      modalAlertType.value = 'warning'
   }
}

const handleReport2 = () => {
   isOpenReport2.value = false
}
const handleReport9 = () => {
   isOpenReport9.value = false
}
const handleReport10 = () => {
   isOpenReport10.value = false
}
const handleReport11 = () => {
   isOpenReport11.value = false
}
const handleReport12 = () => {
   isOpenReport12.value = false
}
const handleReport13 = () => {
   isOpenReport13.value = false
}
const handleReport14 = () => {
   isOpenReport14.value = false
}

const handleConfirmReport6 = () => {
   isOpenSelectBerthReport6.value = false
}

const handleConfirmReport4And5 = () => {
   isOpenSelectBerthReport4And5.value = false
}

const dialogCancel = () => {
   isOpenReport2.value = false
   isOpenReport9.value = false
   isOpenReport10.value = false
   isOpenReport11.value = false
   isOpenReport12.value = false
   isOpenReport13.value = false
   isOpenReport14.value = false

   isConfirmCancelDialogOpen.value = false
   isOpenSelectBerthReport6.value = false
   isOpenSelectBerthReport4And5.value = false
};

const handleCloseAlertDialog = () => {
   isConfirmCancelDialogOpen.value = false
   isAlertDialogOpen.value = false
}

const selectRow = (row: any) => {
   const menuItems = getActionsList(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
}
</script>
