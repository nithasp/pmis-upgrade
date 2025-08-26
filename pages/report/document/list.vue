<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-anuphan-semi-bold text-[30px]">{{ $t("report_title_request_document") }}</h1>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-4 gap-4">
         <div class="col-span-1">
            <UFormGroup :label="$t('report_date_range')">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input
                     size="md"
                     v
                     ariant="outline"
                     color="purple"
                     custom-icon="calendar"
                     :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                     :placeholder="$t('report_date_range')"
                     :ui="{
                        wrapper: 'w-full rounded-md bg-white',
                     }"
                  />

                  <template #panel="{ close }">
                     <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                        <DatePicker v-model="selectedDate" @close="close" v-on:date-change="onSelectedDateChange" />
                     </div>
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="col-span-1">
            <USelect :label="$t('year_era')" :placeholder="$t('year_era')" :options="yearEraOptions" v-model="yearEra" />
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
         <UTable
            @select="selectRow"
            :columns="columns"
            :rows="reportList"
            :ui="{
               base: 'u-table-list',
            }"
         >
            <template #id-data="{ index }">
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>
            <template #actions-data="{ row }">
               <div v-if="[1, 2, 3, 4, 5, 6, 7].includes(row.id)" class="td text-center">
                  <ActionMenuTable :items="getActionsList(row)" @click.stop />
               </div>
            </template>

            <template #empty-state>
               <EmptyNotFoundTable />
            </template>
         </UTable>
      </div>
   </div>

   <DialogAlert
      :isOpen="isAlertDialogOpen"
      :desc="modalAlertMessage"
      :title="modalAlertTitle"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialog"
      :btnName="$t('close')"
   />
   <SelectBerthReport6Dialog
      :isDialogOpen="isOpenSelectBerthReport6"
      :dialogCancel="dialogCancel"
      :confirmAfterAction="handleConfirmReport6"
      :start-date="startDate"
      :end-date="endDate"
      :yearEra="yearEra"
      :isPreview="isPreview"
      :berthReport6Type="berthReport6Type"
      @export-pdf6="handleExportPdf"
   />
   <SelectVesselReport45Dialog
      :isDialogOpen="isOpenSelectBerthReport4And5"
      :dialogCancel="dialogCancel"
      :confirmAfterAction="handleConfirmReport4And5"
      :start-date="startDate"
      :end-date="endDate"
      :yearEra="yearEra"
      :isPreview="isPreview"
      :reportType="reportType"
      :berthReport4_5Type="berthReport4_5Type"
      @export-pdf4n5="handleExportPdf"
   />

   <Pdf1 v-show="false" ref="pdf1Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf2 v-show="false" ref="pdf2Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf3 v-show="false" ref="pdf3Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf6 v-show="false" ref="pdf6Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" :pdf6DataTotal="pdf6DataTotal" />
   <Pdf7 v-show="false" ref="pdf7Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />

   <Pdf4_1 v-show="false" ref="pdf4_1Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf4_2 v-show="false" ref="pdf4_2Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf4_3 v-show="false" ref="pdf4_3Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />

   <Pdf5_1 v-show="false" ref="pdf5_1Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf5_2 v-show="false" ref="pdf5_2Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />
   <Pdf5_3 v-show="false" ref="pdf5_3Component" :pdfData="pdfData" :joinedThaiDateString="joinedThaiDateString" />

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

import Pdf1 from "~/pages/jspdf/pdf1.vue";
import Pdf2 from "~/pages/jspdf/pdf2.vue";
import Pdf3 from "~/pages/jspdf/pdf3.vue";
import Pdf6 from "~/pages/jspdf/pdf6.vue";
import Pdf7 from "~/pages/jspdf/pdf7.vue";

import Pdf4_1 from "~/pages/jspdf/pdf4-1.vue";
import Pdf4_2 from "~/pages/jspdf/pdf4-2.vue";
import Pdf4_3 from "~/pages/jspdf/pdf4-3.vue";

import Pdf5_1 from "~/pages/jspdf/pdf5-1.vue";
import Pdf5_2 from "~/pages/jspdf/pdf5-2.vue";
import Pdf5_3 from "~/pages/jspdf/pdf5-3.vue";
import { date } from "zod";

const { t, locale } = useI18n();
const isLoading = ref(false);
const search = ref("");
const customerName = ref("");
const berthId = ref(0);
const dateValue = ref<any>("");
const selectedDate = ref({ start: new Date(), end: new Date() });
const documentOptionsStore = useDocumentOptionsStore();
const reportService = useReportService();
const accessToken = ref(localStorage.getItem("access_token"));
const yearEraOptions = ref([
   {
      id: YearEraEnum.BUDDHIST,
      name: "พุทธศักราช (พ.ศ.)",
   },
   {
      id: YearEraEnum.CHRISTIAN,
      name: "คริสตศักราช (ค.ศ.)",
   },
]);
const startDate = ref("");
const endDate = ref("");
const yearEra = ref(YearEraEnum.CHRISTIAN);
const reportType = ref(0);

