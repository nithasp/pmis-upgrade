<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[400px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="WarningIcon" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">ส่งกลับใบคำร้อง</div>
                    <p class="text-gray-500 text-sm">ระบุรายละเอียดที่ต้องการให้แก้ไข</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <UTextarea label="รายละเอียด" placeholder="รายละเอียด" v-model="formGroup.rejectNote" resize
                        name="rejectNote" />
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
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import useDocumentService from "~/core/services/documentService";
import UTextarea from "~/components/form/u-textarea.vue";
import WarningIcon from "~/assets/icons/dialog/warning.png";
import type { ISendBackRejectRequest } from "~/core/interfaces/ISendBackRejectRequest";
import Loading from "~/components/loading.vue";

const { t } = useI18n();
const documentService = useDocumentService();
const isLoading = ref(false)

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: {
        type: Function as PropType<(...args: any[]) => void>,
        default: () => { },
    },
    documentId: {
        type: Number,
        required: true,
    },
    confirmSendBackRejected: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
});

const documentId = computed(() => props.documentId)

const createSchema = () => {
    return z.object({
        rejectNote: z.string().nonempty({ message: t('please_enter_a_value') }),
    })
}

const formSchema = ref(createSchema())

const formGroup = reactive<ISendBackRejectRequest>({
    rejectNote: '',
})

const payload = ref<ISendBackRejectRequest>({
    rejectNote: '',
})


async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    const newPayload: ISendBackRejectRequest = {
        ...payload.value,
        ...event.data,
    }
    payload.value = newPayload
    isLoading.value = true
    const resp = await documentService.sendBackRejected(documentId.value, newPayload)
    if (resp.statusCode === 200) {
        props.confirmSendBackRejected(true, resp)
    } else {
        props.confirmSendBackRejected(false, resp)
    }
    isLoading.value = false
}



</script>
