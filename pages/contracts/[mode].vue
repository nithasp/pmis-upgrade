<template>
  <div id="contract">
    <h1 class="font-anuphan-semi-bold text-2xl md:text-[30px] text-black py-4">
      {{ $t("รายการสัญญา") }}
    </h1>
    <div class="bg-white p-4 md:p-6">
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div class="mb-4 md:mb-0">
          <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
            {{ $t("ข้อมูลสัญญา") }}
          </h1>
          <p class="mt-1 text-[#667085] text-sm">
            {{ $t("รายละเอียดข้อมูลสัญญา") }}
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-if="isEdit"
            class="border border-error-500 text-error-500 bg-white hover:bg-white min-w-[67px] h-[36px] justify-center"
            size="md"
            color="gray"
            :label="$t('cancel')"
            @click="navigateTo('/contracts')"
          />
          <UButton
            v-else
            class="border border-grayy-100 min-w-[67px] h-[36px] justify-center"
            size="md"
            color="gray"
            :label="$t(`${!isView ? 'cancel' : 'close'}`)"
            @click="navigateTo('/contracts')"
          />
          <UButton
            v-if="!isView"
            class="border border-primaryy-500 bg-primaryy-500 hover:bg-primaryy-500 text-grayy-25 min-w-[82px] h-[36px] justify-center"
            size="md"
            color="gray"
            :label="$t('save')"
            type="button"
            @click="handleSubmit"
          />
        </div>
      </header>
      <UDivider class="my-6" />
      <section
        id="contract-form-section1"
        class="border rounded-xl border-solid border-[#D0D5DD] p-4 md:p-8"
      >
        <div class="ship-info-content">
          <div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div v-if="!isView">
                  <Select
                    :label="$t('ท่าเทียบเรือ')"
                    :placeholder="$t('ท่าเทียบเรือ')"
                    :options="documentOptionsStore.berthsOption"
                    v-model="formGroup.berthId"
                    :error="isFieldError('berthId') ? fieldValidation.berthId.message : ''"
                    @change="getBerthName"
                    required
                  />
                </div>
                <div v-else>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">
                    {{ $t("port") }}
                  </h3>
                  <div class="text-grayy-75">
                    {{ formGroup.berthName || "-" }}
                  </div>
                </div>
              </div>

              <div>
                <Input
                  :label="$t('เลขที่สัญญา')"
                  :placeholder="$t('เลขที่สัญญา')"
                  v-model="formGroup.contractNo"
                  class="w-full"
                  :error="isFieldError('contractNo') ? fieldValidation.contractNo.message : ''"
                  :required="!isView"
                  :isView="isView"
                />
              </div>
  
              <div>
                <UFormGroup v-if="!isView" :label="$t('ระยะเวลาสัญญา เริ่มต้น')" :required="!isView">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <Input
                      name="start"
                      size="md"
                      variant="outline"
                      color="purple"
                      custom-icon="calendar"
                      v-model="formGroup.start"
                      :value="formGroup.start ? format(new Date(formGroup.start), 'd MMM, yyyy') : ''"
                      :placeholder="$t('ระยะเวลาสัญญา เริ่มต้น')"
                      :error="isFieldError('start') ? fieldValidation.start.message : ''"
                      :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                    />
                    <template #panel="{ close }">
                      <Datepicker
                        v-model="contractDateStart"
                        @close="close"
                        is-required
                        is24hr
                        type="normal"
                        mode="date"
                        @date-change="onContractDateStartChange"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
                <div v-else>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">
                    {{ $t("ระยะเวลาสัญญา เริ่มต้น") }}
                  </h3>
                  <div class="text-grayy-75">
                    {{ formGroup.start ? renderDateFormat(formGroup.start) : "" }}
                  </div>
                </div>
              </div>
  
              <div>
                <UFormGroup v-if="!isView" :label="$t('ระยะเวลาสัญญา สิ้นสุด')" :required="!isView">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <Input
                      name="end"
                      size="md"
                      variant="outline"
                      color="purple"
                      custom-icon="calendar"
                      v-model="formGroup.end"
                      :value="formGroup.end ? format(new Date(formGroup.end), 'd MMM, yyyy') : ''"
                      :placeholder="$t('ระยะเวลาสัญญา สิ้นสุด')"
                      :error="isFieldError('end') ? fieldValidation.end.message : ''"
                      :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                    />
                    <template #panel="{ close }">
                      <Datepicker
                        v-model="contractDateEnd"
                        @close="close"
                        is-required
                        is24hr
                        type="normal"
                        mode="date"
                        @date-change="onContractDateEndChange"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
                <div v-else>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">
                    {{ $t("ระยะเวลาสัญญา สิ้นสุด") }}
                  </h3>
                  <div class="text-grayy-75">
                    {{ formGroup.end ? renderDateFormat(formGroup.end) : "" }}
                  </div>
                </div>
              </div>
           
              <div>
                <InputNumber
                  :label="$t('อัตราเริ่มต้นของสัญญา (บาท)')"
                  name="initialRate"
                  placeholder="อัตราเริ่มต้นของสัญญา (บาท)"
                  v-model="formGroup.initialRate"
                  :decimal="2"
                  :error="isFieldError('initialRate') ? fieldValidation.initialRate.message : ''"
                  :required="!isView"
                  :isView="isView"
                  class="w-full"
                />
              </div>
          
              <div>
                <InputNumber
                  :label="$t('อัตราเพิ่มขึ้นในรอบปี (%)')"
                  name="annualIncreaseRate"
                  placeholder="อัตราเพิ่มขึ้นในรอบปี (%)"
                  v-model="formGroup.annualIncreaseRate"
                  :decimal="2"
                  :error="isFieldError('annualIncreaseRate') ? fieldValidation.annualIncreaseRate.message : ''"
                  :required="!isView"
                  :isView="isView"
                  class="w-full"
                />
              </div>
         
              <div>
                <InputNumber
                  :label="$t('รอบการเปลี่ยนแปลงอัตรา (ปี)')"
                  name="rateChangeCycle"
                  placeholder="รอบการเปลี่ยนแปลงอัตรา (ปี)"
                  v-model="formGroup.rateChangeCycle"
                  :decimal="0"
                  :error="isFieldError('rateChangeCycle') ? fieldValidation.rateChangeCycle.message : ''"
                  :required="!isView"
                  :isView="isView"
                  class="w-full"
                />
              </div>
       
              <div>
                <div v-if="!isView">
                  <Select
                    :label="$t('รอบการเปลี่ยนเริ่มต้นปีที่')"
                    searchable
                    :placeholder="$t('รอบการเปลี่ยนเริ่มต้นปีที่')"
                    :options="filteredYears"
                    v-model="formGroup.rateChangeStartYear"
                    required
                  />
                </div>
                <div v-else>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">
                    {{ $t("รอบการเปลี่ยนเริ่มต้นปีที่") }}
                  </h3>
                  <div class="text-grayy-75">
                    {{ formGroup.rateChangeStartYear }}
                  </div>
                </div>
              </div>
     
              <div v-if="!isView">
                <UFormGroup name="view_dashboard_document">
                  <Checkbox
                    :label="$t('สิ้นสุดก่อนสัญญา')"
                    :modelValue="isTerminateChecked"
                    @change="toggleSelection($event)"
                  />
                </UFormGroup>
              </div>
          
              <div v-if="!isView"></div>
            
              <div>
                <UFormGroup v-if="!isView" :label="$t('วันที่สิ้นสุดก่อนสัญญา')" :required="isTerminateChecked">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <Input
                      name="terminatedDate"
                      size="md"
                      variant="outline"
                      color="purple"
                      custom-icon="calendar"
                      v-model="formGroup.terminatedDate"
                      :disabled="!isTerminateChecked"
                      :value="formGroup.terminatedDate ? format(new Date(formGroup.terminatedDate), 'd MMM, yyyy') : ''"
                      :placeholder="$t('วันที่สิ้นสุดก่อนสัญญา')"
                      :error="isFieldError('terminatedDate') ? fieldValidation.terminatedDate.message : ''"
                      :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                    />
                    <template #panel="{ close }">
                      <Datepicker
                        v-model="terminatedDate"
                        @close="close"
                        is-required
                        is24hr
                        type="normal"
                        mode="date"
                        @date-change="onTerminateDateChange"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
                <div v-else>
                  <h3 class="font-anuphan-medium text-sm text-gray-400">
                    {{ $t("วันที่สิ้นสุดก่อนสัญญา") }}
                  </h3>
                  <div class="text-grayy-75">
                    {{ formGroup.terminatedDate ? renderDateFormat(formGroup.terminatedDate) : "-" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UDivider class="my-4" />
       
          <div id="rate-list">
            <div class="flex items-center justify-between flex-wrap">
              <h1 class="font-anuphan-semi-bold text-gray-400">
                {{ $t("อัตราสินค้าผ่านท่า") }}
              </h1>
              <UButton
                v-if="!isView"
                icon="i-heroicons-plus-circle"
                size="md"
                :label="$t('คำนวนอัตราสินค้าผ่านท่า')"
                @click="getRate"
              />
            </div>
            <div class="overflow-x-auto mt-6">
              <UTable
                :rows="formGroup.annualRates"
                :columns="[
                  { key: 'id', label: t('id'), class: 'min-w-[65px]' },
                  { key: 'start', label: t('วันที่เริ่ม') },
                  { key: 'end', label: t('วันที่สิ้นสุด') },
                  { key: 'rate', label: t('อัตรา') },
                  { key: 'actions' },
                ]"
                :ui="{
                  wrapper: 'border rounded-lg border-solid border-[#D0D5DD]',
                  thead: 'bg-primary-50',
                  tbody: 'border-none',
                }"
              >
                <template #id-data="{ index }">
                  <div class="pl-3">{{ index + 1 }}</div>
                </template>

                <template #start-data="{ row }">
                  <div>{{ row.start ? renderDateFormat(row.start) : '' }}</div>
                </template>

                <template #end-data="{ row }">
                  <div>{{ row.end ? renderDateFormat(row.end) : '' }}</div>
                </template>

                <template #rate-data="{ row }">
                  <div>{{ getInputDecimal(row.rate?.toString(), 3) }}</div>
                </template>

                <template #actions-data="{ index, row }">
                  <UButton
                    v-if="!isView"
                    icon="i-heroicons-pencil"
                    size="md"
                    @click="handleEditRate(row, index)"
                  />
                </template>
              </UTable>
            </div>
          </div>

          <UDivider class="my-4" />
          <div id="containerUpload">
            <MultipleUploadFiles
              :required="isRequiredFile"
              :filesValue="uploadFiles"
              :getFiles="getFiles"
              :isView="isView"
            />
          </div>
        </div>
      </section>
    </div>

    <DialogConfirm
      :icon="dialogConfirmProps.icon"
      :title="dialogConfirmProps.title"
      :desc="dialogConfirmProps.desc"
      :type="dialogConfirmProps.type"
      :colorConfirm="dialogConfirmProps.colorConfirm"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogConfirmOpen"
      :dialogCancel="dialogConfirmCancel"
      :dialogConfirm="dialogConfirm"
    />
    <DialogConfirm
      :title="$t('leave_this_page_title')"
      :desc="$t('leave_this_page_message')"
      icon="warning"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isConfirmLeaveDialogOpen"
      :dialogCancel="handleCancelLeave"
      :dialogConfirm="handleConfirmLeave"
    />
    <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseDialogAlert"
      :btnName="$t('close')"
    />
    <DialogEditRate
      :labelConfirm="t('confirm')"
      :label-cancel="$t('cancel')"
      :formGroup="formGroup"
      :index="rateEditIndex"
      :isDialogOpen="editRateDialogOpen"
      :dialogCancel="dialogCancel"
      :dialogConfirm="handleConfirmEditRate"
    />
    <Loading v-if="isLoading" />
  </div>
