<template>
    <div class="px-4">
        <h2 class="font-semibold text-grayy-400 mb-3">{{ $t('docking_vessel_detail') }}</h2>
        <UDivider class="my-4" />
    </div>
    <div class="container mx-auto px-4 text-center">
        <div v-if="berths.length > 0" v-for="(data, index) in berths"
            class="border border-grayy-100 p-4 md:p-8 rounded-xl my-6 text-left">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 class="font-semibold text-grayy-400 mb-3">
                    {{ $t('docking_vessel') }} {{ index + 1 }}
                </h2>
                <div class="flex items-center">
                    <UButton @click="() => handleClickEditBerth(index)"
                        class="mx-1 bg-purple-25 font-bold text-primaryy-500 hover:bg-purple-50"
                        icon="i-heroicons-pencil-square" size="md" :label="$t('edit')" />
                    <UButton @click="() => handleClickDeleteBerth(index)"
                        class="ml-1 bg-[#FBD0CD] text-error-500 hover:bg-[#F7A29B]" icon="i-heroicons-x-circle"
                        size="md" :label="$t('delete')" />
                </div>
            </div>
            <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-span-1 md:col-span-2">
                    <USelect :label="$t('docking_vessel')" :placeholder="$t('docking_vessel')" is-view
                        :options="documentOptionsStore.berthsOption" v-model="data.berthId" />
                </div>
                <div class="col-span-1">
                    <USelect :label="$t('purpose_type_of_docking')" :placeholder="$t('purpose_type_of_docking')"
                        name="purposeTypeId" v-model="data.purposeTypeId" is-view
                        :options="documentOptionsStore.purposeTypeOptions" />
                </div>
                <div class="col-span-1">
                    <USelect :label="$t('purpose_of_docking')" :placeholder="$t('purpose_of_docking')"
                        name="purposeDocking" is-view :options="documentOptionsStore.purposesOptions"
                        v-model="data.purposeId" />
                </div>
                <div class="col-span-1">
                    <USelect :label="$t('cargo_type')" :placeholder="$t('cargo_type')" is-view
                        :options="documentOptionsStore.cargoTypesOptions" v-model="data.cargoTypeId" />
                </div>
                <div class="col-span-1">
                    <UInput :label="$t('number_passengers')" :placeholder="$t('number_passengers')" is-view
                        v-model="data.passengers" />
                </div>
                <div class="col-span-1">
                    <UInput :label="$t('estimated_vessel_arrival_date')"
                        :value="`${data.estimatedArrival ? format(new Date(data.estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`"
                        is-view />
                </div>
                <div class="col-span-1">
                    <UInput :label="$t('estimated_vessel_departure_date')" custom-icon="calendar"
                        :value="`${data.estimatedDeparture ? format(new Date(data.estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`"
                        is-view />
                </div>
                <div class="col-span-1 md:col-span-2">
                    <UTextarea :label="$t('detail')" :placeholder="$t('detail')" is-view v-model="data.note" />
                </div>
            </div>
            <div v-if="isCheckingEnabledAction(data.purposeTypeId)">
                <UDivider class="my-4" />
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <h2 class="font-semibold text-grayy-400 mb-3">
                        {{ $t('รายการสินค้า') }}
                    </h2>
                    <UButton @click="() => handleClickAddProduct(index)" icon="i-heroicons-plus-circle" size="md"
                        :label="$t('เพิ่มสินค้า')" />
                </div>
                <UTable :columns="columnsTable" :rows="data.products" :ui="{
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
                            {{ formatNumber(row.mTonQty, 3) }} M/Ton
                        </div>
                    </template>
                    <template #rTonQty-data="{ row }">
                        <div class="text-center">
                            {{ formatNumber(row.rTonQty, 3) }} R/Ton
                        </div>
                    </template>
                    <template #actions-data="{ row }">
                        <div class="text-right">
                            <ActionMenuTable :items="getMenuTable(index, row)" />
                        </div>
                    </template>
                </UTable>
                <div class="grid grid-cols-1 md:grid-cols-2 mt-6">
                    <div>
                        <p>ปริมาณสินค้า M/Ton รวม</p>
                        <p class="text-grayy-75">
                            {{ calculateMton(data.products) }} M/Ton
                        </p>
                    </div>
                    <div>
                        <p>ปริมาณสินค้า R/Ton รวม</p>
                        <p class="text-grayy-75">
                            {{ calculateRton(data.products) }} R/Ton
                        </p>
                    </div>
                </div>
            </div>
            <UDivider class="my-4" />
            <div v-if="isOtherPurpose(data.purposeTypeId) || data.products.length === 0">
                <h2 class="font-semibold text-grayy-400">
                    นำเข้าเอกสารหนังสือขออนุญาติเรือกิจกรรมอื่น
                </h2>
                <span class="text-grayy-500 my-2">
                    กรณีเป็นเรือกิจกรรมอื่น จะต้องนำส่งหนังสือขออนุญาติเรือกิจกรรมอื่น
                    และเลือกวัตถุประสงค์เทียบท่าเป็น Other
                </span>
            </div>
            <div v-else>
                <h2 class="font-semibold text-grayy-400">
                    นำเข้าเอกสาร Cargo Manifest
                </h2>
                <ul class="list-decimal pl-6 space-y-0.5 text-grayy-500 my-2">
                    <li>เอกสาร Cargo Manifest ต้องมีตราประทับและลายเซ็นต์</li>
                    <li>เรือ Discharge ต้องส่งเอกสารก่อนหรือพร้อมกับเรือเข้าเทียบท่า</li>
                </ul>
            </div>
            <FileBerthDropzone class="mt-4"
                :error="data.files.length > 0 && isErrorBerthFile(data.id) ? '' : isErrorBerthFile(data.id)"
                :getFiles="(value: any) => setFileToBerth(value, index)" :filesValue="data.files"
                :errorFromUpload="(message: string) => errorFileMessage = message" :documentId="documentId"
                :berthId="data.id" :file-type="isOtherPurpose(data.purposeId) ? 'other' : 'manifest'"
                :onDeleteFileBerthSuccess="onDeleteFileBerthSuccess" :maximum-file-limit="1" />
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center">
                    <NuxtIcon v-if="data.files.length === 0 && isErrorBerthFile(data.id)" name="exclamation"
                        color="text-error-500" />
                    <span v-if="data.files.length === 0 && isErrorBerthFile(data.id)" class="text-red-500 ml-2 my-3">
                        กรุณานำส่งเอกสาร
                    </span>
                </div>
                <span class="text-grayy-500 mr-2 my-3">
                    รองรับสกุลไฟล์ .pdf และอัพโหลดได้สูงสุด 1 ไฟล์
                </span>
            </div>
        </div>

        <h2 class="font-semibold font-anuphan-medium">
            {{ $t('add_docking_vessel_detail') }}
        </h2>
        <p class="mb-3 text-grayy-75 text-sm">
            {{ $t('add_docking_vessel_shifting_description') }}
        </p>
        <UButton @click="handleOpenAddDockingVessel" icon="i-heroicons-plus-circle" size="md"
            :label="$t('add_docking_vessel')" />
    </div>

    <DockingVesselDialog :is-dialog-open="isConfirmDialogOpen" :dialogCancel="dialogCancel" :berths="berths"
        :documentId="documentId" :confirmAddDockingVessel="confirmAddDockingVessel" :berthId="berthId"
        :berthType="berthType" />

    <ProductFormDialog :is-dialog-open="isConfirmProductDialogOpen" :dialogCancel="dialogProductCancel" :berths="berths"
        :documentId="documentId" :confirmAddProduct="confirmAddProduct" :berthId="berthId" :berthType="berthType"
        :productId="productId" :purposeId="purposeId" :berthIdOptionProduct="berthIdOptionProduct"
        :requiredRTon="requiredRTon" :receiver="receiver" :cargoOwnerId="cargoOwnerId" :purposeTypeId="purposeTypeId" />

    <DialogConfirm :title="$t('ลบท่าเทียบเรือ')" :desc="$t('คุณต้องการลบท่าเทียบเรือหรือไม่')" icon="warning"
        :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmDeleteBerthDialogOpen"
        :dialogCancel="() => isConfirmDeleteBerthDialogOpen = false" :dialogConfirm="handleConfirmDeleteBerth" />
