<template>
    <div class="mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('permission_management') }}</h1>
    </div>
    <UForm :schema="permissionSchema" :state="formGroup" @submit="onSubmit">
        <div id="ship-agent-form-content" class="bg-white px-8 py-6  rounded-[0px_0px_20px_20px]">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h1 class="font-semibold text-lg text-grayy-400">{{ isEdit ? $t('edit_user_permission')
                        : $t('create_user_permission') }}</h1>
                    <div class="mt-1 text-grayy-75 text-sm">{{ $t('user_permission_detail') }}</div>
                </div>
                <div class="">
                    <UButton v-if="isView" @click="navigateTo('/permission-management/list')"
                        class="mx-2 border border-grayy-100" size="md" color="gray" :label="$t('close')" />
                    <UButton v-else @click="handleCancleCreateVessel" class="mx-2 border border-grayy-100" size="md"
                        color="gray" :label="$t('cancel')" />
                    <UButton v-if="!isView" size="md" :label="$t('save')" type="submit" />
                </div>
            </div>
            <UDivider />

            <div class="border border-grayy-100 p-8 rounded-xl mt-6">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <Input :is-view="isView" :label="$t('user_permission_name')" name="name"
                            :placeholder="$t('user_permission_name')" v-model="formGroup.name" />
                    </div>
                </div>
                <UDivider class="my-4" />
                <!-- request form -->
                <h2 class="font-semibold text-grayy-400 mb-3">ใบคำร้อง</h2>
                <h3 class="font-medium text-grayy-400 my-3">แดชบอร์ด</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="view_dashboard_document">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_dashboard_document')"
                            @change="toggleSelection('view_dashboard_document')" />
                    </UFormGroup>
                </div>
                <h3 class="font-medium text-grayy-400 my-3">รายการใบคำร้อง</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="create_document">
                        <Checkbox :disabled="isView" :label="$t('create')" :sub-label="$t('create_information')"
                            :model-value="isSelected('create_document')" @change="toggleSelection('create_document')" />
                    </UFormGroup>
                    <UFormGroup name="view_document">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_document')" @change="toggleSelection('view_document')" />
                    </UFormGroup>
                    <UFormGroup name="edit_document">
                        <Checkbox :disabled="isView" :label="$t('edit')" :sub-label="$t('edit_information')"
                            :model-value="isSelected('edit_document')" @change="toggleSelection('edit_document')" />
                    </UFormGroup>
                    <UFormGroup name="delete_document">
                        <Checkbox :disabled="isView" :label="$t('delete')" :sub-label="$t('delete_information')"
                            :model-value="isSelected('delete_document')" @change="toggleSelection('delete_document')" />
                    </UFormGroup>
                    <UFormGroup name="verify_document">
                        <Checkbox :disabled="isView" :label="$t('verify')" :sub-label="$t('verify_information')"
                            :model-value="isSelected('verify_document')" @change="toggleSelection('verify_document')" />
                    </UFormGroup>
                    <UFormGroup name="approve_document">
                        <Checkbox :disabled="isView" :label="$t('approve')" :sub-label="$t('approve_information')"
                            :model-value="isSelected('approve_document')"
                            @change="toggleSelection('approve_document')" />
                    </UFormGroup>
                </div>
                <UDivider class="my-4" />
                <!-- vessel -->
                <h2 class="font-semibold text-grayy-400 mb-3">การเดินเรือ</h2>
                <h3 class="font-medium text-grayy-400 my-3">แดชบอร์ด</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="view_dashboard_sailing">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_dashboard_sailing')"
                            @change="toggleSelection('view_dashboard_sailing')" />
                    </UFormGroup>
                </div>
                <h3 class="font-medium text-grayy-400 my-3">รายการใบคำร้อง</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="create_sailing">
                        <Checkbox :disabled="isView" :label="$t('create')" :sub-label="$t('create_information')"
                            :model-value="isSelected('create_sailing')" @change="toggleSelection('create_sailing')" />
                    </UFormGroup>
                    <UFormGroup name="view_sailing">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_sailing')" @change="toggleSelection('view_sailing')" />
                    </UFormGroup>
                    <UFormGroup name="edit_sailing">
                        <Checkbox :disabled="isView" :label="$t('edit')" :sub-label="$t('edit_information')"
                            :model-value="isSelected('edit_sailing')" @change="toggleSelection('edit_sailing')" />
                    </UFormGroup>
                    <UFormGroup name="delete_sailing">
                        <Checkbox :disabled="isView" :label="$t('delete')" :sub-label="$t('delete_information')"
                            :model-value="isSelected('delete_sailing')" @change="toggleSelection('delete_sailing')" />
                    </UFormGroup>
                    <UFormGroup name="verify_sailing">
                        <Checkbox :disabled="isView" :label="$t('verify')" :sub-label="$t('verify_information')"
                            :model-value="isSelected('verify_sailing')" @change="toggleSelection('verify_sailing')" />
                    </UFormGroup>
                    <UFormGroup name="approve_sailing">
                        <Checkbox :disabled="isView" :label="$t('approve')" :sub-label="$t('approve_information')"
                            :model-value="isSelected('approve_sailing')" @change="toggleSelection('approve_sailing')" />
                    </UFormGroup>
                </div>
                <UDivider class="my-4" />
                <!-- vessel ship in out -->
                <h2 class="font-semibold text-grayy-400 mb-3">เรือเข้า-ออก</h2>
                <h3 class="font-medium text-grayy-400 my-3">แดชบอร์ด</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="view_dashboard_ship_in_out">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_dashboard_ship_in_out')"
                            @change="toggleSelection('view_dashboard_ship_in_out')" />
                    </UFormGroup>
                </div>
                <h3 class="font-medium text-grayy-400 my-3">นำเข้าข้อมูลเรือเข้า-ออก</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="create_ship_in_out_import">
                        <Checkbox :disabled="isView" :label="$t('create')" :sub-label="$t('create_information')"
                            :model-value="isSelected('create_ship_in_out_import')"
                            @change="toggleSelection('create_ship_in_out_import')" />
                    </UFormGroup>
                    <UFormGroup name="view_ship_in_out_import">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_ship_in_out_import')"
                            @change="toggleSelection('view_ship_in_out_import')" />
                    </UFormGroup>
                    <UFormGroup name="edit_ship_in_out_import">
                        <Checkbox :disabled="isView" :label="$t('edit')" :sub-label="$t('edit_information')"
                            :model-value="isSelected('edit_ship_in_out_import')"
                            @change="toggleSelection('edit_ship_in_out_import')" />
                    </UFormGroup>
                    <UFormGroup name="delete_ship_in_out_import">
                        <Checkbox :disabled="isView" :label="$t('delete')" :sub-label="$t('delete_information')"
                            :model-value="isSelected('delete_ship_in_out_import')"
                            @change="toggleSelection('delete_ship_in_out_import')" />
                    </UFormGroup>
                </div>
                <h3 class="font-medium text-grayy-400 my-3">ตรวจสอบข้อมูลเรือเข้า-ออก</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="create_ship_in_out_verify">
                        <Checkbox :disabled="isView" :label="$t('create')" :sub-label="$t('create_information')"
                            :model-value="isSelected('create_ship_in_out_verify')"
                            @change="toggleSelection('create_ship_in_out_verify')" />
                    </UFormGroup>
                    <UFormGroup name="view_ship_in_out_verify">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_ship_in_out_verify')"
                            @change="toggleSelection('view_ship_in_out_verify')" />
                    </UFormGroup>
                    <UFormGroup name="edit_ship_in_out_verify">
                        <Checkbox :disabled="isView" :label="$t('edit')" :sub-label="$t('edit_information')"
                            :model-value="isSelected('edit_ship_in_out_verify')"
                            @change="toggleSelection('edit_ship_in_out_verify')" />
                    </UFormGroup>
                    <UFormGroup name="delete_ship_in_out_verify">
                        <Checkbox :disabled="isView" :label="$t('delete')" :sub-label="$t('delete_information')"
                            :model-value="isSelected('delete_ship_in_out_verify')"
                            @change="toggleSelection('delete_ship_in_out_verify')" />
                    </UFormGroup>
                </div>
                <!-- account -->
                <UDivider class="my-4" />
                <h2 class="font-semibold text-grayy-400 mb-3">บัญชี</h2>
                <h3 class="font-medium text-grayy-400 my-3">แดชบอร์ด</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="view_dashboard_account">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_dashboard_account')"
                            @change="toggleSelection('view_dashboard_account')" />
                    </UFormGroup>
                </div>
                <h3 class="font-medium text-grayy-400 my-3">รายการใบคำร้อง</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="create_account">
                        <Checkbox :disabled="isView" :label="$t('create')" :sub-label="$t('create_information')"
                            :model-value="isSelected('create_account')" @change="toggleSelection('create_account')" />
                    </UFormGroup>
                    <UFormGroup name="view_account">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_account')" @change="toggleSelection('view_account')" />
                    </UFormGroup>
                    <UFormGroup name="edit_account">
                        <Checkbox :disabled="isView" :label="$t('edit')" :sub-label="$t('edit_information')"
                            :model-value="isSelected('edit_account')" @change="toggleSelection('edit_account')" />
                    </UFormGroup>
                    <UFormGroup name="delete_account">
                        <Checkbox :disabled="isView" :label="$t('delete')" :sub-label="$t('delete_information')"
                            :model-value="isSelected('delete_account')" @change="toggleSelection('delete_account')" />
                    </UFormGroup>
                    <UFormGroup name="verify_account">
                        <Checkbox :disabled="isView" :label="$t('verify')" :sub-label="$t('verify_information')"
                            :model-value="isSelected('verify_account')" @change="toggleSelection('verify_account')" />
                    </UFormGroup>
                    <UFormGroup name="approve_account">
                        <Checkbox :disabled="isView" :label="$t('approve')" :sub-label="$t('approve_information')"
                            :model-value="isSelected('approve_account')" @change="toggleSelection('approve_account')" />
                    </UFormGroup>
                </div>
                <UDivider class="my-4" />
                <!-- vessel data -->
                <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูล</h2>
                <h3 class="font-medium text-grayy-400 my-3">รายการเรือ</h3>
                <div class="grid grid-cols-4 gap-4 xl:grid-cols-6">
                    <UFormGroup name="create_vessel_data">
                        <Checkbox :disabled="isView" :label="$t('create')" :sub-label="$t('create_information')"
                            :model-value="isSelected('create_vessel_data')"
                            @change="toggleSelection('create_vessel_data')" />
                    </UFormGroup>
                    <UFormGroup name="view_vessel_data">
                        <Checkbox :disabled="isView" :label="$t('view')" :sub-label="$t('access_and_view_information')"
                            :model-value="isSelected('view_vessel_data')"
                            @change="toggleSelection('view_vessel_data')" />
                    </UFormGroup>
                    <UFormGroup name="edit_vessel_data">
                        <Checkbox :disabled="isView" :label="$t('edit')" :sub-label="$t('edit_information')"
                            :model-value="isSelected('edit_vessel_data')"
                            @change="toggleSelection('edit_vessel_data')" />
                    </UFormGroup>
                    <UFormGroup name="delete_vessel_data">
                        <Checkbox :disabled="isView" :label="$t('delete')" :sub-label="$t('delete_information')"
                            :model-value="isSelected('delete_vessel_data')"
                            @change="toggleSelection('delete_vessel_data')" />
                    </UFormGroup>
                </div>
                <UDivider class="my-4" />
            </div>
        </div>
    </UForm>
    <DialogConfirm :title="isEdit ? $t('edit_user_permission') : $t('create_user_permission')"
        :desc="isEdit ? $t('confirm_edit_permission') : $t('confirm_create_permission')" icon="warning"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmDialogOpen" :dialogCancel="dialogCancel"
        :dialogConfirm="dialogConfirm" />
    <DialogConfirm title="ต้องการออกจากหน้านี้" desc="คุณยังไม่ได้บันทึกรายการ ข้อมูลคุณอาจสูญหาย" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmLeaveDialogOpen" :dialogCancel="handleCancelLeave"
        :dialogConfirm="handleConfirmLeave" />
    <DialogConfirm title="ยกเลิกการบันทึกข้อมูล" desc="คุณยังไม่ได้บันทึกรายการ ข้อมูลคุณอาจสูญหาย" icon="warning"
        labelConfirm="ยืนยัน" :isDialogOpen="isConfirmCancelDialogOpen"
        :dialogCancel="() => isConfirmCancelDialogOpen = false"
        :dialogConfirm="() => navigateTo('/permission-management/list')" />
    <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="$t('create_user_permission')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
    <DialogAlert :isOpen="isAlertDialogUpdateOpen" :desc="modalAlertMessage" title="บันทึกตัวแทนเรือ"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogUpdate" :btnName="$t('close')" />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import Input from '~/components/form/u-input.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import Checkbox from "~/components/form/checkbox.vue";
