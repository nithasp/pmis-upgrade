<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl !max-w-[400px]',
    }">
        <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="ShipVariant" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">จองท่าเทียบเรือย่อย</div>
                    <p class="text-gray-500 text-sm">ระบุรายละเอียท่าเทียบเรือย่อย</p>
                </div>
                <div class="mt-5 grid grid-cols-1 gap-4">
                    <USelect v-for="(spBerth, index) in spacialBerths"
                        :label="`ท่าเทียบเรือย่อย ${spBerth.berthType} (${spBerth.eta ? renderDateFormat(spBerth.eta) : ''} - ${spBerth.etd ? renderDateFormat(spBerth.etd) : ''})`"
                        :name="`${spBerth.berthType}${index + 1}`" required
                        :options="documentOptionsStore.jettiesOptions"
                        v-model="formGroup[`${spBerth.berthType}${index + 1}`]"
                        @change="(value: number) => handleSelectedJetty(value, index)" />
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
import useDocumentService from "~/core/services/documentService";
import USelect from "~/components/form/u-select.vue";
import ShipVariant from "~/assets/icons/dialog/ship-variant.png";
import type { ISpacialBerths } from "~/core/interfaces/ISpacialBerths";
import type { ISpacialBerthsRequest } from "~/core/interfaces/ISpacialBerthsRequest";
import type { ISpacialBerthsPayload } from "~/core/interfaces/ISpacialBerthsPayload";

const { t } = useI18n();
const documentService = useDocumentService()
const documentOptionsStore = useDocumentOptionsStore()
const spacialBerthSelectedList = ref<ISpacialBerthsRequest[]>([])

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
    confirmApproveWithJetty: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
    spacialBerths: {
        type: Array as PropType<ISpacialBerths[]>,
        required: true,
    },
});

const documentId = computed(() => props.documentId)

const createSchema = () => {
    return z.object(
        props.spacialBerths.reduce((acc, item, index) => {
            acc[`${item.berthType}${index + 1}`] = z.number().min(1, { message: t("please_enter_a_value") });
            return acc;
        }, {} as Record<string, z.ZodNumber>)
    );
}

const formSchema = ref(createSchema())

const formGroup = reactive<Record<string, number>>(
    props.spacialBerths.reduce((acc, item, index) => {
        acc[`${item.berthType}${index + 1}`] = 0;
        return acc;
    }, {} as Record<string, number>)
);

watch(
    () => props.spacialBerths,
    () => {
        if (props.spacialBerths.length === 0) return
        for (let index = 0; index < props.spacialBerths.length; index++) {
            const spaciaspacialBerth = props.spacialBerths[index];
            if (!spacialBerthSelectedList.value[index]) {
                spacialBerthSelectedList.value[index] = { berthId: spaciaspacialBerth.berthId, jettyId: 0 };
            }
        }

        Object.keys(formGroup).forEach(key => delete formGroup[key]);
        props.spacialBerths.forEach((item, index) => {
            formGroup[`${item.berthType}${index + 1}`] = 0;
        });

        formSchema.value = createSchema()
    }
)

const handleSelectedJetty = (value: number, index: number) => {

    spacialBerthSelectedList.value[index] = {
        ...spacialBerthSelectedList.value[index],
        berthId: props.spacialBerths[index].berthId,
        jettyId: value,
    }
}

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
    const payload: ISpacialBerthsPayload = {
        spacialBerths: spacialBerthSelectedList.value
    }
    const resp = await documentService.approveDocument(documentId.value, payload)
    if (resp.statusCode === 200) {
        props.confirmApproveWithJetty(true, resp)
    } else {
        props.confirmApproveWithJetty(false, resp)
    }
}



</script>
