<template>
    <h2 class="font-semibold text-grayy-400 mb-3">ตรวจสอบข้อมูลคำร้อง</h2>
    <UDivider class="my-4" />
    <div class="border border-grayy-100 p-8 rounded-xl mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <UInputMenu is-view custom-icon="search" label="เจ้าของเรือ" name="owner"
                    v-model="documentData.vessel.vesselOwner" placeholder="ค้นหา" />
            </div>
            <div>
                <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId">
                    <div class="flex items-center">
                        <UAvatar size="xs" :src="documentData.vessel.vesselFlagPath" alt="Avatar" />
                        <p class="ml-3.5 text-grayy-75">{{ documentData.vessel.vesselFlagName }}</p>
                    </div>
                </UFormGroup>
            </div>
            <div>
                <UInput is-view label="ชื่อเรือ" placeholder="ชื่อเรือ" name="name"
                    v-model="documentData.vessel.vesselName" />
            </div>
            <div>
                <USelect is-view label="ประเภทเรือ" placeholder="ประเภทเรือ" name="vesselTypeId"
                    v-model="documentData.vessel.vesselTypeId" :options="vesselOptionsStore.vesselTypeOption" />
            </div>
            <div>
                <UInput is-view label="หมายเลข IMO" placeholder="หมายเลข IMO" name="imoNumber"
                    v-model="documentData.vessel.vesselImoNumber" />
            </div>
            <div>
                <UInput is-view label="หมายเลข MMSI" placeholder="หมายเลข MMSI" name="mmsiNumber" required
                    v-model="documentData.vessel.vesselMMSiNumber" />
            </div>
            <div>
                <UInput is-view label="หมายเลขทะเบียนเรือ" placeholder="หมายเลขทะเบียนเรือ" name="officialNumber"
                    required v-model="documentData.vessel.vesselOfficialNumber" />
            </div>
            <div>
                <UInput is-view label="สัญญาณเรียกขาน" placeholder="สัญญาณเรียกขาน" name="callSign" required
                    v-model="documentData.vessel.vesselCallSign" />
            </div>
        </div>
        <UDivider class="my-4" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <UInput is-view label="น้ำหนักบรรทุก" placeholder="น้ำหนักบรรทุก" name="loadWeight" required
                    v-model="documentData.vessel.vesselLoadWeight" type="number" suffix="t" />
            </div>
            <div>
                <UInput is-view label="Gross Tonnage" placeholder="Gross Tonnage" name="grossTonnage" required
                    v-model="documentData.vessel.vesselGrossTonnage" type="number" suffix="t" />
            </div>
            <div>
                <UInput is-view label="Net Tonnage" placeholder="Net Tonnage" name="netTonnage" required
                    v-model="documentData.vessel.vesselNetTonnage" type="number" suffix="t" />
            </div>
            <div>
                <UInput is-view label="ความยาว" placeholder="ความยาว" name="lengthOverall" required
                    v-model="documentData.vessel.vesselLengthOverall" type="number" suffix="m" />
            </div>
            <div>
                <UInput is-view label="ความกว้าง" placeholder="ความกว้าง" name="breadthExtreme" required
                    v-model="documentData.vessel.vesselBreadthExtreme" type="number" suffix="m" />
            </div>
            <div>
                <UInput is-view label="กินน้ำลึก" placeholder="กินน้ำลึก" name="depth" required
                    v-model="documentData.vessel.vesselDepth" type="number" suffix="m" />
            </div>
            <div>
                <UInput is-view label="เครื่องจักรใหญ่" placeholder="เครื่องจักรใหญ่" name="mainEngine"
                    v-model="documentData.vessel.vesselMainEngine" />
            </div>
            <div>
                <UInput is-view label="ยี่ห้อและรุ่น" placeholder="ยี่ห้อและรุ่น" name="bandAndModel"
                    v-model="documentData.vessel.vesselBandAndModel" />
            </div>
        </div>
        <UDivider class="my-4" />
        <div id="containerUpload">
            <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบ</h2>
            <FileDropzone v-if="documentData.vessel.vesselUploadFiles.length > 0" is-view
                :filesValue="documentData.vessel.vesselUploadFiles" />
            <div v-else>-</div>
        </div>
    </div>

    <div class="border border-grayy-100 p-8 rounded-xl mt-6">
        <h2 class="font-semibold text-grayy-400 mb-3">วันและเวลาที่คาดว่าเรือเข้า-ออก</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <UInput :label="$t('estimated_vessel_arrival_date')"
                    :value="`${documentData?.estimatedArrival ? format(new Date(documentData?.estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`"
                    is-view />
            </div>
            <div>
                <UInput :label="$t('estimated_vessel_arrival_date')" custom-icon="calendar"
                    :value="`${documentData?.estimatedDeparture ? format(new Date(documentData?.estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`"
                    is-view />
            </div>
        </div>
        <UDivider class="my-4" />
        <div v-if="berths.length > 0" v-for="(data, index) in berths" :key="index" class="my-6 text-left">
            <div class="flex justify-between">
                <h2 class="font-semibold text-grayy-400 mb-3">{{ $t('docking_vessel') }} {{ index + 1 }}</h2>
            </div>
            <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <USelect :label="$t('docking_vessel')" :placeholder="$t('docking_vessel')" is-view
                        :options="documentOptionsStore.berthsOption" v-model="data.berthId" />
                </div>
                <div>
                    <USelect :label="$t('purpose_type_of_docking')" :placeholder="$t('purpose_type_of_docking')"
                        name="purposeTypeId" v-model="data.purposeTypeId" is-view
                        :options="documentOptionsStore.purposeTypeOptions" />
                </div>
                <div>
                    <USelect :label="$t('purpose_of_docking')" :placeholder="$t('purpose_of_docking')"
                        name="purposeDocking" is-view :options="documentOptionsStore.filteredPurposesOptions"
                        v-model="data.purposeId" />
                </div>
                <div>
                    <USelect :label="$t('cargo_type')" :placeholder="$t('cargo_type')" is-view
                        :options="documentOptionsStore.cargoTypesOptions" v-model="data.cargoTypeId" />
                </div>
                <div>
                    <UInput :label="$t('number_passengers')" :placeholder="$t('number_passengers')" is-view
                        v-model="data.passengers" />
                </div>
                <div>
                    <UInput :label="$t('estimated_vessel_arrival_date')"
                        :value="`${data.estimatedArrival ? format(new Date(data.estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`"
                        is-view />
                </div>
                <div>
                    <UInput :label="$t('estimated_vessel_arrival_date')" custom-icon="calendar"
                        :value="`${data.estimatedDeparture ? format(new Date(data.estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`"
                        is-view />
                </div>
                <div class="md:col-span-2">
                    <UTextarea :label="$t('detail')" :placeholder="$t('detail')" is-view v-model="data.note" />
                </div>
            </div>
            <div v-if="isCheckingEnabledAction(data.purposeTypeId)">
                <UDivider class="my-4" />
                <div class="flex justify-between">
                    <h2 class="font-semibold text-grayy-400 mb-3">{{ $t('รายการสินค้า') }}</h2>
                </div>
                <UTable :columns="columnsTable" :rows="data.products" class="" :ui="{
                    wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                    thead: 'bg-primary-50',
                    tbody: 'border-none'
                }">
                    <template #id-data="{ index }">
                        <div class="text-center">
                            {{ index + 1 }}
                        </div>
                    </template>
                    <template #purposeId-data="{ row }">
                        <div class="text-center">
                            {{ renderPurpose(row.purposeId) }}
                        </div>
                    </template>
                    <template #productTypeId-data="{ row }">
                        <div class="text-center">
                            {{ renderProductType(row.productTypeId) }}
                        </div>
                    </template>
                    <template #cargoWharfageId-data="{ row }">
                        <div class="text-center">
                            {{ renderCargoWharfage(row.cargoWharfageId) }}
                        </div>
                    </template>
                    <template #mTonQty-data="{ row }">
                        <div class="text-center">
                            {{ formatNumber(row.mTonQty) }} M/Ton
                        </div>
                    </template>
                    <template #rTonQty-data="{ row }">
                        <div class="text-center">
                            {{ formatNumber(row.rTonQty) }} R/Ton
                        </div>
                    </template>
                </UTable>
                <div class="grid grid-cols-1 md:grid-cols-2 mt-6">
                    <div>
                        <p>ปริมาณสินค้า M/Ton รวม</p>
                        <p class="text-grayy-75">{{ calculateMton(data.products) }} M/Ton</p>
                    </div>
                    <div>
                        <p>ปริมาณสินค้า R/Ton รวม</p>
                        <p class="text-grayy-75">{{ calculateRton(data.products) }} R/Ton</p>
                    </div>
                </div>
            </div>
            <UDivider class="my-4" />
            <div v-if="isOtherPurpose(data.purposeTypeId) || data.products.length === 0">
                <h2 class="font-semibold text-grayy-400">นำเข้าเอกสารหนังสือขออนุญาติเรือกิจกรรมอื่น</h2>
                <span class="text-grayy-500 my-2">
                    กรณีเป็นเรือกิจกรรมอื่น จะต้องนำส่งหนังสือขออนุญาติเรือกิจกรรมอื่น และเลือกวัตถุประสงค์เทียบท่าเป็น
                    Other
                </span>
            </div>
            <div v-else>
                <h2 class="font-semibold text-grayy-400">นำเข้าเอกสาร Cargo Manifest</h2>
                <ul class="list-decimal pl-6 space-y-0.5 text-grayy-500 my-2">
                    <li>เอกสาร Cargo Manifest ต้องมีตราประทับและลายเซ็นต์</li>
                    <li>เรือ Discharge ต้องส่งเอกสารก่อนหรือพร้อมกับเรือเข้าเทียบท่า</li>
                </ul>
            </div>
            <FileDropzone class="mt-4" upload-type="vessel" is-view :filesValue="data.files" />
        </div>
    </div>

    <div class="border border-grayy-100 p-8 rounded-xl mt-6">
        <h2 class="font-semibold text-grayy-400 mb-3">ที่อยู่ใบแจ้งหนี้</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UInput v-model="formInvoiceGroup.name" :label="$t('ชื่อลูกค้า/บริษัท')"
                :placeholder="$t('ชื่อลูกค้า/บริษัท')" is-view />
            <UInput v-model="formInvoiceGroup.taxId" :label="$t('taxpayer_identification_no')"
                :placeholder="$t('taxpayer_identification_no')" is-view />
            <UInput v-model="formInvoiceGroup.contactName" :label="$t('ชื่อผู้ติดต่อ')"
                :placeholder="$t('ชื่อผู้ติดต่อ')" is-view />
            <USelect v-model="formInvoiceGroup.paymentMethodId" :label="$t('วิธีการชำระเงิน')"
                :placeholder="$t('วิธีการชำระเงิน')" is-view :options="documentOptionsStore.paymentMethodOptions" />
            <USelect v-model="formInvoiceGroup.paymentTermId" :label="$t('เงื่อนไขการชำระเงิน')"
                :placeholder="$t('เงื่อนไขการชำระเงิน')" is-view :options="documentOptionsStore.paymentTermsOptions" />
            <UInput v-model="formInvoiceGroup.address" :label="$t('ที่อยู่')" :placeholder="$t('ที่อยู่')" is-view />
        </div>
    </div>
