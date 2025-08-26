<template>
    <div class="mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('vessel_agents_management') }}</h1>
    </div>
    <UForm :schema="registerSchema" :state="formGroup" @submit="onSubmit">
        <div id="ship-agent-form-content" class="bg-white px-8 py-6  rounded-[0px_0px_20px_20px]">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h1 class="font-semibold text-lg text-grayy-400">{{ isEdit ? $t('edit_vessel_agent')
                        : $t('create_vessel_agent') }}</h1>
                    <div class="mt-1 text-grayy-75 text-sm">{{ $t('vessel_agent_detail') }}</div>
                </div>
                <div class="">
                    <UButton @click="handleDelete" class="text-red-500" size="md" color="white" variant="solid"
                        :label="$t('cancel')" v-if="vesselAgentId" />
                    <UButton @click="handleCancelCreateVessel" class="mx-2 border border-grayy-100" size="md"
                        color="gray" :label="isEdit ? $t('close') : $t('cancel')" />
                    <UButton size="md" :label="isEdit ? $t('save') : $t('add_vessel_agent')" type="submit" />
                </div>
            </div>
            <UDivider />

            <div class="border border-grayy-100 p-8 rounded-xl mt-6">
                <h2 class="font-semibold text-grayy-400 mb-3">{{ $t('vessel_agent_information') }}</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <Input :label="$t('email')" name="email" placeholder="me@example.com" v-model="formGroup.email"
                            customIcon="user" :disabled="vesselAgentId" />
                    </div>
                    <div class="col-span-1">
                        <USelect :label="$t('legal_entities')" name="personType" :placeholder="$t('legal_entities')"
                            required :options="personTypeOption" v-model="formGroup.personType" />
                    </div>
                    <div class="col-span-1">
                        <Input :label="$t('taxpayer_identification_no')" name="tax"
                            :placeholder="$t('taxpayer_identification_no')" required v-model="formGroup.tax" />
                    </div>
                    <div class="col-span-1">
                        <Input :label="$t('company_name')" name="company" :placeholder="$t('company_name')" required
                            v-model="formGroup.company" />
                    </div>
                    <div class="col-span-1">
                        <Input :label="$t('contact_name')" name="fullName" :placeholder="$t('contact_name')" required
                            v-model="formGroup.fullName" />
                    </div>
                    <div class="col-span-1">
                        <Input :label="$t('telephone_no')" name="phone" :placeholder="$t('telephone_no')" required
                            v-model="formGroup.phone" />
                    </div>
                    <div class="col-span-1">
                        <Input :label="$t('mobile_phone_no')" name="mobilePhone" :placeholder="$t('mobile_phone_no')"
                            v-model="formGroup.mobilePhone" @blur="validate('mobilePhone')"
                            @input="validate('mobilePhone')" :error="getError('mobilePhone') || ''" />
                    </div>
                </div>
                <UDivider class="my-4" />
                <h2 class="font-semibold text-grayy-400 mb-3">{{ $t('vessel_agent_address') }}</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <USelect :label="$t('country')" name="countryId" :placeholder="$t('country')" required
                            :searchable-placeholder="$t('search_country')" v-model="formGroup.countryId" searchable
                            :options="addressOptionsStore.countriesOption" />

                    </div>
                    <div v-if="!isOtherCountry" class="col-span-1">
                        <USelect :label="$t('province')" name="provinceId" :placeholder="$t('province')" required
                            v-model="formGroup.provinceId" :options="addressOptionsStore.provicesOption" searchable
                            :searchable-placeholder="$t('search_province')" />
                    </div>

                    <div v-if="isOtherCountry" class="col-span-1">
                        <Input :label="$t('state_province')" name="stageProvince" :placeholder="$t('state_province')"
                            required v-model="formGroup.stageProvince" />
                    </div>
                    <div class="col-span-1">
                        <Input :label="$t('zipcode')" name="zipCode" :placeholder="$t('zipcode')" required
                            v-model="formGroup.zipCode" :disabled="!isOtherCountry" />
                    </div>
                    <div v-if="!isOtherCountry" class="col-span-1">
                        <USelect :label="$t('district')" name="districtId" :placeholder="$t('district')" required
                            v-model="formGroup.districtId" searchable :options="addressOptionsStore.districtOption"
                            :searchable-placeholder="$t('search_district')" />
                    </div>
                    <div v-if="!isOtherCountry" class="col-span-1">
                        <USelect :label="$t('subdistrict')" name="subDistrictId" :placeholder="$t('subdistrict')"
                            required v-model="formGroup.subDistrictId" searchable
                            :options="addressOptionsStore.subDistrictOption"
                            :searchable-placeholder="$t('search_subdistrict')" />
                    </div>
                    <div class="col-span-2">
                        <Input :label="$t('address')" name="address" :placeholder="$t('address')" required
                            v-model="formGroup.address" />
                    </div>
                </div>
                <UDivider class="my-4" />
                <div id="containerUpload">
                    <!-- <UploadYourDocument :required="isRequiredFile" :files-value="filesUpload"
                        :getFiles="(value: any) => filesUpload = value" /> -->
                    <h2 class="font-bold text-grayy-400">{{ $t('document_content.title2') }}</h2>
                    <div class="flex justify-between">
                        <span class="text-grayy-500 mr-2 my-3">{{ $t('document_content.upload_caption_2') }}</span>
                        <a :href="downloadUrl" class="flex items-center cursor-pointer" target="_blank">
                            <span class="text-primaryy-500 mr-2 my-3">{{ $t('document_content.download_example')
                                }}</span>
                            <NuxtIcon name="download" />
                        </a>
                    </div>
                    <div v-if="formGroup.personType === 'corporate'" class="grid gap-4 mt-4">
                        <FileUpload uploadType="register" id="legalEntityCert"
                            :label="$t('document_content.legal_entity_cert_text')" name="legalEntityCert" required
                            v-model="legalEntityCert" :type="FileRegisterTypeEnum.legalEntityCert"
                            :value-file="legalEntityCert" is-document-type :onFileUpload="onFileUpload"
                            :file-name="legalEntityCertFileName" :file-preview="legalEntityCertFilePreview"
                            :is-required="isRequiredFilelegalEntityCert"
                            :onRemoveFile="(value: any) => legalEntityCert = value" />
                        <FileUpload uploadType="register" id="powerOfAttorney"
                            :label="$t('document_content.power_of_attorney_text_2')" name="powerOfAttorney" required
                            v-model="powerOfAttorney" :type="FileRegisterTypeEnum.powerOfAttorney"
                            :value-file="powerOfAttorney" is-document-type :onFileUpload="onFileUpload"
                            :file-name="powerOfAttorneyFileName" :file-preview="powerOfAttorneyFilePreview"
                            :is-required="isRequiredFilepowerOfAttorney"
                            :onRemoveFile="(value: any) => powerOfAttorney = value" />
                        <FileUpload uploadType="register" id="powerOfAttorneyNationId"
                            :label="$t('document_content.power_of_attorney_national_id_text')"
                            name="powerOfAttorneyNationId" required v-model="powerOfAttorneyNationId"
                            :type="FileRegisterTypeEnum.powerOfAttorneyNationId" :value-file="powerOfAttorneyNationId"
                            is-document-type :onFileUpload="onFileUpload" :file-name="powerOfAttorneyNationIdFileName"
                            :file-preview="powerOfAttorneyNationIdFilePreview"
                            :is-required="isRequiredFilepowerOfAttorneyNationId"
                            :onRemoveFile="(value: any) => powerOfAttorneyNationId = value" />
                    </div>
                    <div v-else class="grid gap-4 mt-4">
                        <FileUpload uploadType="register" id="nationalId"
                            :label="$t('document_content.national_id_upload_text')" name="nationalId" required
                            v-model="nationalId" :type="FileRegisterTypeEnum.nationalId" :value-file="nationalId"
                            is-document-type :onFileUpload="onFileUpload" :file-name="nationalIdFileName"
                            :file-preview="nationalIdFilePreview" :is-required="isRequiredFilenationalId"
                            :onRemoveFile="(value: any) => nationalId = value" />
                        <FileUpload uploadType="register" id="powerOfAttorney"
                            :label="$t('document_content.power_of_attorney_text')" name="powerOfAttorney" required
                            v-model="powerOfAttorney" :type="FileRegisterTypeEnum.powerOfAttorney"
                            :value-file="powerOfAttorney" is-document-type :onFileUpload="onFileUpload"
                            :file-name="powerOfAttorneyFileName" :file-preview="powerOfAttorneyFilePreview"
                            :is-required="isRequiredFilepowerOfAttorney"
                            :onRemoveFile="(value: any) => powerOfAttorney = value" />
                    </div>
                </div>

            </div>
        </div>
    </UForm>
    <DialogConfirm :title="isEdit ? $t('save_vessel_agent') : $t('add_vessel_agent')"
        :desc="isEdit ? $t('confirm_save_vessel_agent') : $t('confirm_add_vessel_agent')" icon="warning"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmDialogOpen" :dialogCancel="dialogCancel"
        :dialogConfirm="dialogConfirm" />
    <DialogConfirm :title="$t('leave_this_page_title')" :desc="$t('leave_this_page_message')" icon="warning"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmLeaveDialogOpen" :dialogCancel="handleCancelLeave"
        :dialogConfirm="handleConfirmLeave" />
    <DialogConfirm :title="$t('cancel_data_recording')" :desc="$t('leave_this_page_message')" icon="warning"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmCancelDialogOpen"
        :dialogCancel="() => isConfirmCancelDialogOpen = false"
        :dialogConfirm="() => navigateToManageShipAgentsList()" />
    <DialogConfirm :title="$t('cancel_vessel_agent')" :desc="$t('confirm_cancel_vessel_agent')" icon="danger"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmDeleteDialogOpen"
        :dialogCancel="() => isConfirmDeleteDialogOpen = false" :dialogConfirm="dialogConfirmDeleteVesselAgent"
        color-confirm="red" />
    <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="$t('add_vessel_agent')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
    <DialogAlert :isOpen="isAlertDialogUpdateOpen" :desc="modalAlertMessage" :title="$t('save_vessel_agent')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogUpdate" :btnName="$t('close')" />
    <DialogAlert :isOpen="isAlertCancelDialogOpen" :desc="modalAlertMessage" :title="$t('cancel_vessel_agent')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import Input from '~/components/form/u-input.vue';