</template>


<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import InputNumber from "~/components/form/input-number.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";

import MultipleUploadFiles from '~/components/contract-form/multipleUploadFiles.vue';

const documentOptionsStore = useDocumentOptionsStore();
import useContractsService from "~/core/services/contractsService";
const contractsService = useContractsService();
import { format } from "date-fns";
import type { IContractDetail, IContractPayload } from "~/core/interfaces/IContracts";
import Checkbox from "~/components/form/checkbox.vue";
import DialogEditRate from "~/components/dialog/contracts/edit-rate-dialog.vue";
import type { IUploadFile } from "~/core/interfaces/IUploadFile";

const { t, locale } = useI18n();
const dialogConfirmProps = ref<any>({
    title: "",
    desc: "",
    type: "",
    icon: "",
    colorConfirm: "",
});
const dialogAlertProps = ref<any>({
    title: "",
    desc: "",
    type: "",
});

const contractDateStart = ref<Date>(new Date());
const contractDateEnd = ref<Date>(new Date());
const terminatedDate = ref<Date | null>(null);
const rateChangeStartYear = ref<Date>(new Date());
const editRateDialogOpen = ref(false)
const rateEditIndex = ref<number | undefined>(undefined)

const route = useRoute();
const query: any = route.query;
const isEdit = route.params.mode === "edit";
const isView = route.params.mode === "view";
const isLoading = ref<boolean>(false);
const isTerminateChecked = ref<boolean>(false)
const formGroup = ref<IContractDetail | any>({
    id: 0,
    contractNo: "",
    berthId: 0,
    berthName: "",
    start: null,
    end: null,
    initialRate: "",
    annualIncreaseRate: "",
    rateChangeCycle: "",
    rateChangeStartYear: "",
    annualRates: [],
    uploadFiles: [] as IUploadFile[],
    terminatedDate: null
});
const isFirstRender = ref<boolean>(true);

