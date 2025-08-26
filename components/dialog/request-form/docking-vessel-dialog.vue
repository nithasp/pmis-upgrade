<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        rounded: 'rounded-xl',
    }">
        <UForm :state="formGroup" @submit="onSubmit">
            <div class="p-6">
                <img :src="DockingVesselIcon" alt="Icon Warning" class="w-12 h-12" />
                <div class="mt-5">
                    <div class="text-gray-900 text-lg font-semibold mb-1">
                        {{ $t('add_docking_vessel_list') }}
                    </div>
                    <p class="text-gray-500 text-sm">
                        {{ $t('fill_docking_vessel_detail') }}
                    </p>
                </div>
                <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <USelect :label="$t('docking_vessel')" :placeholder="$t('docking_vessel')" name="berthId"
                            v-model="formGroup.berthId" :options="documentOptionsStore.berthsOption" required
                            @change="(value: any) => handleSelectBerth(value)" :error="getError('berthId') || ''" />
                    </div>
                    <div>
                        <USelect :label="$t('purpose_type_of_docking')" :placeholder="$t('purpose_type_of_docking')"
                            name="purposeTypeId" v-model="formGroup.purposeTypeId"
                            :options="documentOptionsStore.purposeTypeOptions" required
                            @change="(value: any) => handleSelectPurposeType(value)"
                            :error="getError('purposeTypeId') || ''" />
                    </div>
                    <div>
                        <USelect :label="$t('purpose_of_docking')" :placeholder="$t('purpose_of_docking')"
                            name="purposeId" v-model="formGroup.purposeId"
                            :options="documentOptionsStore.filteredPurposesOptions" required
                            @change="(value: any) => handleSelectPurpose(value)" :error="getError('purposeId') || ''" />
                    </div>
                    <div>
                        <USelect :label="$t('cargo_type')" :placeholder="$t('cargo_type')" name="cargoTypeId"
                            v-model="formGroup.cargoTypeId" :options="documentOptionsStore.cargoTypesOptions" required
                            @change="(value: any) => validate('cargoTypeId', value)"
                            :error="getError('cargoTypeId') || ''" />
                    </div>
                    <div>
                        <UInput :label="$t('number_passengers')" :placeholder="$t('number_passengers')"
                            v-model="formGroup.passengers" name="passengers" type="number" suffix="คน"
                            @blur="validate('passengers')" @input="validate('passengers')"
                            :error="getError('passengers') || ''" :required="isAllowPassenger" />
                    </div>
                    <div>
                        <UFormGroup :label="$t('estimated_vessel_arrival_date')" required>
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <UInput name="estimatedArrival" size="md" variant="outline" color="purple"
                                    custom-icon="calendar" v-model="formGroup.estimatedArrival"
                                    :value="formGroup.estimatedArrival ? `${format(new Date(formGroup.estimatedArrival), 'd MMM, yyy, HH:mm')}` : ''"
                                    :placeholder="$t('search_title_placeholder')"
                                    :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                                    :error="getError('estimatedArrival') || ''" />
                                <template #panel="{ close }">
                                    <Datepicker v-model="arrivalDate" @close="close" is-required is24hr type="normal"
                                        mode="dateTime" @date-change="onArrivalDateChange" />
                                </template>
                            </UPopover>
                        </UFormGroup>
                    </div>
                    <div>
                        <UFormGroup :label="$t('estimated_vessel_departure_date')" required>
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <UInput name="estimatedDeparture" size="md" variant="outline" color="purple"
                                    custom-icon="calendar" v-model="formGroup.estimatedDeparture"
                                    :value="formGroup.estimatedDeparture ? `${format(new Date(formGroup.estimatedDeparture), 'd MMM, yyy, HH:mm')}` : ''"
                                    :placeholder="$t('search_title_placeholder')"
                                    :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                                    :error="getError('estimatedDeparture') || ''" />
                                <template #panel="{ close }">
                                    <Datepicker v-model="departureDate" @close="close" is-required is24hr type="normal"
                                        mode="dateTime" @date-change="onDepartureDateChange" />
                                </template>
                            </UPopover>
                        </UFormGroup>
                    </div>
                    <div class="md:col-span-2">
                        <UTextarea :label="$t('detail')" :placeholder="$t('detail')" v-model="formGroup.note" />
                    </div>
                </div>
                <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
                        class="rounded-lg w-full border border-gray-100 outline-none" @click="handleDialogCancel" />
                    <UButton size="lg" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full"
                        type="submit" />
                </div>
            </div>
        </UForm>
    </UModal>