</template>


<script setup lang="ts">
import { format } from 'date-fns';
import DockingVesselDialog from '../dialog/request-form/docking-vessel-dialog.vue';
import UInput from '../form/u-input.vue';
import USelect from '../form/u-select.vue';
import UTextarea from '../form/u-textarea.vue';
import ActionMenuTable from '../ui/actionMenuTable.vue';
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import type { IBerthDocumentList } from '~/core/interfaces/IBerthDocumentList';
import ProductFormDialog from '../dialog/request-form/product-form-dialog.vue';
import type { IProductDocumentData } from '~/core/interfaces/IProductDocumentData';
import useDocumentService from '~/core/services/documentService';
import FileBerthDropzone from '../form/fileBerthDropzone.vue';
import DialogConfirm from "~/components/dialog/confirm.vue";
import NuxtIcon from '../ui/nuxtIcon.vue';
import { BerthType, PurposeType } from '~/core/utils/enum';

const props = defineProps({
    documentId: {
        type: Number,
        default: 0
    },
    confirmAddDockingVessel: {
        type: Function,
        default: () => { }
    },
    confirmAddProduct: {
        type: Function,
        default: () => { }
    },
    confirmDeleteProduct: {
        type: Function,
        default: () => { }
    },
    confirmDeleteBerth: {
        type: Function,
        default: () => { }
    },
    confirmUploadBerthFile: {
        type: Function,
        default: () => { }
    },
    berths: {
        type: Array<IBerthDocumentList>,
        default: []
    },
    onDeleteFileBerthSuccess: {
        type: Function,
        default: () => { }
    },
    berthsErrors: {
        type: Array,
        default: []
    }
});
const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore()
const documentService = useDocumentService()