const isRequiredFile = ref(false)
const uploadFiles = ref<any>([]);

const filteredYears = computed(() => {
    if (!formGroup.value.start || !formGroup.value.end || !formGroup.value.rateChangeCycle) return []; // Ensure rateChangeCycle is available

    const minYear = new Date(formGroup.value.start).getFullYear();
    const maxYear = new Date(formGroup.value.end).getFullYear();

    // Ensure rateChangeCycle is greater than 0
    const cycle = Math.max(formGroup.value.rateChangeCycle, 1);

    const years = [];
    for (let year = minYear; year <= maxYear; year += cycle) {
        years.push({
            name: year.toString(),
            id: year,
        });
    }

    return years;
});


onMounted(() => {
    getMasterDataList();
    if (isEdit || isView) {
        getContractDetail();
    }

    console.log('fieldValidation', fieldValidation.value)
});

const toggleSelection = (e: any) => {
    isTerminateChecked.value = e
};

const handleEditRate = (row: any, index: any) => {
    // console.log('handle edit rate', index, row);
    rateEditIndex.value = index
    editRateDialogOpen.value = true
};

const dialogCancel = () => {
    editRateDialogOpen.value = false
};

watch(
    () => ({
        start: formGroup.value.start,
        end: formGroup.value.end,
        initialRate: formGroup.value.initialRate,
        annualIncreaseRate: formGroup.value.annualIncreaseRate,
        rateChangeCycle: formGroup.value.rateChangeCycle,
    }),
    (newValue, oldValue) => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
            return;
        }
        if (
            newValue.start !== oldValue.start ||
            newValue.end !== oldValue.end ||
            newValue.initialRate !== oldValue.initialRate ||
            newValue.annualIncreaseRate !== oldValue.annualIncreaseRate ||
            newValue.rateChangeCycle !== oldValue.rateChangeCycle
        ) {
            formGroup.value.annualRates = [];
        }
    }
);