</template>

<script setup lang="ts">
import { z } from "zod";
import { format } from "date-fns";
import DockingVesselIcon from "~/assets/icons/dialog/docking-vessel.svg"
import UInput from "~/components/form/u-input.vue";
import USelect from "~/components/form/u-select.vue";
import UTextarea from "~/components/form/u-textarea.vue";
import Datepicker from '~/components/form/v-datepicker.vue';
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { IBerthsDocumentRequest } from "~/core/interfaces/IBerthsDocumentRequest";
import useDocumentService from "~/core/services/documentService";
import type { IBerthDocumentList } from "~/core/interfaces/IBerthDocumentList";
import { BerthType, PurposeType } from "~/core/utils/enum";

const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore()
const documentService = useDocumentService()
const isAllowPassenger = ref(false)

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
    confirmAddDockingVessel: {
        type: Function as PropType<(...args: any[]) => void>,
        required: true,
    },
    documentId: {
        type: Number,
        required: true,
    },
    berths: {
        type: Array<IBerthDocumentList>,
        default: []
    },
    berthId: {
        type: Number,
        default: 0
    },
    berthType: {
        type: String,
        default: ""
    }
});

const errors = ref<FormError[]>([]);

const validate = (field: string, valueSelected: any = 0) => {
    const validationErrors: FormError[] = [];

    // Helper function to check if the time is after 00:00 based on a date string in ISO format
    const isTimeAfterMidnight = (isoDateString: string) => {
        if (!isoDateString) return false;
        const date = new Date(isoDateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours > 0 || (hours === 0 && minutes > 0);
    };
    // Berth ID validation
    if (field === 'berthId') {
        formGroup.berthId = valueSelected || formGroup.berthId
        if (!formGroup.berthId || formGroup.berthId < 1) {
            validationErrors.push({ path: 'berthId', message: t('please_enter_a_value') });
        }
    }

    // Purpose Type ID validation
    if (field === 'purposeTypeId') {
        formGroup.purposeTypeId = valueSelected || formGroup.purposeTypeId
        if (!formGroup.purposeTypeId || formGroup.purposeTypeId < 1) {
            validationErrors.push({ path: 'purposeTypeId', message: t('please_enter_a_value') });
        }
    }

    // Purpose ID validation
    if (field === 'purposeId') {
        formGroup.purposeId = valueSelected || formGroup.purposeId
        if (!formGroup.purposeId || formGroup.purposeId < 1) {
            validationErrors.push({ path: 'purposeId', message: t('please_enter_a_value') });
        }
    }

    // Cargo Type ID validation
    if (field === 'cargoTypeId') {
        formGroup.cargoTypeId = valueSelected || formGroup.cargoTypeId
        if (!formGroup.cargoTypeId || formGroup.cargoTypeId < 1) {
            validationErrors.push({ path: 'cargoTypeId', message: t('please_enter_a_value') });
        }
    }

    // Passengers validation (optional)
    if (field === 'passengers') {
        if ((!formGroup.passengers || formGroup.passengers < 1) && isAllowPassenger.value) {
            validationErrors.push({ path: 'passengers', message: t('please_enter_a_value') });
        }
    }

    // Estimated Arrival validation
    if (field === 'estimatedArrival') {
        if (!formGroup.estimatedArrival) {
            validationErrors.push({ path: 'estimatedArrival', message: t('please_enter_a_value') });
        } else if (!isTimeAfterMidnight(formGroup.estimatedArrival)) {
            validationErrors.push({ path: 'estimatedArrival', message: t('ไม่สามารถกรอกเวลา 00.00 ได้') });
        }
    }

    // Estimated Departure validation
    if (field === 'estimatedDeparture') {
        if (!formGroup.estimatedDeparture) {
            validationErrors.push({ path: 'estimatedDeparture', message: t('please_enter_a_value') });
        } else if (!isTimeAfterMidnight(formGroup.estimatedDeparture)) {
            validationErrors.push({ path: 'estimatedDeparture', message: t('ไม่สามารถกรอกเวลา 00.00 ได้') });
        } else if (!isDate1BeforeDate2(formGroup.estimatedArrival, formGroup.estimatedDeparture)) {
            validationErrors.push({ path: 'estimatedDeparture', message: t('วันที่คาดว่าเรือออกต้องมากกว่าวันที่คาดว่าเรือเข้า') });
        }
    }

    // Note validation (optional)
    if (field === 'note' && formGroup.note !== undefined && !formGroup.note.trim()) {
        validationErrors.push({ path: 'note', message: t('please_enter_a_value') });
    }


    // Clear previous errors for the specific field and add the new error if any
    errors.value = errors.value.filter(err => err.path !== field);
    if (validationErrors.length) {
        errors.value.push(...validationErrors);
    }
};

const getError = (field: string) => {
    const error = errors.value.find(err => err.path === field);
    return error ? error.message : null;
};

const arrivalDate = ref<any>(new Date())
const departureDate = ref<any>(new Date())

const berthId = computed(() => props.berthId)
const documentId = computed(() => props.documentId)

const formGroup = reactive<any>({
    berthId: 0,
    purposeTypeId: 0,
    purposeId: 0,
    cargoTypeId: 0,
    passengers: 0,
    estimatedArrival: '',
    estimatedDeparture: '',
    note: '',
    berthType: props.berthType,
})

const payload = ref<IBerthsDocumentRequest>({
    berthId: 0,
    berthType: "",
    purposeTypeId: 0,
    purposeId: 0,
    cargoTypeId: 0,
    passengers: 0,
    estimatedArrival: "",
    estimatedDeparture: "",
    note: "",
    sequence: 0
})

onMounted(() => {
    documentOptionsStore.getBerthsOptions()
    documentOptionsStore.getPurposeTypeOptions()
    documentOptionsStore.getPurposesOptions()
    documentOptionsStore.getCargoTypesOptions()
    if (berthId.value && documentId.value) {
        getDocumentBerthDetail(documentId.value, berthId.value)
    } else {
        resetFormGroup()
    }
});

const handleSelectBerth = (value: any) => {

    const berth: any = documentOptionsStore.berthsOption.find((e: any) => e.id === value)
    const purpose: any = documentOptionsStore.purposesOptions.find((e: any) => e.id === formGroup.purposeId)

    if (purpose && purpose.purposeType != PurposeType.Passenger) {
        isAllowPassenger.value = false;
    } else {
        isAllowPassenger.value = true;
    }

    validate('berthId', value)
    if (!isAllowPassenger.value) {
        validate('passengers')
    }
}

const handleSelectBerthType = (berthType: any) => {

    const purpose: any = documentOptionsStore.purposesOptions.find((e: any) => e.id === formGroup.purposeId)

    if (purpose && purpose.purposeType != PurposeType.Passenger) {
        isAllowPassenger.value = false;
    } else {
        isAllowPassenger.value = true;
    }

}

const handleSelectPurposeType = (value: any) => {

    const berth: any = documentOptionsStore.berthsOption.find((e: any) => e.id === formGroup.berthId)

    const purposeType: any = documentOptionsStore.purposeTypeOptions.find((e: any) => e.id === value)
    if (purposeType) {
        documentOptionsStore.getPurposesOptionsByType(purposeType.id);
        isAllowPassenger.value = purposeType.name == 'Passenger'

        if (documentOptionsStore.filteredPurposesOptions.length == 1)
            formGroup.purposeId = documentOptionsStore.filteredPurposesOptions[0].id

    }

    validate('purposeTypeId', value)
    if (!isAllowPassenger.value) {
        validate('passengers')
    }
}

const handleSelectPurpose = (value: any) => {
    // const findData: any = documentOptionsStore.filteredPurposesOptions.find((e: any) => e.id === value)
    // if (findData) {
    //     isAllowPassenger.value = ['Passenger'].includes(findData.purposeType)
    // }
    // validate('purposeId', value)
    // if (!isAllowPassenger.value) {
    //     validate('passengers')
    // }
}

const getDocumentBerthDetail = async (documentId: number, berthId: number) => {

    const resp = await documentService.getDocumentBerthDetail(documentId, berthId)
    if (resp.statusCode === 200) {
        formGroup.berthId = resp.data.berthId
        formGroup.purposeTypeId = resp.data.purposeTypeId
        formGroup.purposeId = resp.data.purposeId
        formGroup.cargoTypeId = resp.data.cargoTypeId
        formGroup.passengers = resp.data.passengers
        formGroup.estimatedArrival = resp.data.estimatedArrival
        formGroup.estimatedDeparture = resp.data.estimatedDeparture
        formGroup.note = resp.data.note
        arrivalDate.value = resp.data.estimatedArrival ? new Date(resp.data.estimatedArrival) : new Date()
        departureDate.value = resp.data.estimatedDeparture ? new Date(resp.data.estimatedDeparture) : new Date()
        handleSelectPurposeType(resp.data.purposeTypeId)
    }
}

const resetFormGroup = () => {
    formGroup.berthId = 0
    formGroup.purposeTypeId = 0
    formGroup.purposeId = 0
    formGroup.cargoTypeId = 0
    formGroup.passengers = 0
    formGroup.estimatedArrival = ''
    formGroup.estimatedDeparture = ''
    formGroup.note = ''
}

const handleDialogCancel = () => {
    props.dialogCancel()
    resetFormGroup()
}

async function onSubmit(event: FormSubmitEvent<z.output<any>>) {
    const fieldsToValidate = [
        'berthId',
        'purposeTypeId', 'purposeId',
        'cargoTypeId', 'passengers',
        'estimatedArrival', 'estimatedDeparture',
    ];

    fieldsToValidate.forEach(field => {
        validate(field);
    });
    if (errors.value.length === 0) {
        const newPayload: IBerthsDocumentRequest = {
            ...payload.value,
            ...event.data,
            // sequence checking logic by item length of berths
            sequence: props.berths.length > 0 ? props.berths.length + 1 : 1
        }
        payload.value = newPayload
        if (berthId.value && documentId.value) {
            const resp = await documentService.updateDocumentBerthDetail(documentId.value, berthId.value, payload.value)
            if (resp.statusCode === 200) {
                props.confirmAddDockingVessel(true)
            } else {
                props.confirmAddDockingVessel(false)
            }
        } else {
            const resp = await documentService.addDocumentBerths(documentId.value, payload.value)
            if (resp.statusCode === 200) {
                props.confirmAddDockingVessel(true)
            } else {
                props.confirmAddDockingVessel(false)
            }
        }
    }
}

const onArrivalDateChange = (newDate: any) => {
    formGroup.estimatedArrival = newDate ? new Date(newDate).toISOString() : '';
    validate('estimatedArrival')
    if (formGroup.estimatedDeparture) {
        validate('estimatedDeparture')
    }
}

const onDepartureDateChange = (newDate: any) => {
    formGroup.estimatedDeparture = newDate ? new Date(newDate).toISOString() : '';
    validate('estimatedDeparture')
}

watch(
    () => props.isDialogOpen,
    (isOpen) => {
        if (isOpen) {
            if (isOpen && berthId.value) {
                getDocumentBerthDetail(documentId.value, berthId.value)
            } else {
                resetFormGroup()
            }
        }
    }
);

watch(
    () => props.berthType,
    (value) => {
        formGroup.berthType = value;
        handleSelectBerthType(value)
    }
);

watch(
    () => isAllowPassenger.value,
    (value) => {
        if (!value) {
            formGroup.passengers = 0
        }
    }
);

</script>