import USelect from '~/components/form/u-select.vue';
import UploadYourDocument from '~/components/register-form/uploadYourDocument.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import useVesselAgentService from "~/core/services/vesselAgentService";
import Loading from "~/components/loading.vue";
import type { IVesselAgentRequest } from "~/core/interfaces/IVesselAgentRequest";
import { useDocumentStore } from "~/stores/documentStore";
import FileUpload from "~/components/form/FileUpload.vue";
import { FileRegisterTypeEnum } from "~/utils/enums/FileRegisterTypeEnum";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";

const config = useRuntimeConfig();
const downloadUrl = config.public.apiBaseUrl + '/downloads/agent-template';
const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === 'edit'
const documentStore = useDocumentStore()
const vesselAgentService = useVesselAgentService()
const query: any = route.query;
const vesselAgentId = isEdit && query.id

const isLoading = ref(false)
const isOtherCountry = ref(false)

const isConfirmDialogOpen = ref(false)
const isConfirmLeaveDialogOpen = ref(false)
const isConfirmCancelDialogOpen = ref(false)
const isConfirmDeleteDialogOpen = ref(false)
const isAlertDialogOpen = ref(false)
const isAlertDialogUpdateOpen = ref(false)
const isAlertCancelDialogOpen = ref(false)
const modalAlertMessage = ref('')
const modalAlertType = ref('')
const nextRoute = ref<any>(null);
const notAllowNavigate = ref(true)

