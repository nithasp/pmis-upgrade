<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[400px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="WarningIcon" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">ส่งกลับเรือเข้า-ออก</div>
                    <p class="text-gray-500 text-sm">ระบุรายละเอียดที่ต้องการให้แก้ไข</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <UTextarea label="รายละเอียด" placeholder="รายละเอียด" v-model="formGroup.note" resize
                        name="note" />
                </div>
                <div class="mt-8 grid grid-cols-2 gap-3">
                    <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
                        class="rounded-lg w-full  border border-gray-100 outline-none" @click="dialogCancel" />
                    <UButton size="lg" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full"
                        type="submit" />
                </div>
            </div>
        </UForm>
    </UModal>
</template>
<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import UTextarea from "~/components/form/u-textarea.vue";
import WarningIcon from "~/assets/icons/dialog/warning.png";
import type { ISendBackRejectRequest } from "~/core/interfaces/ISendBackRejectRequest";
import useVesselImportService from "~/core/services/vesselImport";

const { t } = useI18n();
const vesselImportService = useVesselImportService();

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: {
        type: Function as PropType<(...args: any[]) => void>,
        default: () => { },
    },
    vesselImportId: {
        type: Number,
        required: true,
    },
    confirmSendBackRejected: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
});

const vesselImportId = computed(() => props.vesselImportId)

const createSchema = () => {
    return z.object({
        note: z.string().nonempty({ message: t('please_enter_a_value') }),
    })
}

const formSchema = ref(createSchema())

const formGroup = reactive<any>({
    note: '',
})

const payload = ref<any>({
    note: '',
})


async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    const newPayload: ISendBackRejectRequest = {
        ...payload.value,
        ...event.data,
    }
    payload.value = newPayload
    const resp = await vesselImportService.returnVesselImport(vesselImportId.value, newPayload)
    if (resp.statusCode === 200) {
        props.confirmSendBackRejected(true, resp)
    } else {
        props.confirmSendBackRejected(false, resp)
    }
}

watch(
    () => props.isDialogOpen,
    () => {
        formGroup.note = ''
    }
)

</script>
