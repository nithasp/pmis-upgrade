<template>
    <div class="mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('vessel_management') }}</h1>
    </div>
    <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
        <div id="ship-agent-form-content" class="bg-white px-8 py-6  rounded-[0px_0px_20px_20px]">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h1 class="font-semibold text-lg text-grayy-400">เพิ่มข้อมูลเรือ</h1>
                    <div class="mt-1 text-grayy-75 text-sm">ระบุรายละเอียดข้อมูลเรือ</div>
                </div>
                <div class="flex items-center">
                    <UButton @click="handleCancleCreateVessel" class="mx-1 border border-grayy-100" size="md"
                        color="gray" label="ยกเลิก" />
                    <UButton class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50" size="md"
                        label="เพิ่มเรือใหม่" type="submit" @click="() => isCreateAndGoToRequest = false" />
                    <UButton class="ml-1" size="md" label="เพิ่มเรือและยื่นคำร้อง" type="submit"
                        @click="() => isCreateAndGoToRequest = true" />
                </div>
            </div>
            <UDivider />

            <div class="border border-grayy-100 p-8 rounded-xl mt-6">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <UFormGroup label="เจ้าของเรือ" name="owner" required>
                            <UInputMenu v-model="formGroup.owner" size="md" variant="outline" color="purple"
                                :search="onSearchVesselOwners" placeholder="ค้นหา" option-attribute="name" trailing
                                by="id" @change="handleChangeOwner" />
                        </UFormGroup>

                    </div>
                    <div class="col-span-2">
                        <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId" required>
                            <USelectMenu v-model="formGroup.vesselFlagId" size="md" variant="outline" color="purple"
                                value-attribute="id" option-attribute="name" searchable clear-search-on-close
                                :options="vesselOptionsStore.vesselFlagsOption" placeholder="สัญชาติเรือ/ธงเรือ">
                                <template #leading>
                                    <UAvatar v-if="vesselFlagData.avatar" size="xs" :src="vesselFlagData.avatar"
                                        alt="Avatar" />
                                    <NuxtIcon v-else name="flag" size="xl" />
                                </template>
                            </USelectMenu>
                        </UFormGroup>

                    </div>
                    <div class="col-span-1">
                        <Input label="ชื่อเรือ" placeholder="ชื่อเรือ" name="name" required v-model="formGroup.name" />
                    </div>
                    <div class="col-span-1">
                        <USelect label="ประเภทเรือ" placeholder="ประเภทเรือ" name="vesselTypeId" required
                            v-model="formGroup.vesselTypeId" :options="vesselOptionsStore.vesselTypeOption" />
                    </div>
                    <div class="col-span-1">
                        <Input label="หมายเลข IMO" placeholder="หมายเลข IMO" name="imoNumber" :required="isOtherCountry"
                            v-model="formGroup.imoNumber" />
                    </div>
                    <div class="col-span-1">
                        <Input label="หมายเลข MMSI" placeholder="หมายเลข MMSI" name="mmsiNumber"
                            v-model="formGroup.mmsiNumber" />
                    </div>
                    <div class="col-span-1">
                        <Input label="หมายเลขทะเบียนเรือ" placeholder="หมายเลขทะเบียนเรือ" name="officialNumber"
                            :required="!isOtherCountry" v-model="formGroup.officialNumber" />
                    </div>
                    <div class="col-span-1">
                        <Input label="สัญญาณเรียกขาน" placeholder="สัญญาณเรียกขาน" name="callSign"
                            :required="isOtherCountry" v-model="formGroup.callSign" />
                    </div>
                    <div v-show="!isOtherCountry" class="col-span-1">
                        <UFormGroup name="vesselLicenseExpiredDate" :label="$t('วันหมดอายุใบอนุญาตใช้เรือ')"
                            :required="!isOtherCountry">
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <Input size="md" variant="outline" color="purple" custom-icon="calendar"
                                    v-model="formGroup.vesselLicenseExpiredDate"
                                    :value="formGroup.vesselLicenseExpiredDate ? `${format(new Date(formGroup.vesselLicenseExpiredDate), 'd MMM, yyy')}` : ''"
                                    :placeholder="$t('วันหมดอายุใบอนุญาตใช้เรือ')"
                                    :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                                    @blur="validate('vesselLicenseExpiredDate')"
                                    @input="validate('vesselLicenseExpiredDate')"
                                    :error="getError('vesselLicenseExpiredDate') || ''" />

                                <template #panel="{ close }">
                                    <VDatepicker v-model="licenseExpiredDate" @close="close" type="normal" />
                                </template>
                            </UPopover>
                            <template #help>
                                <span v-if="daysRemaining > 0 && daysRemaining <= 30" class="text-[#F04438]">
                                    ใบอนุญาตใช้เรือจะหมดอายุในอีก {{ daysRemaining }} วัน
                                </span>
                                <span v-else-if="daysRemaining <= 0" class="text-[#F04438]">
                                    ใบอนุญาตทะเบียนเรือหมดอายุแล้ว
                                </span>
                            </template>

                        </UFormGroup>

                    </div>
                </div>
                <UDivider class="my-4" />
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-1">
                        <NumericInput label="น้ำหนักบรรทุก" placeholder="0.00" name="loadWeight" required
                            v-model="formGroup.loadWeight" suffix="t" />
                    </div>
                    <div class="col-span-1">
                        <NumericInput label="Gross Tonnage" placeholder="0.000" name="grossTonnage" required
                            v-model="formGroup.grossTonnage" type="number" suffix="t" decimalPlaces="3" />
                    </div>
                    <div class="col-span-1">
                        <NumericInput label="Net Tonnage" placeholder="0.00" name="netTonnage" required
                            v-model="formGroup.netTonnage" type="number" suffix="t" />
                    </div>
                    <div class="col-span-1">
                        <NumericInput label="ความยาว" placeholder="0.00" name="lengthOverall" required
                            v-model="formGroup.lengthOverall" type="number" suffix="m" />
                    </div>
                    <div class="col-span-1">
                        <NumericInput label="ความกว้าง" placeholder="0.00" name="breadthExtreme" required
                            v-model="formGroup.breadthExtreme" type="number" suffix="m" />
                    </div>
                    <div class="col-span-1">
                        <NumericInput label="กินน้ำลึก" placeholder="0.00" name="depth" required
                            v-model="formGroup.depth" type="number" suffix="m" />
                    </div>
                    <div class="col-span-1">
                        <Input label="เครื่องจักรใหญ่" placeholder="เครื่องจักรใหญ่" name="mainEngine"
                            v-model="formGroup.mainEngine" />
                    </div>
                    <div class="col-span-1">
                        <Input label="ยี่ห้อและรุ่น" placeholder="ยี่ห้อและรุ่น" name="bandAndModel"
                            v-model="formGroup.bandAndModel" />
                    </div>
                </div>
                <UDivider class="my-4" />
                <div id="containerUpload">
                    <h2 class="font-bold text-grayy-400">นำเข้าเอกสารประกอบดังต่อไปนี้</h2>
                    <span class="text-grayy-500 mr-2 my-3">รองรับสกุลไฟล์ .pdf และอัปโหลดไฟล์ไม่เกิน 10 MB</span>
                    <div class="flex justify-end">
                        <a :href="downloadUrl" class="flex items-center cursor-pointer" target="_blank">
                            <span class="text-primaryy-500 mr-2 my-3">ดาวน์โหลดตัวอย่างเอกสาร</span>
                            <NuxtIcon name="download" />
                        </a>
                    </div>
                </div>
                <div class="grid grid-cols-[1fr_1fr] gap-4 mt-4">
                    <FileUpload id="shipParticulars" label="Ship’s Particulars" name="shipParticulars" required
                        v-model="shipParticulars" :type="FileVesselTypeEnum.shipParticulars" />

                    <FileUpload id="shipRegistry" label="Ship Registry" name="shipRegistry" required
                        v-model="shipRegistry" :type="FileVesselTypeEnum.shipRegistry" />
                    <FileUpload id="internationTonnageCert" label="International Tonnage Certificate (1969)"
                        name="internationTonnageCert" required v-model="internationTonnageCert"
                        :type="FileVesselTypeEnum.internationTonnageCert" />

                    <FileUpload id="last10Ports" label="Last 10 Ports" name="last10Ports" required v-model="last10Ports"
                        :type="FileVesselTypeEnum.last10Ports" />
                    <FileUpload v-if="!isOtherCountry" id="powerOfAttorney"
                        label="หนังสือมอบอำนาจถูกต้องตามกฏหมาย (กรณีเรือไทย)" name="powerOfAttorney"
                        v-model="powerOfAttorney" required :type="FileVesselTypeEnum.powerOfAttorney" />
                </div>
            </div>
        </div>
    </UForm>
    <DialogConfirm title="เพิ่มเรือใหม่" desc="คุณยืนยันการเพิ่มเรือใหม่นี้ใช่หรือไม่" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmDialogOpen" :dialogCancel="dialogCancel"
        :dialogConfirm="dialogConfirm" />
    <DialogConfirm title="ต้องการออกจากหน้านี้" desc="คุณยังไม่ได้บันทึกรายการ ข้อมูลคุณอาจสูญหาย" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmLeaveDialogOpen" :dialogCancel="handleCancelLeave"
        :dialogConfirm="handleConfirmLeave" />
    <DialogConfirm title="ยกเลิกการบันทึกข้อมูล" desc="คุณยังไม่ได้บันทึกรายการ ข้อมูลคุณอาจสูญหาย" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmCancelDialogOpen"
        :dialogCancel="() => isConfirmCancelDialogOpen = false"
        :dialogConfirm="() => navigateToManageShipList()" />
    <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" title="เพิ่มเรือใหม่" :type="modalAlertType"
        :setDialog="handleCloseAlertDialog" btnName='ปิด' />
    <DialogAlert :isOpen="isAlertDialogUpdateOpen" :desc="modalAlertMessage" title="บันทึกตัวแทนเรือ"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogUpdate" btnName='ปิด' />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import Input from '~/components/form/u-input.vue';