watch(isTerminateChecked, (newValue) => {
    if (!newValue) {
        formGroup.value.terminatedDate = null;
    }
});


const getMasterDataList = async () => {
    documentOptionsStore.getPurposeTypeOptions();
    documentOptionsStore.getCargoTypesOptions();
    documentOptionsStore.getCargoWharfageOptions();
    documentOptionsStore.getProductGroupOptions();
    documentOptionsStore.getProductTypesOptions();
    documentOptionsStore.getProductOptions();
    documentOptionsStore.getBerthsOptions();
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
    isDialogAlertOpen.value = status;
    if (dialogAlertProps.value.type === "success") {
        notAllowNavigate.value = false;
        navigateTo("/contracts");
    }
};


const isDialogConfirmOpen = ref(false);
const dialogConfirm = async () => {
    isLoading.value = true;
    const selectedPayload: IContractPayload = {
        contractNo: formGroup.value.contractNo,
        berthId: formGroup.value.berthId,
        berthName: formGroup.value.berthName,
        start: convertTimezone(new Date(formGroup.value.start), 7, false),
        end: convertTimezone(new Date(formGroup.value.end), 7, false),
        initialRate: removeCommaAndConvertToNumber(formGroup.value.initialRate),
        annualIncreaseRate: removeCommaAndConvertToNumber(formGroup.value.annualIncreaseRate),
        rateChangeCycle: removeCommaAndConvertToNumber(formGroup.value.rateChangeCycle),
        rateChangeStartYear: formGroup.value.rateChangeStartYear,
        terminatedDate: formGroup.value.terminatedDate ? convertTimezone(new Date(formGroup.value.terminatedDate), 7, false) : null,
        annualRates: formGroup.value.annualRates,
        uploadFiles: uploadFiles.value,
    };
    const res: any = isEdit ? await contractsService.updateContract(query.id, selectedPayload) : await contractsService.createContract(selectedPayload);
    const isSuccess = res.statusCode === 200;
    dialogAlertProps.value = {
        title: isSuccess ? t("บันทึกสัญญา")
            : locale.value === "th" && res.translation.includes("duplicate")
                ? "เลขที่สัญญานี้มีแล้วในระบบ"
                : locale.value === "en" && res.translation.includes("duplicate")
                    ? "Contract number already exists"
                    : res.message,
        desc: t(isSuccess ? "การบันทึกสัญญาของคุณสำเร็จแล้ว" : ""),
        type: isSuccess ? "success" : "danger",
    };
    isDialogAlertOpen.value = true;
    isDialogConfirmOpen.value = false;
    isLoading.value = false;
};
const dialogConfirmCancel = () => {
    isDialogConfirmOpen.value = false;
};

