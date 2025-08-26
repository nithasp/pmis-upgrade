<template>
    <div class="mb-8">
        <h1 class="font-bold text-[30px]">จัดการตัวแทนเรือ</h1>
    </div>
    <div id="ship-agent-form-content" class="bg-white px-8 py-6  rounded-[0px_0px_20px_20px]">
        <div class="flex items-center justify-between mb-5">
            <div>
                <div class="flex">
                    <h1 class="font-semibold text-lg text-grayy-400 mr-4">ข้อมูลตัวแทนเรือ</h1>
                    <Badge :label="renderStatusText(t, vesselAgentDetailData.status)"
                        :type="renderStatusType(vesselAgentDetailData.status)" />
                </div>
                <div class="mt-1 text-grayy-75 text-sm">รายละเอียดตัวแทนเรือ</div>
            </div>
            <div class="flex items-center">
                <!-- delete -->
                <UButton @click="() => isConfirmCancelDialogOpen = true" class="mx-1 text-red-500" size="md"
                    color="white" variant="solid" label="ยกเลิก" />
                <!-- back -->
                <UButton @click="() => navigateToManageShipAgentsList()" class="mx-1 border border-grayy-100"
                    size="md" color="gray" label="ปิด" />
                <!-- password reset -->
                <UButton @click="() => isConfirmDialogResetPasswordOpen = true"
                    class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50" size="md"
                    :label="$t('reset_password')" icon="i-heroicons-arrow-path"
                    v-if="canResetPassword(vesselAgentDetailData)" />
                <!-- edit -->
                <UButton @click="() => navigateTo(`/manage-ship-agents/edit?id=${vesselAgentId}`)" :class="editButtonClass" size="md" label="แก้ไข" icon="i-heroicons-pencil-square"
                    v-if="canEdit(user.roleType, vesselAgentDetailData.status)" />
                <!-- approve -->
                <UButton class="ml-1" @click="() => isConfirmDialogOpen = true" icon="i-heroicons-check" size="md"
                    label="อนุมัติ" type="submit" :trailing="true"
                    v-if="canApprove(user.roleType, vesselAgentDetailData.status)" />
            </div>
        </div>
        <UDivider />

        <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลตัวแทนเรือ</h2>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <Input is-view label="อีเมล" v-model="vesselAgentDetailData.email" />
                </div>
                <div class="col-span-1">
                    <USelect is-view label="ประเภทของบุคคล" name="personType" :options="personTypeOption"
                        v-model="vesselAgentDetailData.personType" />
                </div>
                <div class="col-span-1">
                    <Input is-view :label="$t('taxpayer_identification_no')" v-model="vesselAgentDetailData.tax" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="ชื่อบริษัท" v-model="vesselAgentDetailData.company" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="ชื่อ-สกุลผู้ติดต่อ" v-model="vesselAgentDetailData.fullName" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="เบอร์โทรศัพท์" v-model="vesselAgentDetailData.phone" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="เบอร์โทรศัพท์มือถือ" v-model="vesselAgentDetailData.mobilePhone" />
                </div>
            </div>
            <UDivider class="my-4" />
            <h2 class="font-semibold text-grayy-400 mb-3">ที่อยู่ตัวแทนเรือ</h2>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <USelect is-view label="ประเทศ" v-model="vesselAgentDetailData.countryId"
                        :options="addressOptionsStore.countriesOption" />

                </div>
                <div v-if="!isOtherCountry" class="col-span-1">
                    <USelect is-view label="จังหวัด" v-model="vesselAgentDetailData.provinceId"
                        :options="addressOptionsStore.provicesOption" />
                </div>

                <div v-if="isOtherCountry" class="col-span-1">
                    <Input is-view label="รัฐ/จังหวัด" v-model="vesselAgentDetailData.stageProvince" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="รหัสไปรษณีย์" v-model="vesselAgentDetailData.zipCode" />
                </div>
                <div v-if="!isOtherCountry" class="col-span-1">
                    <USelect is-view label="เขต/อำเภอ" required v-model="vesselAgentDetailData.districtId"
                        :options="addressOptionsStore.districtOption" />
                </div>
                <div v-if="!isOtherCountry" class="col-span-1">
                    <USelect is-view label="แขวง/ตำบล" v-model="vesselAgentDetailData.subDistrictId"
                        :options="addressOptionsStore.subDistrictOption" />
                </div>
                <div class="col-span-2">
                    <Input is-view label="ที่อยู่" v-model="vesselAgentDetailData.address" />
                </div>
            </div>
            <UDivider class="my-4" />
            <div id="containerUpload">
                <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบ</h2>
                <FileDropzone v-if="vesselAgentDetailData.uploadFiles.length > 0" is-view
                    :filesValue="vesselAgentDetailData.uploadFiles" />
                <div v-else>-</div>
            </div>

        </div>
    </div>
    <DialogConfirm title="อนุมัติตัวแทนเรือ" desc="คุณยืนยันการอนุมัติตัวแทนเรือนี้ใช่หรือไม่" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmDialogOpen" :dialogCancel="dialogCancelApprove"
        :dialogConfirm="dialogConfirmApprove" />
    <DialogConfirm title="ยกเลิกตัวแทนเรือ"
        desc="คุณต้องการยกเลิกตัวแทนเรือนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmCancelDialogOpen" :dialogCancel="dialogCancelDeleteVesselAgent"
        :dialogConfirm="dialogConfirmDeleteVesselAgent" color-confirm="red" />
    <DialogConfirm title="รีเซ็ตรหัสผ่าน" desc="คุณยืนยันการรีเซ็ตรหัสผ่านใช่หรือไม่" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmDialogResetPasswordOpen" :dialogCancel="dialogCancelResetPassword"
        :dialogConfirm="dialogConfirmResetPasword" />
    <DialogAlert :isOpen="isAlertCancelDialogOpen" :desc="modalAlertMessage" title="ยกเลิกตัวแทนเรือ"
        :type="modalAlertType" :setDialog="handleCloseAlertDialog" btnName='ปิด' />
    <DialogAlert :isOpen="isAlertDialogApproveOpen" :desc="modalAlertMessage" title="อนุมัติตัวแทนเรือ"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogApprove" btnName='ปิด' />
    <DialogAlert :isOpen="isAlertDialogResetPasswordOpen" :desc="modalAlertMessage" title="รีเซ็ตรหัสผ่าน"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogResetPassword" btnName='ปิด' />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import type { IVasselAgentDetail } from '~/core/interfaces/IVesselAgentDetail';