const isRequiredFile = ref(false)
const filesUpload = ref<IFileUpload[]>([])
const nationalId = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const powerOfAttorney = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const legalEntityCert = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });
const powerOfAttorneyNationId = ref<IFileUpload>({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 });

const nationalIdFileName = ref<string>("");
const powerOfAttorneyFileName = ref<string>("");
const legalEntityCertFileName = ref<string>("");
const powerOfAttorneyNationIdFileName = ref<string>("");

const nationalIdFilePreview = ref<string>("");
const powerOfAttorneyFilePreview = ref<string>("");
const legalEntityCertFilePreview = ref<string>("");
const powerOfAttorneyNationIdFilePreview = ref<string>("");

const isRequiredFilenationalId = ref<boolean>(false);
const isRequiredFilepowerOfAttorney = ref<boolean>(false);
const isRequiredFilelegalEntityCert = ref<boolean>(false);
const isRequiredFilepowerOfAttorneyNationId = ref<boolean>(false);

const createSchema = (isOtherCountry: boolean) => {
    return z.object({
        email: z.string().nonempty({ message: t('please_enter_a_value') }).email(t('email_format_validate_message')),
        address: z.string().nonempty({ message: t('please_enter_a_value') }),
        company: z.string().nonempty({ message: t('please_enter_a_value') }),
        fullName: z.string().nonempty({ message: t('please_enter_a_value') }),
        mobilePhone: z.string().optional(),
        personType: z.string().nonempty({ message: t('please_enter_a_value') }),
        phone: z.string().nonempty({ message: t('please_enter_a_value') }).regex(regxPhone, { message: t('phone_format_validate_message') }),
        countryId: z.number().min(1, { message: t('please_enter_a_value') }),
        provinceId: isOtherCountry ? z.number().nullable().optional() : z.number().min(1, { message: t('please_enter_a_value') }),
        districtId: isOtherCountry ? z.number().nullable().optional() : z.number().min(1, { message: t('please_enter_a_value') }),
        subDistrictId: isOtherCountry ? z.number().nullable().optional() : z.number().min(1, { message: t('please_enter_a_value') }),
        tax: z.string().nonempty({ message: t('please_enter_a_value') }),
        zipCode: z.string().nonempty({ message: t('please_enter_a_value') }),
        stageProvince: isOtherCountry ? z.string().nonempty({ message: t('please_enter_a_value') }) : z.string().optional()
    })
};