const filter = ref<IFilterPortDuesPending>({
   customerName: "",
   berthId: 0,
   begin: "",
   end: "",
   page: 1,
   limit: 10,
   search: "",
});

const isConfirmCancelDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const isOpenSelectBerthReport6 = ref(false);
const isOpenSelectBerthReport4And5 = ref(false);
const modalAlertTitle = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");
const isPreview = ref(false);

const reportList = ref<any[]>([
   {
      id: 1,
      reportName: "รายงานผู้ประกอบการยื่นใบคำร้องล่าช้า (ยื่นไม่ถึง 24 ชม.) แบบตามลำดับ",
   },
   {
      id: 2,
      reportName: "รายงานผู้ประกอบการยื่นใบคำร้องล่าช้า (ยื่นไม่ถึง 24 ชม.) แบบตามรายการทั้งหมด",
   },
   {
      id: 3,
      reportName: "รายงานการยื่นใบคำร้องของตัวแทนเรือ (Agency)",
   },
   {
      id: 4,
      reportName: "รายงานรายชื่อตัวแทนเรือ - เจ้าของเรือไทย",
   },
   {
      id: 5,
      reportName: "รายงานรายชื่อตัวแทนเรือ - เจ้าของเรือต่างประเทศ",
   },
   {
      id: 6,
      reportName: "รายงานสรุปจำนวนใบคำร้อง",
   },
   {
      id: 7,
      reportName: "รายงานการอนุมัติคำ ขอลงทะเบียน ตัวแทนเรือใหม่",
   },
]);

onMounted(() => {
   documentOptionsStore.getBerthsOptions();
});

const getActionsList = (row: any) => {
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: ViewIcon,
            },

            click: async () => {
               handlePreviewExcel(row.id);
            },
         },
         {
            label: t("export"),
            avatar: {
               src: FileExportIcon,
            },
            click: () => {
               handleExportExcel(row.id);
            },
         },
         {
            label: t("print_pdf"),
            avatar: {
               src: PrintIcon,
            },
            click: () => {
               if (row.id === 4) {
                  if (dateValue.value) {
                     isOpenSelectBerthReport4And5.value = true;
                     berthReport4_5Type.value = "pdf";
                     reportType.value = 4;
                     return;
                  } else {
                     isAlertDialogOpen.value = true;
                     modalAlertTitle.value = t("please_select_filter");
                     modalAlertMessage.value = t("report_filter_message");
                     modalAlertType.value = "warning";
                  }
               }
               if (row.id === 5) {
                  if (dateValue.value) {
                     isOpenSelectBerthReport4And5.value = true;
                     berthReport4_5Type.value = "pdf";
                     reportType.value = 5;
                     return;
                  } else {
                     isAlertDialogOpen.value = true;
                     modalAlertTitle.value = t("please_select_filter");
                     modalAlertMessage.value = t("report_filter_message");
                     modalAlertType.value = "warning";
                  }
               }
               if (row.id === 6) {
                  if (dateValue.value) {
                     isOpenSelectBerthReport6.value = true;
                     berthReport6Type.value = "pdf";
                     return;
                  } else {
                     isAlertDialogOpen.value = true;
                     modalAlertTitle.value = t("please_select_filter");
                     modalAlertMessage.value = t("report_filter_message");
                     modalAlertType.value = "warning";
                  }
               }
               handleExportPdf(row.id);
            },
         },
      ],
   ];
   return items;
};

const handleClickResetFitler = () => {
   search.value = "";
   customerName.value = "";
   berthId.value = 0;
   dateValue.value = "";
   filter.value.page = 1;
   filter.value.limit = 10;
   selectedDate.value = { start: new Date(), end: new Date() };
};

const columns = [
   {
      key: "id",
      label: "ลำดับ",
      class: "text-center w-[50px]",
   },
   {
      key: "reportName",
      label: "ชื่อรายการ",
      expandButton: true,
   },
   {
      key: "actions",
      label: "",
      sortable: false,
   },
];

const onSelectedDateChange = (newDate: any) => {
   dateValue.value = newDate;
};