const handleConfirmEditRate = async () => {
    editRateDialogOpen.value = false
};

const getFiles = (value: any) => {
    uploadFiles.value = value.map(({ isError, ...i }: { isError: boolean }) => ({ ...i, extension: "application/xml" }));
};

const handleSubmit = () => {
    allFieldPristine();
    if (!isFormGroupValid(formGroup.value)) {
        console.log('isFormGroupValid', isFormGroupValid(formGroup.value));
        return;
    }
    dialogConfirmProps.value = {
        title: t("บันทึกสัญญา"),
        desc: t("คุณยืนยันการบันทึกสัญญานี้ใช่หรือไม่"),
        icon: "warning",
    };
    isDialogConfirmOpen.value = true;
};

const fieldValidation = ref<any>({
    berthId: { message: t("required"), pristine: false },
    contractNo: { message: t("required"), pristine: false },
    start: { message: t("required"), pristine: false },
    end: { message: t("required"), pristine: false },
    initialRate: { message: t("required"), pristine: false },
    annualIncreaseRate: { message: t("required"), pristine: false },
    rateChangeCycle: { message: t("required"), pristine: false },
    rateChangeStartYear: { message: t("required"), pristine: false },
    terminatedDate: { message: t("required"), pristine: false },
});
const allFieldPristine = (pristineValue: boolean = true) => {
    fieldValidation.value = Object.keys(fieldValidation.value).reduce((acc: any, key) => {
        acc[key] = { ...fieldValidation.value[key], pristine: pristineValue };
        return acc;
    }, {});
};

