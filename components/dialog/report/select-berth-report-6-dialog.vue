<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[400px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="ShipVariant" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">ยืนยัน Gross Tonnage</div>
                    <p class="text-gray-500 text-sm">กรุณาเลือกรายการ Gross Tonnage ที่ถูกต้อง</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <USelect label="ท่าเรือ" placeholder="ท่าเรือ" name="berthId"
                        :options="documentOptionsStore.berthsOption" v-model="formGroup.berthId" />
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
import Loading from "~/components/loading.vue";
import USelect from "~/components/form/u-select.vue";
import ShipVariant from "~/assets/icons/dialog/ship-variant.png";
import useReportService from "~/core/services/reportService";

const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore()
const reportService = useReportService()
const accessToken = ref(localStorage.getItem('access_token'))

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: {
        type: Function as PropType<(...args: any[]) => void>,
        default: () => { },
    },
    confirmAfterAction: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
    startDate: {
        type: String,
        default: ''
    },
    endDate: {
        type: String,
        default: ''
    },
    yearEra: {
        type: String,
        default: ''
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    berthReport6Type: {
        type: String,
        default: ''
    }
});

const startDate = computed(() => props.startDate)
const endDate = computed(() => props.endDate)
const yearEra = computed(() => props.yearEra)
const isPreview = computed(() => props.isPreview)
const isLoading = ref(false)
const emit = defineEmits(['export-pdf6'])

const createSchema = () => {
    return z.object({
        berthId: z.number().min(1, { message: t('please_enter_a_value') }),
    })
}

const formSchema = ref(createSchema())
const formGroup = reactive<any>({
    berthId: 0,
})

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    isLoading.value = true
    if (props.berthReport6Type === 'excel') {
        if (isPreview.value) {
            const resp = await reportService.previewExcelReport6({
                berthId: event.data.berthId,
                startDate: startDate.value,
                endDate: endDate.value,
                year: yearEra.value,
                token: accessToken.value
            })
            window.open(resp);
        } else {
            const resp = await reportService.downloadExcelReport6({
                berthId: event.data.berthId,
                startDate: startDate.value,
                endDate: endDate.value,
                year: yearEra.value,
                token: accessToken.value
            })
            if (resp.statusCode === 200) {
                console.log('export success')     
            }
        }
    } else {
        emit('export-pdf6', 6, event.data.berthId)
    }
    props.confirmAfterAction()
    isLoading.value = false
}

watch(
    () => props.isDialogOpen,
    () => {
        formGroup.berthId = 0
    }
)
</script>