const registerSchema = ref(createSchema(isOtherCountry.value));

const formGroup = reactive<any>({
    email: '',
    address: '',
    company: '',
    fullName: '',
    mobilePhone: '',
    personType: '',
    phone: '',
    countryId: null,
    provinceId: null,
    stageProvince: '',
    districtId: null,
    subDistrictId: null,
    tax: '',
    zipCode: '',
})

const errors = ref<FormError[]>([]);
const validate = (field: string) => {
    const validationErrors: FormError[] = [];

    if (field === 'mobilePhone') {
        if (formGroup.mobilePhone) {
            if (!regxPhone.test(formGroup.mobilePhone)) {
                validationErrors.push({ path: 'mobilePhone', message: t('phone_format_validate_message') });
            }
        }
    }

    // Clear previous errors for the specific field and add the new error if any
    errors.value = errors.value.filter(err => err.path !== field);
    if (validationErrors.length) {
        errors.value.push(...validationErrors);
    }
}

const getError = (field: string) => {
    const error = errors.value.find(err => err.path === field);
    return error ? error.message : null;
};

const payload = ref<IVesselAgentRequest>({
    email: "",
    address: "",
    company: "",
    fullName: "",
    mobilePhone: "",
    personType: "",
    phone: "",
    provinceId: null,
    stageProvince: "",
    districtId: null,
    subDistrictId: null,
    tax: "",
    zipCode: "",
    uploadFiles: [],
    countryId: null
})
const personTypeOption = [{
    id: 'corporate',
    name: t('corporate')
}, {
    id: 'personal',
    name: t('personal')
}]

const addressOptionsStore = useAddressOptionsStore()

onMounted(() => {
    addressOptionsStore.getCountriesOptions()
    addressOptionsStore.getProvincesOptions()
    if (vesselAgentId) {
        getVesselAgentDetail(+vesselAgentId)
    }
});

