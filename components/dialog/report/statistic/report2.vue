<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[500px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="BookVariant" alt="Icon" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-anuphan-semi-bold mb-1">IMPORT - EXPORT CLASSIFIED BY KIND OF GOODS</div>
                    <p class="text-gray-600 text-sm">กรุณาเลือกตัวกรอง</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <USelect :label="$t('product_kind')" :placeholder="$t('product_kind')" name="productTypeId"
                    :options="documentOptionsStore.productTypesOptions" v-model="formGroup.productTypeId" required />
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
import Loading from "~/components/loading.vue";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import USelect from "~/components/form/u-select.vue";
import BookVariant from "~/assets/icons/dialog/book-variant.png";
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
});

const startDate = computed(() => props.startDate)
const endDate = computed(() => props.endDate)
const yearEra = computed(() => props.yearEra)
const isPreview = computed(() => props.isPreview)
const isLoading = ref(false)

const createSchema = () => {
    return z.object({
        productTypeId: z.number().min(1, { message: t('please_enter_a_value') }),
    })
}

const formSchema = ref(createSchema())

const formGroup = reactive<any>({
    productTypeId: 0,
})

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    isLoading.value = true
    if (isPreview.value) {
        const resp = await reportService.previewExcelReport6({
            productTypeId: event.data.productTypeId,
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
        })
        window.open(resp);
    } else {
        const resp = await reportService.downloadExcelReport6({
            productTypeId: event.data.productTypeId,
            startDate: startDate.value,
            endDate: endDate.value,
            year: yearEra.value,
            token: accessToken.value
        })
        if (resp.statusCode === 200) {
            console.log('export success')
        }

    }

    props.confirmAfterAction()
    isLoading.value = false
}

watch(
    () => props.isDialogOpen,
    () => {
        formGroup.productTypeId = 0
        documentOptionsStore.getProductTypesOptions();
    }
)


</script>