const isFieldError = (field: string) => {
    const value = formGroup.value[field];
    const pristine = fieldValidation.value[field].pristine;

    // Validation for terminatedDate: Ensure it's only checked if isTerminateChecked is true
    if (field === "terminatedDate") {
        if (isTerminateChecked.value && !value) {
            fieldValidation.value[field].message = t("required");
            return true;
        }
        // Validate terminatedDate is greater than start date
        if (value && new Date(value) <= new Date(formGroup.value.start)) {
            fieldValidation.value[field].message = t("วันที่สิ้นสุดก่อนสัญญาต้องมากกว่าระยะเวลาสัญญาเริ่มต้น");
            return true;
        }
        // Validate terminatedDate is less than or equal to end date
        if (value && new Date(value) > new Date(formGroup.value.end)) {
            fieldValidation.value[field].message = t("วันที่สิ้นสุดก่อนสัญญาต้องน้อยกว่าหรือเท่ากับระยะเวลาสัญญาสิ้นสุด");
            return true;
        }
        return false;
    }

    // Validation for other fields
    if (!value && pristine) {
        fieldValidation.value[field].message = t("required");
        return true;
    }

    // Validate "end" date for contract period (start <= end)
    if (field === "end" && value && new Date(value) < new Date(formGroup.value.start)) {
        fieldValidation.value[field].message = t("ระยะเวลาสัญญาสิ้นสุดต้องมากกว่าหรือเท่ากับระยะเวลาสัญญาเริ่มต้น");
        return true;
    }

    return false;
};


// const isFormGroupValid = ({ annualRates, berthName, id, start, end, ...fieldsToCheck }: IContractDetail) => {
//     return Object.values(fieldsToCheck).every((value) => value) && start && end && new Date(start) <= new Date(end);
// };

const isFormGroupValid = ({ annualRates, uploadFiles, berthName, id, start, end, terminatedDate, ...fieldsToCheck }: IContractDetail) => {
    // Validate all other fields
    const allFieldsValid = Object.values(fieldsToCheck).every((value) => value);
    // Validate date range (start <= end)
    const dateRangeValid = start && end && new Date(start) <= new Date(end);
    // Validate terminatedDate only if isTerminateChecked is true
    const terminatedDateValid = !isTerminateChecked.value || (!!terminatedDate && terminatedDate !== null);
    // Validate terminatedDate to be greater than start date
    const terminatedDateGreaterThanStart = !isTerminateChecked.value || (terminatedDate && new Date(terminatedDate) > new Date(start));
    // Validate terminatedDate to be less than or equal to end date
    const terminatedDateLessThanOrEqualToEnd = !isTerminateChecked.value || (terminatedDate && new Date(terminatedDate) <= new Date(end));
    // Return the combined validation result
    return allFieldsValid && dateRangeValid && terminatedDateValid && terminatedDateGreaterThanStart && terminatedDateLessThanOrEqualToEnd;
};