const getVesselAgentDetail = async (id: number) => {
    const resp = await vesselAgentService.getVesselAgentDetail(id)
    if (resp.statusCode === 200) {
        const data = resp.data
        formGroup.email = data.email
        formGroup.address = data.address
        formGroup.company = data.company
        formGroup.fullName = data.fullName
        formGroup.mobilePhone = data.mobilePhone
        formGroup.personType = data.personType
        formGroup.phone = data.phone
        formGroup.countryId = data.countryId
        formGroup.provinceId = data.countryId === 219 ? data.provinceId : null
        formGroup.stageProvince = data.stageProvince
        formGroup.districtId = data.countryId === 219 ? data.districtId : null
        formGroup.subDistrictId = data.countryId === 219 ? data.subDistrictId : null
        formGroup.tax = data.tax
        formGroup.zipCode = data.zipCode
        filesUpload.value = data.uploadFiles || []
    }
}

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
    () => formGroup.countryId,
    (value) => {
        console.log('countryId', value)
        isOtherCountry.value = value !== 219 ? true : false
        registerSchema.value = createSchema(value !== 219 ? true : false)
        formGroup.provinceId = value !== 219 ? null : formGroup.provinceId
        formGroup.districtId = value !== 219 ? null : formGroup.districtId
        formGroup.subDistrictId = value !== 219 ? null : formGroup.subDistrictId
        formGroup.stageProvince = value !== 219 ? formGroup.stageProvince : ''
    }
);

watch(
    () => formGroup.provinceId,
    (provinceId) => {
        if (provinceId) {
            addressOptionsStore.getDistrictsOptions(provinceId)
        }
    }
);

watch(
    () => formGroup.districtId,
    (districtId) => {
        if (districtId) {
            addressOptionsStore.getSubDistrictsOptions(districtId)
        }
    }
);