import type { IRoleRequest } from "~/core/interfaces/IRoleRequest";
import useRoleService from "~/core/services/roleService";

const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === 'edit'
const isView = route.params.mode === 'view'
const roleService = useRoleService()
const query: any = route.query;
const roleId = (isEdit || isView) && query.id

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

const selectedPermissions = ref<string[]>([]);

// Helper method to check if a permission is selected
const isSelected = (permission: string) => selectedPermissions.value.includes(permission);

// Method to toggle the selection
const toggleSelection = (permission: string) => {
    if (isSelected(permission)) {
        // Remove from the array if it's already selected
        selectedPermissions.value = selectedPermissions.value.filter(p => p !== permission);
    } else {
        // Add to the array if it's not selected
        selectedPermissions.value.push(permission);
    }
};


const permissionSchema = z.object({
    name: z.string().nonempty({ message: t('please_enter_a_value') }),
})

const formGroup = reactive({
    name: '',
})

const payload = ref<IRoleRequest>({
    name: "",
    activated: false,
    permissions: []
})


onMounted(() => {
    if (roleId) {
        getRoleDetail(+roleId)
    }
});

const getRoleDetail = async (id: number) => {
    const resp = await roleService.getRoleDetail(id)
    if (resp.statusCode === 200) {
        const data = resp.data
        console.log('')
        formGroup.name = data.name
        selectedPermissions.value = data.permissions
        payload.value = { ...payload.value, activated: data.activated }
    }
}

