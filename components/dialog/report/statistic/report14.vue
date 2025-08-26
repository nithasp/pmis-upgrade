<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[500px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="BookVariant" alt="Icon" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-anuphan-semi-bold mb-1">
                        ข้อมูลสินค้า ผ่านเข้าออกท่าเรืออุตสาหกรรมมาบตาพุด
                    </div>
                    <p class="text-gray-600 text-sm">กรุณาเลือกตัวกรอง</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <UFormGroup name="radio">
                        <div class="space-y-2">
                            <URadio v-for="option in options" :key="option.value" v-model="formGroup.radio"
                                v-bind="option" :ui="{
                                    label: 'font-anuphan-medium'
                                }">
                                {{ option.label }}
                            </URadio>
                        </div>
                    </UFormGroup>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-y-2">
                    <USelect :label="$t('port')" :placeholder="$t('port')" name="berthId"
                    :options="documentOptionsStore.berthsOption" v-model="formGroup.berthId" required />
                    <USelect :label="$t('product_kind')" :placeholder="$t('product_kind')" name="productTypeId"
                    :options="documentOptionsStore.productTypesOptions" v-model="formGroup.productTypeId" required />
                </div>
                <div class="mt-8 grid grid-cols-2 gap-3">
                    <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
                        class="rounded-lg w-full border border-gray-100 outline-none" @click="dialogCancel" />
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
import USelect from "~/components/form/u-select.vue";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import BookVariant from "~/assets/icons/dialog/book-variant.png";
import useReportService from "~/core/services/reportService";

const { t } = useI18n();
const reportService = useReportService();
const documentOptionsStore = useDocumentOptionsStore();
const accessToken = ref(localStorage.getItem("access_token"));
const options = [
    { label: "สินค้าเข้า", value: "option-1" },
    { label: "สินค้าออก", value: "option-2" },
];

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
        default: "",
    },
    endDate: {
        type: String,
        default: "",
    },
    yearEra: {
        type: String,
        default: "",
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
    reportType: {
        type: Number,
        default: 0,
    },
});

const startDate = computed(() => props.startDate);
const endDate = computed(() => props.endDate);
const yearEra = computed(() => props.yearEra);
const isPreview = computed(() => props.isPreview);
const reportType = computed(() => props.reportType);
const isLoading = ref(false);


const formSchema = z.object({
    berthId: z.number().min(1, { message: t("required") }),
    productTypeId: z.number().min(1, { message: t("required") }),
});

const formGroup = reactive<any>({
    radio: "option-1",
    berthId: 0,
    productTypeId: 0
});

async function onSubmit(event: FormSubmitEvent<z.output<any>>) {
    isLoading.value = true;
    if (event.data.radio === "option-1") {
        if (isPreview.value) {
            if (reportType.value === 4) {
                const resp = await reportService.previewExcelReportPortDues4_1({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                window.open(resp);
            }

            if (reportType.value === 5) {
                const resp = await reportService.previewExcelReportPortDues5_1({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                window.open(resp);
            }
        } else {
            if (reportType.value === 4) {
                const resp = await reportService.downloadExcelReportPortDues4_1({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                if (resp.statusCode === 200) {
                    console.log("export success");
                } else {
                    alert(resp.message)
                }
            }

            if (reportType.value === 5) {
                const resp = await reportService.downloadExcelReportPortDues5_1({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                if (resp.statusCode === 200) {
                    console.log("export success");
                } else {
                    alert(resp.message)
                }
            }
        }
    }

    if (event.data.radio === "option-2") {
        if (isPreview.value) {
            if (reportType.value === 4) {
                const resp = await reportService.previewExcelReportPortDues4({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                window.open(resp);
            }

            if (reportType.value === 5) {
                const resp = await reportService.previewExcelReportPortDues5({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                window.open(resp);
            }
        } else {
            if (reportType.value === 4) {
                const resp = await reportService.downloadExcelReportPortDues4({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                if (resp.statusCode === 200) {
                    console.log("export success");
                } else {
                    alert(resp.message)
                }
            }

            if (reportType.value === 5) {
                const resp = await reportService.downloadExcelReportPortDues5({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                if (resp.statusCode === 200) {
                    console.log("export success");
                } else {
                    alert(resp.message)
                }
            }
        }
    }

    if (event.data.radio === "option-3") {
        if (isPreview.value) {
            if (reportType.value === 4) {
                const resp = await reportService.previewExcelReportPortDues4_3({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                window.open(resp);
            }

            if (reportType.value === 5) {
                const resp = await reportService.previewExcelReportPortDues5_3({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                window.open(resp);
            }
        } else {
            if (reportType.value === 4) {
                const resp = await reportService.downloadExcelReportPortDues4_3({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                if (resp.statusCode === 200) {
                    console.log("export success");
                } else {
                    alert(resp.message)
                }
            }

            if (reportType.value === 5) {
                const resp = await reportService.downloadExcelReportPortDues5_3({
                    berthId: event.data.berthId,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    year: yearEra.value,
                    token: accessToken.value,
                });
                if (resp.statusCode === 200) {
                    console.log("export success");
                } else {
                    alert(resp.message)
                }
            }
        }
    }

    props.confirmAfterAction();
    isLoading.value = false;
}

watch(
    () => props.isDialogOpen,
    (value) => {
        if(value) {
            documentOptionsStore.getBerthsOptions();
            documentOptionsStore.getProductTypesOptions();
        }

    }
);
</script>