</template>


<script setup lang="ts">
import UInputMenu from '../form/u-input-menu.vue';
import USelect from '../form/u-select.vue';
import UInput from '../form/u-input.vue';
import FileDropzone from '../form/fileDropzone.vue';
import { format } from 'date-fns';
import type { IBerthDocumentList } from '~/core/interfaces/IBerthDocumentList';
import UTextarea from '../form/u-textarea.vue';
import { PurposeType } from '~/core/utils/enum';
import type { IDocumentData } from '~/core/interfaces/IDocumentData';
const { t } = useI18n();
const props = defineProps({
    formVesselGroup: {
        type: Object,
        required: true
    },
    vesselFilesUpload: {
        type: Array,
        required: true
    },
    berths: {
        type: Array<IBerthDocumentList>,
        default: []
    },
    formInvoiceGroup: {
        type: Object,
        required: true
    },
    documentData: {
        type: Object as PropType<IDocumentData>,
        required: true
    }
});
const vesselOptionsStore = useVesselOptionsStore()
const documentOptionsStore = useDocumentOptionsStore()
const vesselFlagData = ref({
    avatar: '',
    flagName: ''
})

onMounted(async () => {
    await vesselOptionsStore.getVesselTypeOption()
    await vesselOptionsStore.getVesselFlagOption()
    documentOptionsStore.getBerthsOptions()
    documentOptionsStore.getPurposesOptions()
    documentOptionsStore.getCargoTypesOptions()
});