onBeforeRouteLeave((to, from, next) => {
    if (!isView) {
        if (notAllowNavigate.value) {
            isConfirmLeaveDialogOpen.value = true;
            nextRoute.value = to;
            next(false); // Prevent navigation until confirmed
        } else {
            next(); // Allow navigation
        }
    } else {
        next()
    }

});

async function onSubmit(event: FormSubmitEvent<z.output<typeof permissionSchema>>) {
    const newPayload: IRoleRequest = {
        ...payload.value,
        ...event.data,
    }
    payload.value = { ...newPayload, permissions: selectedPermissions.value }
    isConfirmDialogOpen.value = true
}

const dialogCancel = () => {
    isConfirmDialogOpen.value = false
}
const dialogConfirm = async () => {
    isLoading.value = true
    notAllowNavigate.value = false
    if (roleId) {
        const resp = await roleService.updateRole(roleId, payload.value)
        if (resp.statusCode === 200) {
            isAlertDialogUpdateOpen.value = true
            modalAlertMessage.value = 'แก้ไขสิทธิ์ผู้ใช้งานสำเร็จแล้ว'
            modalAlertType.value = 'success'
        } else {
            isAlertDialogUpdateOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    } else {
        const resp = await roleService.createRole(payload.value)
        if (resp.statusCode === 200) {
            isAlertDialogOpen.value = true
            modalAlertMessage.value = 'สร้างสิทธิ์ผู้ใช้งานสำเร็จแล้ว'
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

const handleCloseAlertDialog = () => {
    if (modalAlertType.value === 'success') {
        navigateTo('/permission-management/list')
    }
    isAlertDialogOpen.value = false
}

const handleCloseAlertDialogUpdate = () => {
    isAlertDialogUpdateOpen.value = false
    getRoleDetail(roleId)
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
</script>