import Input from '~/components/form/u-input.vue';
import USelect from '~/components/form/u-select.vue';
import FileDropzone from '~/components/form/fileDropzone.vue';
import type { IUploadFile } from "~/core/interfaces/IUploadFile";
import useAuthService from "~/core/services/authService";
import useVesselAgentService from "~/core/services/vesselAgentService";
import { useDocumentStore } from "~/stores/documentStore";
import Badge from "~/components/badge/badge.vue";

import { canEdit, canApprove, canResetPassword } from './utils/permissions';
import { renderStatusText, renderStatusType } from './utils/ui';
import { UserStatusEnum } from "~/utils/enums/UserStatusEnum";

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const authService = useAuthService();
const documentStore = useDocumentStore();
const vesselAgentService = useVesselAgentService()
const addressOptionsStore = useAddressOptionsStore()
const query: any = route.query;
const vesselAgentId = query.id
const user = authStore.profileUser

const isLoading = ref(false)
const isOtherCountry = ref(false)

const isConfirmDialogOpen = ref(false)
const isConfirmCancelDialogOpen = ref(false)
const isConfirmDialogResetPasswordOpen = ref(false)
const isAlertCancelDialogOpen = ref(false)
const isAlertDialogApproveOpen = ref(false)
const isAlertDialogResetPasswordOpen = ref(false)
const modalAlertMessage = ref('')
const modalAlertType = ref('')

const vesselAgentDetailData = ref<IVasselAgentDetail>({
    id: 0,
    email: '',
    rightsType: '',
    versionApp: '',
    personType: '',
    tax: '',
    company: '',
    fullName: '',
    phone: '',
    mobilePhone: '',
    address: '',
    countryId: 0,
    subDistrictId: 0,
    districtId: 0,
    provinceId: 0,
    stageProvince: '',
    zipCode: '',
    uploadFiles: [] as IUploadFile[],
    status: '',
    createdAt: '',
    isAcceptedTerm: false,
    isFirstLogin: false,
    type: "",
    roleId: 0,
    roleName: "",
    updatedAt: "",
    enabled: false
})

onMounted(async () => {
    await addressOptionsStore.getProvincesOptions()
    await addressOptionsStore.getCountriesOptions()
    if (vesselAgentId) {
        await getVesselAgentDetail(+vesselAgentId)
    }
});