const isConfirmDialogOpen = ref(false)
const isConfirmProductDialogOpen = ref(false)
const isConfirmDeleteBerthDialogOpen = ref(false)
const requiredRTon = ref(false)
const errorFileMessage = ref('')
const berthId = ref()
const berthType = ref()
const berthIdOptionProduct = ref()
const documentId = ref(props.documentId)
const productId = ref()
const purposeId = ref()
const purposeTypeId = ref()
const cargoOwnerId = ref()
const receiver = ref()

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

const isErrorBerthFile = (id: number) => {
    const findIndex = props.berthsErrors.findIndex((e: any) => e.id === id)
    if (findIndex !== -1) {
        return 'true'
    }
    return ''
}

const renderPurpose = (id: number) => {
    const findData: any = documentOptionsStore.purposesOptions.find((e: any) => e.id === id);
    if (findData) {
        return findData.name;
    }
    return "-";
};

const renderProductType = (id: number) => {
    const findData: any = documentOptionsStore.productTypesOptions.find((e: any) => e.id === id);
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
const setFileToBerth = (value: any, index: number) => {
    props.berths[index].files = value
    props.confirmUploadBerthFile(true)
}

const calculateMton = (products: any) => {
    const total = products.reduce(
        (accumulator: any, currentValue: any) => accumulator += currentValue.mTonQty,
        0,
    );
    return formatNumber(total, 3)
}

const calculateRton = (products: any) => {
    const total = products.reduce(
        (accumulator: any, currentValue: any) => accumulator += currentValue.rTonQty,
        0,
    );
    return formatNumber(total, 3)
}


const getMenuTable = (index: number, row: IProductDocumentData) => {
    const items = [
        [

            {
                label: t('edit'),
                avatar: {
                    src: EditIcon,
                },
                click: () => {
                    handleClickEditProduct(index, row)
                },
            },
            {
                label: t('delete'),
                avatar: {
                    src: DeleteIcon,
                },
                click: () => {
                    handleClickDeleteProduct(index, row)
                },
            },
        ],
    ];
    return items;

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

const isRequiredRTon = (berth: any) => {
    return [BerthType.MIT, BerthType.TCT].includes(berth.berthType)
}

const handleClickEditBerth = (index: number) => {
    isConfirmDialogOpen.value = true
    berthId.value = props.berths[index].id
    documentId.value = props.documentId
    berthType.value = props.berths[index].berthType
}

const handleClickDeleteBerth = async (index: number) => {
    isConfirmDeleteBerthDialogOpen.value = true
    berthId.value = props.berths[index].id
    documentId.value = props.documentId
}

const handleConfirmDeleteBerth = async () => {
    const resp = await documentService.deleteDocumentBerth(documentId.value, berthId.value)
    if (resp.statusCode === 200) {
        props.confirmDeleteBerth(true)
    } else {
        props.confirmDeleteBerth(false)
    }
    isConfirmDeleteBerthDialogOpen.value = false
}

const handleClickAddProduct = (index: number) => {
    const berth = props.berths[index];

    isConfirmProductDialogOpen.value = true
    productId.value = 0
    berthId.value = berth.id
    documentId.value = props.documentId
    purposeId.value = berth.purposeId
    purposeTypeId.value = berth.purposeTypeId
    berthIdOptionProduct.value = berth.berthId
    berthType.value = berth.berthType;
    requiredRTon.value = isRequiredRTon(berth);
}

const handleClickEditProduct = (index: number, row: IProductDocumentData) => {
    const berth = props.berths[index];

    isConfirmProductDialogOpen.value = true
    berthId.value = berth.id
    documentId.value = props.documentId
    productId.value = row.id
    purposeId.value = berth.purposeId
    berthIdOptionProduct.value = berth.berthId
    berthType.value = berth.berthType
    requiredRTon.value = isRequiredRTon(berth);
    cargoOwnerId.value = row.cargoOwnerId
    receiver.value = row.receiver
}

const handleClickDeleteProduct = async (index: number, row: IProductDocumentData) => {
    console.log('row', row)
    berthId.value = props.berths[index].id
    documentId.value = props.documentId
    productId.value = row.id
    const resp = await documentService.deleteDocumentProduct(berthId.value, documentId.value, productId.value)
    if (resp.statusCode === 200) {
        props.confirmDeleteProduct(true)
    } else {
        props.confirmDeleteProduct(false)
    }
}

const handleOpenAddDockingVessel = () => {
    documentId.value = props.documentId
    berthId.value = 0
    isConfirmDialogOpen.value = true
}

const dialogCancel = () => {
    isConfirmDialogOpen.value = false
}

const dialogProductCancel = () => {
    isConfirmProductDialogOpen.value = false
}
const confirmAddDockingVessel = (isSuccess: boolean) => {
    isConfirmDialogOpen.value = false
    props.confirmAddDockingVessel(isSuccess)
}

const confirmAddProduct = (isSuccess: boolean) => {
    isConfirmProductDialogOpen.value = false
    props.confirmAddProduct(isSuccess)
}
</script>
