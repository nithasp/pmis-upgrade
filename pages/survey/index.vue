<template>
   <header class="mobile:flex mobile:items-center mobile:justify-between">
      <h1 class="font-anuphan-semi-bold text-[30px] text-black">{{ $t("แบบสอบถามความพึงพอใจ") }}</h1>
      <div class="flex gap-3 mt-2 mobile:mt-0 mobile:justify-end">
         <UButton class="[&_span]:font-anuphan-semi-bold w-full mobile:w-[85px] h-10" outlined size="md" @click="() => navigateTo(`/survey/create`)">
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
      <div class="flex justify-between gap-4">
         <div class="flex gap-4 w-full">
            <UFormGroup :label="$t('วันที่เริ่มเผยแพร่')" class="max-w-[280px] w-full">
               <UPopover :popper="{ placement: 'bottom-start' }">
                  <Input
                     name="etd"
                     size="md"
                     variant="outline"
                     color="purple"
                     custom-icon="calendar"
                     :value="publishDate ? `${format(publishDate.start, 'd MMM, yyy')} - ${format(publishDate.end, 'd MMM, yyy')}` : ''"
                     :placeholder="$t('วันที่เริ่มเผยแพร่')"
                     :ui="{
                        wrapper: 'w-full rounded-md bg-white',
                     }"
                  />

                  <template #panel="{ close }">
                     <Datepicker v-model="selectPublishDate" @close="close" :onDateChange="onSurveyDateChange" />
                  </template>
               </UPopover>
            </UFormGroup>
         </div>
         <div class="content-end">
            <UButton @click="handleResetFilter" icon="i-heroicons-arrow-path" />
         </div>
      </div>
   </div>
   <div id="sailing-log-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between items-center">
            <h1 class="font-normal text-base text-grayy-25">{{ $t("แบบสอบถามทั้งหมด") }}</h1>
            <div class="font-anuphan-medium rounded-full bg-purple-25 text-xs text-primaryy-500 py-1 px-2 ml-2 max-h-[24px] text-nowrap">{{ surveyList.length }} {{ $t("items") }}</div>
         </div>
      </div>

      <UTable
         @select="selectRow"
         :columns="columns"
         :rows="surveyList"
         :ui="{
            base: 'u-table-list',
         }"
      >
         <template v-for="column in filteredColumns" :key="column.key" v-slot:[column.key+'-header']>
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

         <template #publishDate-data="{ row }">
            <div>{{ row.publishDate ? renderDateFormat(row.publishDate) : "" }}</div>
         </template>

         <template #endDate-data="{ row }">
            <div>{{ row.endDate ? renderDateFormat(row.endDate) : "" }}</div>
         </template>

         <template #actions-data="{ row }">
            <div class="text-right">
               <UDropdown :items="getMenuTable(row)" @click.stop>
                  <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
               </UDropdown>
            </div>
         </template>
      </UTable>

      <div class="flex justify-between px-6 py-3 overflow-auto">
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
      :title="$t('ลบแบบสอบถาม')"
      :desc="$t('คุณต้องการลบแบบสอบถามนี้ใช่หรือไม่ หากลบแล้วจะไม่สามารถกู้คืนได้อีก')"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogDeleteSurveyOpen"
      :dialogCancel="dialogDeleteSurveyCancel"
      :dialogConfirm="dialogDeleteSurveyConfirm"
   />
   <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseDialogAlert"
      :btnName="$t('close')"
   />
   <DialogSendEmailSurvey
      :isDialogOpen="isDialogSendEmailSurveyOpen"
      :dialogCancel="dialogSendEmailSurveyCancel"
      :dialogConfirm="dialogSendEmailSurveyConfirm"
      :surveyId="surveyId"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogSendEmailSurvey from "~/components/dialog/survey/send-email-survey.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import AddIconWhite from "~/assets/icons/fi-rs-add-white.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import TrashIcon from "~/assets/icons/fi-rs-trash.svg";
import PaperPlaneIcon from "~/assets/icons/fi-rs-paper-plane.svg";
import FileCheckIcon from "~/assets/icons/fi-rs-file-check.svg";
import { format } from "date-fns";
import type { IVesselImportList } from "~/core/interfaces/IVesselImport.ts";
import type { IContractDetail, IContractFilter } from "~/core/interfaces/IContracts";
import type { ISurveyFilter, ISurveyList } from "~/core/interfaces/ISurvey";
import type { IDateRange } from "~/core/interfaces/IDate";
import useSurveyService from "~/core/services/surveyService";