const onContractDateStartChange = (newDate: Date) => {
    formGroup.value.start = newDate ? new Date(newDate).toISOString() : "";
};
const onContractDateEndChange = (newDate: Date) => {
    formGroup.value.end = newDate ? new Date(newDate).toISOString() : "";
};
const onTerminateDateChange = (newDate: Date) => {
    formGroup.value.terminatedDate = newDate ? new Date(newDate).toISOString() : "";
};

const getBerthName = (berthId: number) => {
    formGroup.value.berthName = documentOptionsStore.berthsOption.find((item: any) => item.id === berthId)?.name;
};

const getContractDetail = async () => {
    isLoading.value = true;
    const res = await contractsService.getContractDetail(query.id);
    const isSuccess = res.statusCode === 200;
    if (isSuccess) {
        formGroup.value = {
            ...res.data,
            initialRate: res.data.initialRate ? getInputDecimal(res.data.initialRate?.toString(), 2) : "",
            annualIncreaseRate: res.data.annualIncreaseRate ? getInputDecimal(res.data.annualIncreaseRate?.toString(), 2) : "",
            rateChangeCycle: res.data.rateChangeCycle ? getInputDecimal(res.data.rateChangeCycle?.toString(), 0) : "",
        };
        contractDateStart.value = res.data.start ? new Date(res.data.start) : new Date();
        contractDateEnd.value = res.data.end ? new Date(res.data.end) : new Date();
        rateChangeStartYear.value = res.data.rateChangeStartYear;
        terminatedDate.value = res.data.terminatedDate ? new Date(res.data.terminatedDate) : null;
        isTerminateChecked.value = res.data.terminatedDate != null

        formGroup.value.annualRates = res.data.annualRates;
        uploadFiles.value = res.data.uploadFiles;
    }
    isLoading.value = false;
}

const getRate = async () => {
    isLoading.value = true;
    const filterRate = {
        start: formGroup.value.start ? adjustToUTC(formGroup.value.start) : "",
        end: formGroup.value.end ? adjustToUTC(formGroup.value.end) : "",
        initialRate: formGroup.value.initialRate ? removeCommaAndConvertToNumber(formGroup.value.initialRate) : "",
        annualIncreaseRate: formGroup.value.annualIncreaseRate ? removeCommaAndConvertToNumber(formGroup.value.annualIncreaseRate) : "",
        rateChangeCycle: formGroup.value.rateChangeCycle ? removeCommaAndConvertToNumber(formGroup.value.rateChangeCycle) : "",
        rateChangeStartYear: formGroup.value.rateChangeStartYear,
    };
    const res = await contractsService.getRate(filterRate);
    const isSuccess = res.statusCode === 200;
    if (!isSuccess) {
        dialogAlertProps.value = {
            title: locale.value === "th" ? res.message : res.translation,
            desc: "",
            type: "danger",
        };
        isDialogAlertOpen.value = true;
    } else {
        if (res.data.error) {
            dialogAlertProps.value = {
                title: locale.value === "th" ? res.data.error.message : res.data.error.translation,
                desc: "",
                type: "danger",
            };
            isDialogAlertOpen.value = true;
        }

        if (res.data?.data || res.data.data?.length) {
            formGroup.value.annualRates = res.data.data;
        } else {
            formGroup.value.annualRates = [];
        }
    }
    isLoading.value = false;
};

const nextRoute = ref<any>(null);
const notAllowNavigate = ref<Boolean>(true);
const isConfirmLeaveDialogOpen = ref<boolean>(false);
const handleConfirmLeave = () => {
    isConfirmLeaveDialogOpen.value = false;
    notAllowNavigate.value = false;
    if (nextRoute.value) {
        navigateTo(nextRoute.value);
    }
};
const handleCancelLeave = () => {
    isConfirmLeaveDialogOpen.value = false;
    nextRoute.value = null;
};
onBeforeRouteLeave((to, from, next) => {
    if (notAllowNavigate.value) {
        isConfirmLeaveDialogOpen.value = true;
        nextRoute.value = to;
        next(false);
    } else {
        next();
    }
});
</script>