watch(
    () => vesselAgentDetailData.value.countryId,
    (value) => {
        console.log('value country', value)
        isOtherCountry.value = value !== 219 ? true : false
    }
);

watch(
    () => vesselAgentDetailData.value.provinceId,
    async (provinceId) => {
        if (provinceId) {
            await addressOptionsStore.getDistrictsOptions(provinceId)
        }
    }
);

watch(
    () => vesselAgentDetailData.value.districtId,
    async (districtId) => {
        if (districtId) {
            await addressOptionsStore.getSubDistrictsOptions(districtId)
        }
    }
);

const editButtonClass = computed(() => {
  return {
    "mx-1": true,
    "bg-purple-25 text-primaryy-500 hover:bg-purple-50":
      vesselAgentDetailData.value.status !== UserStatusEnum.Approved,
  };
});

const getVesselAgentDetail = async (id: number) => {
    isLoading.value = true
    const resp = await vesselAgentService.getVesselAgentDetail(id)
    if (resp.statusCode === 200) {
        const data = resp.data
        console.log('data==>', data)
        vesselAgentDetailData.value.id = data.id
        vesselAgentDetailData.value.email = data.email
        vesselAgentDetailData.value.rightsType = data.rightsType
        vesselAgentDetailData.value.versionApp = data.versionApp
        vesselAgentDetailData.value.personType = data.personType
        vesselAgentDetailData.value.tax = data.tax
        vesselAgentDetailData.value.company = data.company
        vesselAgentDetailData.value.fullName = data.fullName
        vesselAgentDetailData.value.phone = data.phone
        vesselAgentDetailData.value.mobilePhone = data.mobilePhone
        vesselAgentDetailData.value.address = data.address
        vesselAgentDetailData.value.countryId = data.countryId
        vesselAgentDetailData.value.subDistrictId = data.subDistrictId
        vesselAgentDetailData.value.districtId = data.districtId
        vesselAgentDetailData.value.provinceId = data.provinceId
        vesselAgentDetailData.value.stageProvince = data.stageProvince
        vesselAgentDetailData.value.zipCode = data.zipCode
        vesselAgentDetailData.value.uploadFiles = data.uploadFiles || []
        vesselAgentDetailData.value.status = data.status
        vesselAgentDetailData.value.createdAt = data.createdAt
        vesselAgentDetailData.value.isAcceptedTerm = data.isAcceptedTerm
        vesselAgentDetailData.value.isFirstLogin = data.isFirstLogin
    }
    isLoading.value = false
}

const dialogCancelApprove = () => {
    isConfirmDialogOpen.value = false
}

const dialogCancelDeleteVesselAgent = () => {
    isConfirmCancelDialogOpen.value = false
}

const dialogCancelResetPassword = () => {
    isConfirmDialogResetPasswordOpen.value = false
}
const dialogConfirmApprove = async () => {
    isLoading.value = true
    if (vesselAgentId) {
        const resp = await vesselAgentService.approveVesselAgent(vesselAgentId)
        if (resp.statusCode === 200) {
            isAlertDialogApproveOpen.value = true
            modalAlertMessage.value = 'การอนุมัติตัวแทนเรือของคุณสำเร็จแล้ว'
            modalAlertType.value = 'success'
        } else {
            isAlertDialogApproveOpen.value = true
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
            modalAlertMessage.value = 'การยกเลิกตัวแทนเรือของคุณสำเร็จแล้ว'
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

const dialogConfirmResetPasword = async () => {
    isLoading.value = true
    if (vesselAgentId) {
        const resp = await authService.sendEmailForgetPassword({ email: vesselAgentDetailData.value.email })
        if (resp.statusCode === 200) {
            isAlertDialogResetPasswordOpen.value = true
            modalAlertMessage.value = 'การรีเซ็ตรหัสผ่านของคุณสำเร็จแล้ว กรุณาตรวจสอบอีเมลเพื่อรับรหัสเข้าสู่ระบบ'
            modalAlertType.value = 'success'
        } else {
            isAlertDialogResetPasswordOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    }

    isLoading.value = false
    isConfirmDialogResetPasswordOpen.value = false
}

const handleCloseAlertDialog = () => {
    isAlertCancelDialogOpen.value = false
    navigateToManageShipAgentsList()
}

const handleCloseAlertDialogApprove = () => {
    isAlertDialogApproveOpen.value = false
    getVesselAgentDetail(vesselAgentId)
}

const handleCloseAlertDialogResetPassword = () => {
    isAlertDialogResetPasswordOpen.value = false
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
</script>