const { t } = useI18n();
const surveyService = useSurveyService();
const isLoading = ref<boolean>(false);
const allowFetch = ref<boolean>(true);
const sortField = ref("");
const sortOrder = ref("");
const filter = ref<ISurveyFilter>({
   limit: 10,
   page: 1,
   beginDate: "",
   endDate: "",
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
      key: "name",
      label: t("ชื่อแบบสอบถาม"),
      sortable: true,
   },
   {
      key: "publishDate",
      label: t("วันที่เริ่มเผยแพร่"),
      sortable: true,
   },
   {
      key: "endDate",
      label: t("วันที่สิ้นสุดเผยแพร่"),
      sortable: true,
   },
   {
      key: "actions",
      sortable: false,
   },
];
const surveyList = ref<ISurveyList[]>([]);
const surveyId = ref<number>(0);
const publishDate = ref<IDateRange | null>(null);
const selectPublishDate = ref<IDateRange>({ start: new Date(), end: new Date() });

const handleResetFilter = () => {
   allowFetch.value = true;
   filter.value.limit = 10;
   filter.value.page = 1;
   filter.value.beginDate = "";
   filter.value.endDate = "";
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   publishDate.value = null;
   selectPublishDate.value = { start: new Date(), end: new Date() };
};

onMounted(() => {
   getSurveyList();
});

watch(
   () => ({
      page: filter.value.page,
      limit: filter.value.limit,
      publishDate: publishDate.value,
   }),
   (newValue, oldValue) => {
      if (newValue.publishDate !== oldValue.publishDate) {
         filter.value.beginDate = newValue.publishDate ? adjustToUTC(newValue.publishDate.start) : "";
         filter.value.endDate = newValue.publishDate ? adjustToUTC(newValue.publishDate.end) : "";
      }
      if (newValue.page !== oldValue.page) {
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
   getSurveyList();
});

const onPageChange = (newPage: number) => {
   filter.value.page = newPage;
   getSurveyList();
};

const getSurveyList = async () => {
   isLoading.value = true;
   const resp = await surveyService.getSurveyList(filter.value);
   if (resp.statusCode === 200) {
      surveyList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
   allowFetch.value = false;
};

const deleteSurvey = async () => {
   isLoading.value = true;

   const resp = await surveyService.deleteSurvey(surveyId.value);
   const isSuccess = resp.statusCode === 200;
   dialogAlertProps.value = {
      title: t(isSuccess ? "ลบแบบสอบถาม" : "error_title"),
      desc: t(isSuccess ? "การลบแบบสอบถามของคุณสำเร็จแล้ว" : "error_try_again"),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogDeleteSurveyOpen.value = false;
   isLoading.value = false;
};

const getMenuTable = (row: IContractDetail) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`/survey/edit?id=${row.id}`);
            },
         },
         {
            label: t("แสดงตัวอย่าง"),
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               window.open(`/survey/answer/view?id=${row.id}`, "_blank");
            },
         },
         {
            label: t("ส่ง"),
            avatar: {
               src: PaperPlaneIcon,
            },
            click: () => {
               surveyId.value = row.id;
               isDialogSendEmailSurveyOpen.value = true;
            },
         },
         {
            label: t("ผลประเมิน"),
            avatar: {
               src: FileCheckIcon,
            },
            click: () => {
               navigateTo(`/survey/result?id=${row.id}`);
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: TrashIcon,
            },
            click: () => {
               surveyId.value = row.id;
               isDialogDeleteSurveyOpen.value = true;
            },
         },
      ],
   ];
   return items;
};

const isDialogDeleteSurveyOpen = ref(false);
const dialogDeleteSurveyConfirm = async () => {
   deleteSurvey();
};
const dialogDeleteSurveyCancel = () => {
   isDialogDeleteSurveyOpen.value = false;
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
   filter.value.page = 1;
   getSurveyList();
};

const isDialogSendEmailSurveyOpen = ref(false);
const handleSendEmailSurvey = (status: boolean) => {
   isDialogSendEmailSurveyOpen.value = status;
};
const dialogSendEmailSurveyCancel = () => {
   isDialogSendEmailSurveyOpen.value = false;
};
const dialogSendEmailSurveyConfirm = (status: boolean, type: string = "") => {
   isDialogSendEmailSurveyOpen.value = status;
   if (type === "refresh") {
      filter.value.page = 1;
      getSurveyList();
   }
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

const onSurveyDateChange = (newDate: IDateRange) => {
   publishDate.value = newDate;
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
   getSurveyList();
};
</script>