watch(
    () => formGroup.subDistrictId,
    async (subDistrictId) => {
        if (subDistrictId) {
            const findZipcode: any = addressOptionsStore.subDistrictOption.find((e: any) => e.id === subDistrictId)
            if (findZipcode) {
                formGroup.zipCode = findZipcode.zipcode
            } else {
                formGroup.zipCode = formGroup.zipCode || ''
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

async function onSubmit(event: FormSubmitEvent<z.output<typeof registerSchema.value>>) {
    validate('mobilePhone')
    if (errors.value.length === 0) {
        if (event.data.personType === 'corporate') {
            validateFileUpload(FileRegisterTypeEnum.legalEntityCert)
            validateFileUpload(FileRegisterTypeEnum.powerOfAttorney)
            validateFileUpload(FileRegisterTypeEnum.powerOfAttorneyNationId)
            if (isRequiredFilelegalEntityCert.value || isRequiredFilepowerOfAttorney.value || isRequiredFilepowerOfAttorneyNationId.value) {
                const containerUpload = document.getElementById('containerUpload');
                containerUpload?.scrollIntoView({ behavior: 'smooth' });
            } else {
                const newPayload: IVesselAgentRequest = {
                    ...payload.value,
                    ...event.data,
                }
                const uploadFiles = filesUpload.value.filter((e: any) => !e.isError
                    && (event.data.personType === 'corporate'
                        ? [FileRegisterTypeEnum.legalEntityCert, FileRegisterTypeEnum.powerOfAttorney, FileRegisterTypeEnum.powerOfAttorneyNationId].includes(e.fileType)
                        : [FileRegisterTypeEnum.nationalId, FileRegisterTypeEnum.powerOfAttorney].includes(e.fileType)))
                    .map((file: any) => ({
                        id: file.id,
                        filePath: file.filePath,
                        fileName: file.fileName,
                        extension: file.extension ? file.extension : 'application/xml',
                        size: file.size,
                        fileType: file.fileType
                    }))
                payload.value = { ...newPayload, uploadFiles: uploadFiles }
                isConfirmDialogOpen.value = true
            }
        } else {
            validateFileUpload(FileRegisterTypeEnum.nationalId)
            validateFileUpload(FileRegisterTypeEnum.powerOfAttorney)
            if (isRequiredFilenationalId.value || isRequiredFilepowerOfAttorney.value) {
                const containerUpload = document.getElementById('containerUpload');
                containerUpload?.scrollIntoView({ behavior: 'smooth' });
            } else {
                const newPayload: IVesselAgentRequest = {
                    ...payload.value,
                    ...event.data,
                }
                const uploadFiles = filesUpload.value.filter((e: any) => !e.isError
                    && (event.data.personType === 'corporate'
                        ? [FileRegisterTypeEnum.legalEntityCert, FileRegisterTypeEnum.powerOfAttorney, FileRegisterTypeEnum.powerOfAttorneyNationId].includes(e.fileType)
                        : [FileRegisterTypeEnum.nationalId, FileRegisterTypeEnum.powerOfAttorney].includes(e.fileType)))
                    .map((file: any) => ({
                        id: file.id,
                        filePath: file.filePath,
                        fileName: file.fileName,
                        extension: file.extension ? file.extension : 'application/xml',
                        size: file.size,
                        fileType: file.fileType
                    }))
                payload.value = { ...newPayload, uploadFiles: uploadFiles }
                isConfirmDialogOpen.value = true
            }
        }
    }
}

const dialogCancel = () => {
    isConfirmDialogOpen.value = false
}
const dialogConfirm = async () => {
    isLoading.value = true
    notAllowNavigate.value = false
    if (vesselAgentId) {
        const resp = await vesselAgentService.updateVesselAgent(payload.value, vesselAgentId)
        if (resp.statusCode === 200) {
            isAlertDialogUpdateOpen.value = true
            modalAlertMessage.value = 'การบันทึกตัวแทนเรือของคุณสำเร็จแล้ว'
            modalAlertType.value = 'success'
        } else {
            isAlertDialogUpdateOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    } else {
        const resp = await vesselAgentService.createVesselAgent(payload.value)
        if (resp.statusCode === 200) {
            isAlertDialogOpen.value = true
            modalAlertMessage.value = 'การเพิ่มตัวแทนเรือของคุณสำเร็จแล้ว กรุณาตรวจสอบอีเมลเพื่อรับรหัสเข้าสู่ระบบ'
            modalAlertType.value = 'success'
        } else {
            isAlertDialogOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    }

    isLoading.value = false
    isConfirmDialogOpen.value = false
}


const dialogConfirmDeleteVesselAgent = async () => {
    isLoading.value = true
    if (vesselAgentId) {
        const resp = await vesselAgentService.deleteVesselAgent(vesselAgentId)
        if (resp.statusCode === 200) {
            isAlertCancelDialogOpen.value = true
            modalAlertMessage.value = t('cancel_vessel_agent_success')
            modalAlertType.value = 'success'
        } else {
            isAlertCancelDialogOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    }

    isLoading.value = false
    isConfirmCancelDialogOpen.value = false
}

const handleCloseAlertDialog = () => {
    if (modalAlertType.value === 'success') {
        navigateToManageShipAgentsList()
    }
    isAlertDialogOpen.value = false
}

const handleCloseAlertDialogUpdate = () => {
    isAlertDialogUpdateOpen.value = false
    getVesselAgentDetail(vesselAgentId)
    navigateToManageShipAgentsList()
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

const handleCancelCreateVessel = () => {
    isConfirmCancelDialogOpen.value = true
    notAllowNavigate.value = false
}

const handleDelete = () => {
    isConfirmDeleteDialogOpen.value = true
    notAllowNavigate.value = false
}

const navigateToManageShipAgentsList = () => {
    if (documentStore.manageShipAgentsQueryType === "WaitingApproved") {
        navigateTo('/manage-ship-agents/list?status=WaitingApproved')
    } else if (documentStore.manageShipAgentsQueryType === "Approved") {
        navigateTo('/manage-ship-agents/list?status=Approved')
    } else {
        navigateTo('/manage-ship-agents/list')
    }
    documentStore.triggerRefresh();
}

const replaceByFileType = (
    referenceArray: IFileUpload[],
    newObject: IFileUpload
): IFileUpload[] =>
    referenceArray.map(item =>
        item.fileType === newObject.fileType
            ? { ...newObject }
            : item
    ).concat(referenceArray.some(item => item.fileType === newObject.fileType) ? [] : [newObject]);
const onFileUpload = (value: any) => {
    const updatedFiles = replaceByFileType(filesUpload.value as IFileUpload[], value)
    filesUpload.value = updatedFiles
}

const validateFileUpload = (field: FileRegisterTypeEnum) => {
    if (formGroup.personType === 'corporate') {
        if (field === FileRegisterTypeEnum.legalEntityCert) {
            isRequiredFilelegalEntityCert.value = !legalEntityCert.value.fileName;
        }
        if (field === FileRegisterTypeEnum.powerOfAttorney) {
            isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
        }
        if (field === FileRegisterTypeEnum.powerOfAttorneyNationId) {
            isRequiredFilepowerOfAttorneyNationId.value = !powerOfAttorneyNationId.value.fileName;
        }
    } else {
        if (field === FileRegisterTypeEnum.nationalId) {
            isRequiredFilenationalId.value = !nationalId.value.fileName;
        }
        if (field === FileRegisterTypeEnum.powerOfAttorney) {
            isRequiredFilepowerOfAttorney.value = !powerOfAttorney.value.fileName;
        }
    }
};

watch(
    () => nationalId.value,
    (value) => {
        // remove from uploadfile
        if (value === null) {
            const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.nationalId)
            if (findFileIndex !== -1) {
                filesUpload.value.splice(findFileIndex, 1)
            }
            nationalId.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
            nationalIdFileName.value = ''
            nationalIdFilePreview.value = ''
        }
    }
);

watch(
    () => powerOfAttorney.value,
    (value) => {
        // remove from uploadfile
        if (value === null) {
            const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.powerOfAttorney)
            if (findFileIndex !== -1) {
                filesUpload.value.splice(findFileIndex, 1)
            }
            powerOfAttorney.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
            powerOfAttorneyFileName.value = ''
            powerOfAttorneyFilePreview.value = ''
        }
    }
);

watch(
    () => legalEntityCert.value,
    (value) => {
        // remove from uploadfile
        if (value === null) {
            const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.legalEntityCert)
            if (findFileIndex !== -1) {
                filesUpload.value.splice(findFileIndex, 1)
            }
            legalEntityCert.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
            legalEntityCertFileName.value = ''
            legalEntityCertFilePreview.value = ''
        }
    }
);

watch(
    () => powerOfAttorneyNationId.value,
    (value) => {
        // remove from uploadfile
        if (value === null) {
            const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileRegisterTypeEnum.powerOfAttorneyNationId)
            if (findFileIndex !== -1) {
                filesUpload.value.splice(findFileIndex, 1)
            }
            powerOfAttorneyNationId.value = { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
            powerOfAttorneyNationIdFileName.value = ''
            powerOfAttorneyNationIdFilePreview.value = ''
        }
    }
);

watch(
    () => filesUpload.value,
    (value) => {
        for (let index = 0; index < value.length; index++) {
            const dataFile: IFileUpload = value[index] as IFileUpload;
            if (dataFile.fileType === FileRegisterTypeEnum.nationalId) {
                nationalId.value = dataFile;
                nationalIdFileName.value = dataFile.fileName;
                nationalIdFilePreview.value = dataFile.preview;
                validateFileUpload(FileRegisterTypeEnum.nationalId);
            }
            if (dataFile.fileType === FileRegisterTypeEnum.powerOfAttorney) {
                powerOfAttorney.value = dataFile;
                powerOfAttorneyFileName.value = dataFile.fileName;
                powerOfAttorneyFilePreview.value = dataFile.preview;
                validateFileUpload(FileRegisterTypeEnum.powerOfAttorney);
            }
            if (dataFile.fileType === FileRegisterTypeEnum.legalEntityCert) {
                legalEntityCert.value = dataFile;
                legalEntityCertFileName.value = dataFile.fileName;
                legalEntityCertFilePreview.value = dataFile.preview;
                validateFileUpload(FileRegisterTypeEnum.legalEntityCert);
            }
            if (dataFile.fileType === FileRegisterTypeEnum.powerOfAttorneyNationId) {
                powerOfAttorneyNationId.value = dataFile;
                powerOfAttorneyNationIdFileName.value = dataFile.fileName;
                powerOfAttorneyNationIdFilePreview.value = dataFile.preview;
                validateFileUpload(FileRegisterTypeEnum.powerOfAttorneyNationId);
            }
        }
    }
);
</script>