import NumericInput from '~/components/form/u-numeric-input.vue';
import USelect from '~/components/form/u-select.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";

import useMasterDataShipService from "~/core/services/masterDataShipService/vesselService";
import type { IVesselRequest } from "~/core/interfaces/IVesselRequest";
import useVesselService from "~/core/services/vesselService";
import { format } from "date-fns";
import VDatepicker from "~/components/form/v-datepicker.vue";
import FileUpload from "~/components/form/FileUpload.vue";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";
import { FileVesselTypeEnum } from "~/utils/enums/FileVesselTypeEnum";
import { useDocumentStore } from "~/stores/documentStore";

const { t } = useI18n();
const vesselService = useVesselService()
const masterDataShipService = useMasterDataShipService()
const vesselStore = useVesselStore()
const documentStore = useDocumentStore();
const config = useRuntimeConfig();
const downloadUrl = config.public.apiBaseUrl + '/downloads/vessel-template';

const isLoading = ref(false)

const isConfirmDialogOpen = ref(false)
const isConfirmLeaveDialogOpen = ref(false)
const isConfirmCancelDialogOpen = ref(false)
const isAlertDialogOpen = ref(false)
const isAlertDialogUpdateOpen = ref(false)
const modalAlertMessage = ref('')
const modalAlertType = ref('')
const nextRoute = ref<any>(null);
const notAllowNavigate = ref(true)