const handleExportExcel = async (type: number) => {
   isPreview.value = false;
   reportType.value = type;
   if (dateValue.value) {
      startDate.value = dateValue.value ? new Date(dateValue.value.start).toISOString().split("T")[0] : "";
      endDate.value = dateValue.value ? new Date(dateValue.value.end).toISOString().split("T")[0] : "";
      if (type === 1) {
         const resp: any = await reportService.downloadExcelReport1({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         if (resp.statusCode === 200) {
            console.log("export success");
         } else {
            alert("error");
         }
      }
      if (type === 2) {
         const resp = await reportService.downloadExcelReport2({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         if (resp.statusCode === 200) {
            console.log("export success");
         } else {
            alert("error");
         }
      }
      if (type === 3) {
         const resp = await reportService.downloadExcelReport3({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         if (resp.statusCode === 200) {
            console.log("export success");
         }
      }
      if ([4, 5].includes(type)) {
         isOpenSelectBerthReport4And5.value = true;
         berthReport4_5Type.value = "excel";
      }
      if (type === 6) {
         isOpenSelectBerthReport6.value = true;
         berthReport6Type.value = "excel";
      }

      if (type === 7) {
         const resp = await reportService.downloadExcelReport7({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         if (resp.statusCode === 200) {
            console.log("export success");
         }
      }
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = t("please_select_filter");
      modalAlertMessage.value = t("report_filter_message");
      modalAlertType.value = "warning";
   }
};

const handlePreviewExcel = async (type: number) => {
   isPreview.value = true;
   reportType.value = type;
   if (dateValue.value) {
      startDate.value = dateValue.value ? new Date(dateValue.value.start).toISOString().split("T")[0] : "";
      endDate.value = dateValue.value ? new Date(dateValue.value.end).toISOString().split("T")[0] : "";
      if (type === 1) {
         const resp = await reportService.previewExcelReport1({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         window.open(resp);
      }
      if (type === 2) {
         const resp = await reportService.previewExcelReport2({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         window.open(resp);
      }
      if (type === 3) {
         const resp = await reportService.previewExcelReport3({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         window.open(resp);
      }
      if ([4, 5].includes(type)) {
         isOpenSelectBerthReport4And5.value = true;
         berthReport4_5Type.value = "excel";
      }
      if (type === 6) {
         isOpenSelectBerthReport6.value = true;
         berthReport6Type.value = "excel";
      }

      if (type === 7) {
         const resp = await reportService.previewExcelReport7({
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         window.open(resp);
      }
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = t("please_select_filter");
      modalAlertMessage.value = t("report_filter_message");
      modalAlertType.value = "warning";
   }
};

const handleConfirmReport6 = () => {
   isOpenSelectBerthReport6.value = false;
};

const handleConfirmReport4And5 = () => {
   isOpenSelectBerthReport4And5.value = false;
};

const dialogCancel = () => {
   isConfirmCancelDialogOpen.value = false;
   isOpenSelectBerthReport6.value = false;
   isOpenSelectBerthReport4And5.value = false;
};

const handleCloseAlertDialog = () => {
   isConfirmCancelDialogOpen.value = false;
   isAlertDialogOpen.value = false;
};

const selectRow = (row: any) => {
   const menuItems = getActionsList(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const pdfData = ref<any>([]);
const joinedThaiDateString = ref<string>("");

const handleExportPdf = async (type: number, modalValue: number = 0, subType: number = 0) => {
   console.log("handleExportPdf");
   isPreview.value = false;
   reportType.value = type;

   if (dateValue.value) {
      startDate.value = dateValue.value ? new Date(dateValue.value.start).toISOString().split("T")[0] : "";
      endDate.value = dateValue.value ? new Date(dateValue.value.end).toISOString().split("T")[0] : "";
      joinedThaiDateString.value = `${convertToThaiDateString(startDate.value, yearEra.value)} - ${convertToThaiDateString(endDate.value, yearEra.value)}`;

      if (type === 1) {
         const resp: any = await reportService.getPdfData("sum-submit-late-order", {
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         pdfData.value = resp.data ? resp.data : [];
         await nextTick();
         if (pdf1Component.value && pdf1Component.value.generatePDF) {
            pdf1Component.value.generatePDF();
         } else {
            alert("error");
         }
      }

      if (type === 2) {
         const resp = await reportService.getPdfData("sum-submit-late-list", {
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         pdfData.value = resp.data ? resp.data : [];
         await nextTick();
         if (pdf2Component.value && pdf2Component.value.generatePDF) {
            pdf2Component.value.generatePDF();
         } else {
            alert("error");
         }
      }

      if (type === 3) {
         const resp = await reportService.getPdfData("user-document-count", {
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         pdfData.value = resp.data ? resp.data : [];
         await nextTick();
         if (pdf3Component.value && pdf3Component.value.generatePDF) {
            pdf3Component.value.generatePDF();
         } else {
            alert("error");
         }
      }

      if ([4, 5].includes(type)) {
         if (type === 4) {
            if (subType === 1) {
               const resp: any = await reportService.getPdfData("sum-vessel-agency", {
                  berthId: modalValue,
                  startDate: startDate.value,
                  endDate: endDate.value,
                  year: yearEra.value,
                  token: accessToken.value,
               });
               pdfData.value = resp.data ? resp.data : [];
               await nextTick();
               if (pdf4_1Component.value && pdf4_1Component.value.generatePDF) {
                  pdf4_1Component.value.generatePDF();
               } else {
                  alert("error");
               }
            }

            if (subType === 2) {
               const resp: any = await reportService.getPdfData("sum-port-due-agency", {
                  berthId: modalValue,
                  startDate: startDate.value,
                  endDate: endDate.value,
                  year: yearEra.value,
                  token: accessToken.value,
               });
               pdfData.value = resp.data ? resp.data : [];
               await nextTick();
               if (pdf4_2Component.value && pdf4_2Component.value.generatePDF) {
                  pdf4_2Component.value.generatePDF();
               } else {
                  alert("error");
               }
            }

            if (subType === 3) {
               const resp: any = await reportService.getPdfData("sum-cargo-value-port-agency", {
                  berthId: modalValue,
                  startDate: startDate.value,
                  endDate: endDate.value,
                  year: yearEra.value,
                  token: accessToken.value,
               });
               pdfData.value = resp.data ? resp.data : [];
               await nextTick();
               if (pdf4_3Component.value && pdf4_3Component.value.generatePDF) {
                  pdf4_3Component.value.generatePDF();
               } else {
                  alert("error");
               }
            }
         }

         if (type === 5) {
            if (subType === 1) {
               const resp: any = await reportService.getPdfData("sum-foreigner-agency", {
                  berthId: modalValue,
                  startDate: startDate.value,
                  endDate: endDate.value,
                  year: yearEra.value,
                  token: accessToken.value,
               });
               pdfData.value = resp.data ? resp.data : [];
               await nextTick();
               if (pdf5_1Component.value && pdf5_1Component.value.generatePDF) {
                  pdf5_1Component.value.generatePDF();
               } else {
                  alert("error");
               }
            }

            if (subType === 2) {
               const resp: any = await reportService.getPdfData("sum-foreigner-port-due-agency", {
                  berthId: modalValue,
                  startDate: startDate.value,
                  endDate: endDate.value,
                  year: yearEra.value,
                  token: accessToken.value,
               });
               pdfData.value = resp.data ? resp.data : [];
               await nextTick();
               if (pdf5_2Component.value && pdf5_2Component.value.generatePDF) {
                  pdf5_2Component.value.generatePDF();
               } else {
                  alert("error");
               }
            }

            if (subType === 3) {
               const resp: any = await reportService.getPdfData("sum-foreigner-cargo-value-port-agency", {
                  berthId: modalValue,
                  startDate: startDate.value,
                  endDate: endDate.value,
                  year: yearEra.value,
                  token: accessToken.value,
               });
               pdfData.value = resp.data ? resp.data : [];
               await nextTick();
               if (pdf5_3Component.value && pdf5_3Component.value.generatePDF) {
                  pdf5_3Component.value.generatePDF();
               } else {
                  alert("error");
               }
            }
         }
      }

      if (type === 6) {
         const resp: any = await reportService.getPdfData("document-count", {
            berthId: modalValue,
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         pdfData.value = resp.data.items ? resp.data.items : [];
         pdf6DataTotal.value = resp.data.total ? resp.data.total : {};
         await nextTick();
         if (pdf6Component.value && pdf6Component.value.generatePDF) {
            pdf6Component.value.generatePDF();
         } else {
            alert("error");
         }
      }

      if (type === 7) {
         const resp = await reportService.getPdfData("approved-agency", {
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value,
         });
         pdfData.value = resp.data ? resp.data : [];
         await nextTick();
         if (pdf7Component.value && pdf7Component.value.generatePDF) {
            pdf7Component.value.generatePDF();
         } else {
            alert("error");
         }
      }
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = t("please_select_filter");
      modalAlertMessage.value = t("report_filter_message");
      modalAlertType.value = "warning";
   }
};

const pdf1Component = ref();
const pdf2Component = ref();
const pdf3Component = ref();
const pdf6Component = ref();
const pdf7Component = ref();

const pdf4_1Component = ref();
const pdf4_2Component = ref();
const pdf4_3Component = ref();

const pdf5_1Component = ref();
const pdf5_2Component = ref();
const pdf5_3Component = ref();

const pdf6DataTotal = ref<any>({});
const berthReport6Type = ref<string>("");
const berthReport4Type = ref<string>("");
const berthReport5Type = ref<string>("");
const berthReport4_5Type = ref<string>("");
</script>