const columnsTable = [
    {
        key: "id",
        label: t("order"),
        class: "w-[60px] text-center",
    },
    {
        key: "purposeId",
        label: t("วัตถุประสงค์"),
        class: "text-center",
    },
    {
        key: "cargoWharfageId",
        label: t("รูปแบบสินค้า"),
    },
    {
        key: "productTypeId",
        label: t("ชนิดสินค้า"),
    },
    {
        key: "mTonQty",
        label: t("ปริมาณ M/Ton"),
    },
    {
        key: "rTonQty",
        label: t("ปริมาณ R/Ton"),
    },
    {
        key: "packageAmount",
        label: t("แพ็กเกจ"),
    },
    {
        key: "receiver",
        label: t("cargo_owner"),
    },
    {
        key: "actions",
        sortable: false,
    },
];

const renderPurpose = (id: number) => {
    const findData: any = documentOptionsStore.purposesOptions.find((e: any) => e.id === id);
    if (findData) {
        return findData.name;
    }
    return "-";
};

const renderProductType = (id: number) => {
    const findData: any = documentOptionsStore.productGroupsOptions.find((e: any) => e.id === id);
    if (findData) {
        return findData.name;
    }
    return "-";
};

const renderCargoWharfage = (id: number) => {
    const findData: any = documentOptionsStore.cargoWharfageOptions.find((e: any) => e.id === id);
    if (findData) {
        return findData.name;
    }
    return "-";
};

