<template>
    <div class="mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('user_management') }}</h1>
    </div>
    <UForm :schema="userSchema" :state="formGroup" @submit="onSubmit">
        <div id="ship-agent-form-content" class="bg-white px-8 py-6  rounded-[0px_0px_20px_20px]">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h1 class="font-semibold text-lg text-grayy-400">{{ (isEdit || isView) ? $t('user_information')
                        : $t('create_user') }}</h1>
                    <div class="mt-1 text-grayy-75 text-sm">{{ $t('user_detail') }}</div>
                </div>
                <div class="flex items-center">
                    <UButton v-if="isView" @click="navigateTo('/users-management/list')"
                        class="mx-2 border border-grayy-100" size="md" color="gray" :label="$t('close')" />
                    <UButton v-else @click="handleCancleCreateOrSaveUser" class="mx-2 border border-grayy-100" size="md"
                        color="gray" :label="$t('cancel')" />
                    <UButton v-if="!isView" size="md" :label="$t('save')" type="submit" />
                    <UButton v-if="isView && userEnabled" @click="() => isConfirmDialogResetPasswordOpen = true"
                        class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50" size="md"
                        :label="$t('reset_password')" icon="i-heroicons-arrow-path" />
                    <UButton v-if="isView" @click="() => navigateTo(`/users-management/edit?id=${userId}`)" class="ml-1"
                        icon="i-heroicons-pencil-square" size="md" :label="$t('edit')" type="submit" />
                </div>
            </div>
            <UDivider />

            <div class="border border-grayy-100 p-8 rounded-xl mt-6">
                <div class="grid grid-cols-2 gap-4">
                    <Input :is-view="isView" :label="$t('email')" name="email" :placeholder="$t('email')"
                        v-model="formGroup.email" required />
                    <USelect :is-view="isView" :label="$t('user_permission')" name="roleId"
                        :placeholder="$t('user_permission')" v-model="formGroup.roleId" required
                        :options="rolesOptionsStore.rolesOption" />
                    <Input :is-view="isView" :label="$t('first_name')" name="firstName" :placeholder="$t('first_name')"
                        v-model="formGroup.firstName" required />
                    <Input :is-view="isView" :label="$t('last_name')" name="lastName" :placeholder="$t('last_name')"
                        v-model="formGroup.lastName" required />
                    <Input :is-view="isView" :label="$t('telephone_no')" name="phone" :placeholder="$t('telephone_no')"
                        v-model="formGroup.phone" required />
                    <Input :is-view="isView" :label="$t('mobile_phone_no')" name="mobilePhone"
                        :placeholder="$t('mobile_phone_no')" v-model="formGroup.mobilePhone"
                        @blur="validate('mobilePhone')" @input="validate('mobilePhone')"
                        :error="getError('mobilePhone') || ''" />
                </div>

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
        :dialogConfirm="() => navigateTo('/users-management/list')" />
    <DialogConfirm :title="$t('reset_password')" :desc="$t('confirm_reset_password')" icon="warning"
        :labelConfirm="$t('confirm')" :labelCancel="$t('cancel')" :isDialogOpen="isConfirmDialogResetPasswordOpen"
        :dialogCancel="dialogCancelResetPassword" :dialogConfirm="dialogConfirmResetPasword" />
    <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="$t('create_user_permission')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
    <DialogAlert :isOpen="isAlertDialogUpdateOpen" :desc="modalAlertMessage" title="บันทึกตัวแทนเรือ"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogUpdate" :btnName="$t('close')" />
    <DialogAlert :isOpen="isAlertDialogResetPasswordOpen" :desc="modalAlertMessage" :title="$t('reset_password')"
        :type="modalAlertType" :setDialog="handleCloseAlertDialogResetPassword" :btnName="$t('close')" />
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import Input from '~/components/form/u-input.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import USelect from "~/components/form/u-select.vue";
import type { IUserRequest } from "~/core/interfaces/IUserRequest";
import useUserOfficerService from "~/core/services/userOfficerService";
import useAuthService from "~/core/services/authService";

const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === 'edit'
const isView = route.params.mode === 'view'
const userOfficerService = useUserOfficerService()
const authService = useAuthService()
const rolesOptionsStore = useRolesOptionsStore()
const query: any = route.query;
const userId = (isEdit || isView) && query.id

const isLoading = ref(false)