const isRequiredFile = ref(false)
const filesUpload = ref([])
const filesUploadVessel = ref<IFileUpload[]>([])
const errorFileMessage = ref('')
const vesselFlagData = ref({
    avatar: '',
    flagName: ''
})
const isOtherCountry = ref(true)
const shipParticulars = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const shipRegistry = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const internationTonnageCert = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const last10Ports = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const powerOfAttorney = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const isCreateAndGoToRequest = ref(false)

const createSchema = (isOtherCountry: boolean) => {
    return z.object({
        name: z.string().nonempty({ message: t('please_enter_a_value') }),
        callSign: isOtherCountry ? z.string().nonempty({ message: t('please_enter_a_value') }) : z.string().optional(),
        imoNumber: isOtherCountry ? z.string()
            .nonempty({ message: t('please_enter_a_value') })
            .refine((val) => !val || regxNumber7Degit.test(val), { message: t('imo_number_not_correct') })
            : z.string().optional(),
        owner: z.string().nonempty({ message: t('please_enter_a_value') }),
        breadthExtreme: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        depth: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        grossTonnage: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        lengthOverall: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        loadWeight: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        // loadWeight: z.number().min(1, { message: t('please_enter_a_value') }),
        // mainEngine: z.string().nonempty({ message: t('please_enter_a_value') }),
        // bandAndModel: z.string().nonempty({ message: t('please_enter_a_value') }),
        mmsiNumber: z.string().optional().refine((val) => !val || regxNumber10Degit.test(val), { message: t('mmsi_number_not_correct') }),
        netTonnage: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        officialNumber: z.string().nonempty({ message: t('please_enter_a_value') }).refine((val) => regxNumber9Degit.test(val), { message: t('official_number_not_correct') }),
        vesselFlagId: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        // vesselTypeId: isOtherCountry ? z.number().min(1, { message: t('please_enter_a_value') }) : z.number().optional(),
        vesselTypeId: z.number({ invalid_type_error: t('please_enter_a_value') }).min(1, { message: t('please_enter_a_value') }),
        vesselLicenseExpiredDate: !isOtherCountry ? z.string().nonempty({ message: t('please_enter_a_value') }) : z.string().optional(),
    })
}

const errors = ref<FormError[]>([]);