const isOtherPurpose = (purposeTypeId: number) => {
    const findPurpose: any = documentOptionsStore.purposeTypeOptions.find((e: any) => e.id === purposeTypeId)
    if (findPurpose) {
        if ([PurposeType.Other, PurposeType.Passenger, PurposeType.SparePart].includes(findPurpose.name)) {
            return true
        }
        return false
    }
    return false
}

const isCheckingEnabledAction = (
    purposeTypeId: number,
) => {
    const findPurpose: any = documentOptionsStore.purposeTypeOptions.find((e: any) => e.id === purposeTypeId)
    if (findPurpose) {
        if ([PurposeType.Loading, PurposeType.Discharge, PurposeType.DischargeLoading].includes(findPurpose.type)) {
            return true
        } else {
            return false
        }
    }
    return false
}

const calculateMton = (products: any) => {
    const total = products.reduce(
        (accumulator: any, currentValue: any) => accumulator += currentValue.mTonQty,
        0,
    );
    return formatNumber(total)
}

const calculateRton = (products: any) => {
    const total = products.reduce(
        (accumulator: any, currentValue: any) => accumulator += currentValue.rTonQty,
        0,
    );
    return formatNumber(total)
}

watch(
    () => props.documentData.vessel.vesselFlagId,
    (value) => {
        if (value) {
            const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value)
            if (findVesselFlag) {
                vesselFlagData.value.avatar = findVesselFlag.path
                vesselFlagData.value.flagName = findVesselFlag.name
            }
        }
    }
);

</script>