const isConfirmDialogOpen = ref(false)
const isConfirmLeaveDialogOpen = ref(false)
const isConfirmCancelDialogOpen = ref(false)
const isConfirmDialogResetPasswordOpen = ref(false)
const isAlertDialogResetPasswordOpen = ref(false)
const isAlertDialogOpen = ref(false)
const isAlertDialogUpdateOpen = ref(false)
const modalAlertMessage = ref('')
const modalAlertType = ref('')
const nextRoute = ref<any>(null);
const notAllowNavigate = ref(true)
const userEnabled = ref(false)


const userSchema = z.object({
    email: z.string().nonempty({ message: t('please_enter_a_value') }).email(t('email_format_validate_message')),
    roleId: z.number().min(1, { message: t('please_enter_a_value') }),
    firstName: z.string().nonempty({ message: t('please_enter_a_value') }),
    lastName: z.string().nonempty({ message: t('please_enter_a_value') }),
    phone: z.string().nonempty({ message: t('please_enter_a_value') }).regex(regxPhone, { message: t('phone_format_validate_message') }),
    mobilePhone: z.string().optional()
})

const formGroup = reactive({
    email: '',
    roleId: 0,
    firstName: '',
    lastName: '',
    phone: '',
    mobilePhone: ''
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

const payload = ref<IUserRequest>({
    email: '',
    roleId: 0,
    fullName: '',
    phone: '',
    mobilePhone: '',
})


onMounted(() => {
    rolesOptionsStore.getRolesOptions()
    if (userId) {
        getUserDetail(+userId)
    }
});

const getUserDetail = async (id: number) => {
    const resp = await userOfficerService.getUserDetail(id)
    if (resp.statusCode === 200) {
        const data = resp.data
        const [firstName, lastName] = data.fullName.split(' ')
        formGroup.email = data.email
        formGroup.roleId = data.roleId
        formGroup.firstName = firstName
        formGroup.lastName = lastName
        formGroup.phone = data.phone
        formGroup.mobilePhone = data.mobilePhone
        userEnabled.value = data.enabled
        // selectedPermissions.value = data.permissions
        // payload.value = { ...payload.value, activated: data.activated }
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

async function onSubmit(event: FormSubmitEvent<z.output<typeof userSchema>>) {
    validate('mobilePhone')
    if (errors.value.length === 0) {
        const newPayload = {
            ...payload.value,
            email: event.data.email,
            fullName: `${event.data.firstName} ${event.data.lastName}`,
            phone: event.data.phone,
            mobilePhone: event.data.mobilePhone || '',
            roleId: event.data.roleId,
        }
        payload.value = { ...newPayload }
        isConfirmDialogOpen.value = true
    }
}

const dialogCancel = () => {
    isConfirmDialogOpen.value = false
}
const dialogConfirm = async () => {
    isLoading.value = true
    notAllowNavigate.value = false
    if (userId) {
        const resp = await userOfficerService.updateUser(userId, payload.value)
        if (resp.statusCode === 200) {
            isAlertDialogUpdateOpen.value = true
            modalAlertMessage.value = 'แก้ไขบัญชีผู้ใช้งานสำเร็จแล้ว'
            modalAlertType.value = 'success'
        } else {
            isAlertDialogUpdateOpen.value = true
            modalAlertMessage.value = resp.message
            modalAlertType.value = 'error'
        }
    } else {
        const resp = await userOfficerService.createUser(payload.value)
        if (resp.statusCode === 200) {
            isAlertDialogOpen.value = true
            modalAlertMessage.value = 'สร้างบัญชีผู้ใช้งานสำเร็จแล้ว'
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

const dialogCancelResetPassword = () => {
    isConfirmDialogResetPasswordOpen.value = false
}

const dialogConfirmResetPasword = async () => {
    isLoading.value = true
    if (userId) {
        const resp = await authService.sendEmailForgetPassword({ email: formGroup.email })
        if (resp.statusCode === 200) {
            isAlertDialogResetPasswordOpen.value = true
            modalAlertMessage.value = t('reset_password_success')
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

const handleCloseAlertDialogResetPassword = () => {
    isAlertDialogResetPasswordOpen.value = false
}


const handleCloseAlertDialog = () => {
    if (modalAlertType.value === 'success') {
        navigateTo('/users-management/list')
    }
    isAlertDialogOpen.value = false
}

const handleCloseAlertDialogUpdate = () => {
    isAlertDialogUpdateOpen.value = false
    getUserDetail(userId)
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

const handleCancleCreateOrSaveUser = () => {
    isConfirmCancelDialogOpen.value = true
    notAllowNavigate.value = false
}
</script>