const formSchema = ref(createSchema(isOtherCountry.value))

const formGroup = ref({
    name: "",
    callSign: "",
    imoNumber: "",
    owner: "",
    ownerId: null,
    breadthExtreme: 0,
    depth: 0,
    grossTonnage: 0,
    lengthOverall: 0,
    loadWeight: 0,
    mainEngine: "",
    bandAndModel: "",
    mmsiNumber: "",
    netTonnage: 0,
    officialNumber: "",
    vesselFlagId: 0,
    vesselTypeId: 0,
    vesselLicenseExpiredDate: ""
})

const payload = ref<IVesselRequest>({
    name: "",
    callSign: "",
    imoNumber: "",
    owner: "",
    breadthExtreme: 0,
    depth: 0,
    grossTonnage: 0,
    lengthOverall: 0,
    loadWeight: 0,
    mainEngine: "",
    bandAndModel: "",
    mmsiNumber: "",
    netTonnage: 0,
    officialNumber: "",
    vesselFlagId: 0,
    vesselTypeId: 0,
    uploadFiles: [],
    vesselLicenseExpiredDate: "",
    ownerId: null
})

const vesselOptionsStore = useVesselOptionsStore()

const licenseExpiredDate = ref(new Date())

onMounted(() => {
    vesselOptionsStore.getVesselTypeOption()
    vesselOptionsStore.getVesselFlagOption()
});


onBeforeRouteLeave((to, from, next) => {
    if (notAllowNavigate.value) {
        isConfirmLeaveDialogOpen.value = true;
        nextRoute.value = to;
        next(false); // Prevent navigation until confirmed
    } else {
        next(); // Allow navigation
    }
});


watch(
    () => shipParticulars.value,
    (value) => {
        const findIndex = filesUploadVessel.value.findIndex((e: IFileUpload) => e.fileType === FileVesselTypeEnum.shipParticulars)
        if (findIndex !== 1) {
            filesUploadVessel.value.push({
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.shipParticulars,
            })
        } else {
            filesUploadVessel.value[findIndex] = {
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.shipParticulars,
            }
        }
    }
);

watch(
    () => shipRegistry.value,
    (value) => {
        const findIndex = filesUploadVessel.value.findIndex((e: IFileUpload) => e.fileType === FileVesselTypeEnum.shipRegistry)
        if (findIndex !== 1) {
            filesUploadVessel.value.push({
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.shipRegistry,
            })
        } else {
            filesUploadVessel.value[findIndex] = {
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.shipRegistry,
            }
        }
    }
);

watch(
    () => internationTonnageCert.value,
    (value) => {
        const findIndex = filesUploadVessel.value.findIndex((e: IFileUpload) => e.fileType === FileVesselTypeEnum.internationTonnageCert)
        if (findIndex !== 1) {
            filesUploadVessel.value.push({
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.internationTonnageCert,
            })
        } else {
            filesUploadVessel.value[findIndex] = {
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.internationTonnageCert,
            }
        }
    }
);

watch(
    () => last10Ports.value,
    (value) => {
        const findIndex = filesUploadVessel.value.findIndex((e: IFileUpload) => e.fileType === FileVesselTypeEnum.last10Ports)
        if (findIndex !== 1) {
            filesUploadVessel.value.push({
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.last10Ports,
            })
        } else {
            filesUploadVessel.value[findIndex] = {
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.last10Ports,
            }
        }
    }
);

watch(
    () => powerOfAttorney.value,
    (value) => {
        const findIndex = filesUploadVessel.value.findIndex((e: IFileUpload) => e.fileType === FileVesselTypeEnum.powerOfAttorney)
        if (findIndex !== 1) {
            filesUploadVessel.value.push({
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.powerOfAttorney,
            })
        } else {
            filesUploadVessel.value[findIndex] = {
                document_file_type: value?.document_file_type || '',
                extension: value?.extension || '',
                fileName: value?.fileName || '',
                filePath: value?.filePath || '',
                preview: value?.preview || '',
                size: value?.size || 0,
                fileType: FileVesselTypeEnum.powerOfAttorney,
            }
        }
    }
);

watch(
    () => filesUpload.value.length,
    (files) => {
        isRequiredFile.value = files > 0 ? false : true
    }
);

watch(
    () => isRequiredFile.value,
    (required) => {
        if (required) {
            errorFileMessage.value = 'กรุณานำส่งเอกสาร'
        } else {
            errorFileMessage.value = ''
        }
    }
);

watch(
    () => formGroup.value.vesselFlagId,
    (value) => {
        if (value) {
            const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value)
            if (findVesselFlag) {
                vesselFlagData.value.avatar = findVesselFlag.path
                vesselFlagData.value.flagName = findVesselFlag.name
            }
        }
    }
);

watch(
    () => formGroup.value.vesselFlagId,
    (value) => {
        const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value)
        if (findVesselFlag) {
            isOtherCountry.value = findVesselFlag.name === 'Thailand' ? false : true
            formSchema.value = createSchema(isOtherCountry.value)
        }
    }
);

watch(
    () => licenseExpiredDate.value,
    (value) => {
        formGroup.value.vesselLicenseExpiredDate = value ? new Date(value).toISOString() : '';
    }
);

const validate = (field: string, valueSelected: any = 0) => {
    const validationErrors: FormError[] = [];

    // Vessel License Expired Date validation (dependent on isOtherCountry)
    if (field === 'vesselLicenseExpiredDate') {
        if (!formGroup.value.vesselLicenseExpiredDate && !isOtherCountry.value) {
            validationErrors.push({ path: 'vesselLicenseExpiredDate', message: t('please_enter_a_value') });
        }
    }

    // Clear previous errors for the specific field and add the new error if any
    errors.value = errors.value.filter(err => err.path !== field);
    if (validationErrors.length) {
        errors.value.push(...validationErrors);
    }
};

const daysRemaining = computed(() => {
    const currentDate = new Date();
    if (formGroup.value.vesselLicenseExpiredDate && !new Date(formGroup.value.vesselLicenseExpiredDate)) return 0;
    const diffTime = new Date(formGroup.value.vesselLicenseExpiredDate).getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
});

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    if (filesUploadVessel.value.length > 0) {
        const newPayload: IVesselRequest = {
            ...payload.value,
            ...event.data,
        }
        payload.value = { ...newPayload, uploadFiles: filesUploadVessel.value }
        isConfirmDialogOpen.value = true
    } else {
        isRequiredFile.value = true
        const containerUpload = document.getElementById('containerUpload');
        containerUpload?.scrollIntoView({ behavior: 'smooth' });
    }
}

const onSearchVesselOwners = async (q: any) => {
    const filter = { q }
    if (q) {
        formGroup.value.owner = q
        formGroup.value.ownerId = null
        const resp = await masterDataShipService.getVesselOwnersOption(filter)
        if (resp.statusCode === 200) {
            return resp.data.map((e: any) => ({ id: e.id, name: e.name }))
        }
        return []
    }
    return []
}

const handleChangeOwner = (value: any) => {
    formGroup.value.owner = value.name
    formGroup.value.ownerId = value.id
}

const dialogCancel = () => {
    isConfirmDialogOpen.value = false
}
const dialogConfirm = async () => {
    isLoading.value = true
    notAllowNavigate.value = false
    const resp = await vesselService.createVessel(payload.value)
    if (resp.statusCode === 200) {
        isAlertDialogOpen.value = true
        modalAlertMessage.value = 'การเพิ่มเรือใหม่ของคุณสำเร็จแล้ว'
        modalAlertType.value = 'success'
    } else {
        isAlertDialogOpen.value = true
        modalAlertMessage.value = resp.message
        modalAlertType.value = 'error'
    }

    isLoading.value = false
    isConfirmDialogOpen.value = false
}

const handleCloseAlertDialog = () => {
    if (modalAlertType.value === 'success') {
        if (isCreateAndGoToRequest.value) {
            navigateTo('/request-form/create')
        } else {
            navigateToManageShipList()
        }
        isAlertDialogOpen.value = false
    }
    isAlertDialogOpen.value = false
}

const handleCloseAlertDialogUpdate = () => {
    isAlertDialogUpdateOpen.value = false
}

const handleConfirmLeave = () => {
    isConfirmLeaveDialogOpen.value = false;
    notAllowNavigate.value = false
    if (nextRoute.value) {
        navigateTo(nextRoute.value);
    }
};

const handleCancelLeave = () => {
    isConfirmLeaveDialogOpen.value = false;
    nextRoute.value = null;
};

const handleCancleCreateVessel = () => {
    isConfirmCancelDialogOpen.value = true
    notAllowNavigate.value = false
}

const getError = (field: string) => {
    const error = errors.value.find(err => err.path === field);
    return error ? error.message : null;
};

const navigateToManageShipList = () => {
   if (documentStore.manageShipQueryType === "false") {
      navigateTo("/manage-ship/list?status=false");
   } else if (documentStore.manageShipQueryType === "true") {
      navigateTo("/manage-ship/list?status=true");
   }  else {
      navigateTo("/manage-ship/list");
   }
};
</script>
