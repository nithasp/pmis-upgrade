<template>
    <UModal
      :modelValue="isDialogOpen"
      :ui="{
        container: 'flex items-center justify-center',
        rounded: 'rounded-xl',
      }"
    >
      <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
        <div class="p-6 max-w-lg w-full mx-auto">
          <img :src="AddProductIcon" alt="Icon Warning" class="w-12 h-12" />
          <div class="mt-5">
            <div class="text-gray-900 text-lg font-semibold mb-1">
              {{ $t('add_inventory') }}
            </div>
            <p class="text-gray-500 text-sm">
              {{ $t('specify_inventory_details') }}
            </p>
          </div>

          <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <USelect
              :label="$t('purpose_of_docking')"
              :placeholder="$t('purpose_of_docking')"
              name="purposeId"
              v-model="formGroup.purposeId"
              :options="documentOptionsStore.filteredPurposesOptions"
              required
              :disabled="disabledPurpose"
            />
            <USelect
              :label="$t('cargo_wharfage')"
              :placeholder="$t('cargo_wharfage')"
              name="cargoWharfageId"
              v-model="formGroup.cargoWharfageId"
              :options="renderCargoWharfageOptions()"
              :disabled="disabledCargoWharfage"
            />
            <USelect
              :label="$t('product_group')"
              :placeholder="$t('product_group')"
              name="productGroupId"
              v-model="formGroup.productGroupId"
              :options="documentOptionsStore.productGroupsOptions"
              required
            />
            <USelect
              :label="$t('product_type_name')"
              :placeholder="$t('product_type_name')"
              name="productTypeId"
              v-model="formGroup.productTypeId"
              :options="documentOptionsStore.productTypeByProductTypeId"
              required
            />
  
            <NumericInput
              :label="$t('product_quantity')"
              :placeholder="'0.000'"
              v-model="formGroup.mTonQty"
              name="mTonQty"
              suffix="M/Ton"
              required
              :decimalPlaces="3"
            />
            <NumericInput
              :label="$t('product_quantity')"
              :placeholder="'0.000'"
              v-model="formGroup.rTonQty"
              name="rTonQty"
              suffix="R/Ton"
              :required="isRequiredRTon"
              :decimalPlaces="3"
            />
            <NumericInput
              :label="$t('จำนวน')"
              :placeholder="'0'"
              v-model="formGroup.packageAmount"
              name="packageAmount"
              type="number"
              :suffix="$t('แพ็กเกจ')"
              :decimalPlaces="0"
            />
  
            <UFormGroup :label="$t('cargo_owner')" name="cargoOwnerId" required>
              <USelectMenu
                color="purple"
                variant="outline"
                v-model="formGroup.cargoOwnerId"
                :placeholder="$t('cargo_owner')"
                option-attribute="name"
                value-attribute="id"
                creatable
                clear-search-on-close
                searchable
                @update:modelValue="handleCargoOnwerCreated"
                @change="handleCargoOwnerSelected"
                :options="documentOptionsStore.cargoOwnerOptions"
              >
                <template #option-create="{ option }">
                  <span class="flex-shrink-0">{{ $t('specific') }}:</span>
                  <span class="block truncate">{{ option }}</span>
                </template>
              </USelectMenu>
            </UFormGroup>
          </div>

          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="hidden" name="berthType" v-model="formGroup.berthType" />
            <UButton
              size="lg"
              color="white"
              variant="solid"
              :label="$t('cancel')"
              block
              class="rounded-lg w-full border border-gray-100 outline-none"
              @click="handleDialogCancel"
            />
            <UButton
              size="lg"
              variant="solid"
              :label="$t('confirm')"
              block
              class="rounded-lg w-full"
              type="submit"
            />
          </div>
        </div>
      </UForm>
    </UModal>
  </template>
  
<script setup lang="ts">
import { z } from "zod";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import AddProductIcon from "~/assets/icons/dialog/add-product.svg";
import NumericInput from "~/components/form/u-numeric-input.vue";
import USelect from "~/components/form/u-select.vue";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import useDocumentService from "~/core/services/documentService";

const { t } = useI18n();
const documentOptionsStore = useDocumentOptionsStore();
const documentService = useDocumentService();

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: { type: Function, required: true },
    confirmAddProduct: { type: Function, required: true },
    documentId: { type: Number, required: true },
    productId: { type: Number, default: 0 },
    berthId: { type: Number, default: 0 },
    berthType: { type: String, default: "" },
    purposeId: { type: Number, default: 0 },
    purposeTypeId: { type: Number, default: 0 },
    berthIdOptionProduct: { type: Number, default: 0 },
    requiredRTon: { type: Boolean, default: false },
    cargoOwnerId: { type: Number, default: 0 },
    receiver: { type: String, default: "" },
});

const documentId = computed(() => props.documentId)
const berthId = computed(() => props.berthId)
const productId = computed(() => props.productId)
const isDialogOpen = computed(() => props.isDialogOpen)

const isRequiredRTon = computed(() => props.requiredRTon);
const receiver = computed(() => props.receiver);
const purposesOptions = ref([]);
const disabledPurpose = ref(false);
const disabledCargoWharfage = ref(false);

const formGroup = reactive({
    productTypeId: 0,
    productGroupId: 0,
    mTonQty: 0,
    rTonQty: 0,
    packageAmount: 0,
    receiver: "", // ชื่อเจ้าของสินค้า
    cargoOwnerId: 0,
    purposeId: 0,
    cargoWharfageId: 0,
    berthType: props.berthType,
});

const formSchema = ref(createSchema());

function createSchema() {
    return z.object({
        productTypeId: z.number().min(1, { message: t("please_enter_a_value") }),
        productGroupId: z.number().min(1, { message: t("please_enter_a_value") }),
        mTonQty: z.number().min(1, { message: t("please_enter_a_value") }),
        rTonQty: isRequiredRTon.value
            ? z.number().min(1, { message: t("please_enter_a_value") })
            : z.number().optional(),
        receiver: z.string().nonempty({ message: t("please_enter_a_value") }),
        cargoOwnerId: z.number().min(0, { message: t("please_select_cargo_owner") }),
        purposeId: z.number().min(1, { message: t("please_enter_a_value") }),
        berthType: z.string().optional(),
    });
}

watch(
    () => props.berthType,
    (value) => {
        formGroup.berthType = value;
    }
);

watch(
    () => props.receiver,
    (value) => {
        formGroup.receiver = value;

        const cargoOwner = documentOptionsStore.cargoOwnerOptions.find((e: any) => e.name == value);
        if (cargoOwner) {
            formGroup.cargoOwnerId = cargoOwner.id;
        }
    }
);

watch(
    () => formGroup.productGroupId,
    (value) => {
        documentOptionsStore.getProductTypeByProductTypeId(value);
    }
);

watch(isRequiredRTon, () => {
    formSchema.value = createSchema();
});

watch(
    () => isDialogOpen.value,
    async (isOpen) => {
        if (isOpen) {
            if (isOpen && documentId.value && berthId.value && productId.value) {
                loadProductDetails();
            } else {
                resetFormGroup()
            }
        }
        formGroup.purposeId = props.purposeId;
        documentOptionsStore.getPurposesOptionsByType(props.purposeTypeId);
    }
);

onMounted(async () => {
    await fetchDocumentOptions();
    formGroup.purposeId = props.purposeId;
});

async function fetchDocumentOptions() {
    purposesOptions.value = documentOptionsStore.purposesOptions;
    documentOptionsStore.getProductGroupsOptions();
    documentOptionsStore.getProductTypesOptions();
    documentOptionsStore.getCargoWharfageOptions();
    documentOptionsStore.getCargoOwnerOptions();
    documentOptionsStore.getPurposesOptionsByType(props.purposeTypeId);
}

async function loadProductDetails() {
    const response = await documentService.getDocumentProductDetail(
        documentId.value,
        berthId.value,
        productId.value
    );
    if (response.statusCode === 200) {
        Object.assign(formGroup, response.data);
        const cargoOwnerId = response.data.cargoOwnerId;
        if (!cargoOwnerId) {
            handleCargoOnwerCreated(response.data.receiver);
        }
    }
}

function renderCargoWharfageOptions() {
    const purpose = documentOptionsStore.purposesOptions.find(
        (e: any) => e.id === formGroup.purposeId
    );
    if (purpose && ["Loading", "Discharge", "DischargeLoading"].includes(purpose.purposeType)) {
        return documentOptionsStore.cargoWharfageOptions.filter((e: any) =>
            e.purposeType.includes(String(purpose.purposeTypeId))
        );
    }
    return documentOptionsStore.cargoWharfageOptions;
}

function handleCargoOnwerCreated(newValue: any) {
    // Check if newValue is an ID (number) or a new value (string)
    const isExistingId = documentOptionsStore.cargoOwnerOptions.some(
        (e: any) => e.id === newValue
    );

    if (isExistingId) {
        // When selecting an existing item, update formGroup directly
        const selectedCargoOwner = documentOptionsStore.cargoOwnerOptions.find(
            (e: any) => e.id === newValue
        );

        if (selectedCargoOwner) {
            formGroup.cargoOwnerId = selectedCargoOwner.id;
            formGroup.receiver = selectedCargoOwner.name;
        }
    } else {
        // When creating a new item
        const newCargoOwner = { id: 0, name: newValue };

        // Check if a new item with `id === 0` already exists
        const existingCargoOwner = documentOptionsStore.cargoOwnerOptions.find(
            (e: any) => e.id === 0
        );

        if (existingCargoOwner) {
            // Replace the name of the existing item
            existingCargoOwner.name = newValue;
        } else {
            // Add the new item to the options list
            documentOptionsStore.cargoOwnerOptions.push(newCargoOwner);
        }

        // Update formGroup with the new ID and receiver
        formGroup.cargoOwnerId = newCargoOwner.id;
        formGroup.receiver = newValue;
    }
}


function handleCargoOwnerSelected(selectedValue: any) {
    const selectedCargoOwner = documentOptionsStore.cargoOwnerOptions.find(
        (option: any) => option.id === selectedValue
    );

    if (selectedCargoOwner) {
        formGroup.receiver = selectedCargoOwner.name;
    } else {
        formGroup.receiver = selectedValue;
    }
}

async function onSubmit(event: FormSubmitEvent<typeof formSchema.value>) {
    const payload = { ...event.data, packageAmount: Math.round(formGroup.packageAmount) };
    const response =
        documentId.value && berthId.value && productId.value
            ? await documentService.updateDocumentProduct(
                documentId.value,
                berthId.value,
                productId.value,
                payload
            )
            : await documentService.addDocumentProduct(
                documentId.value,
                berthId.value,
                payload
            );

    props.confirmAddProduct(response.statusCode === 200);
}

const resetFormGroup = () => {
    formGroup.productTypeId = 0
    formGroup.productGroupId = 0
    formGroup.mTonQty = 0
    formGroup.rTonQty = 0
    formGroup.packageAmount = 0
    formGroup.receiver = ""
    formGroup.cargoOwnerId = 0
    formGroup.purposeId = 0
    formGroup.cargoWharfageId = 0
    formGroup.berthType = props.berthType

    documentOptionsStore.getCargoOwnerOptions();
}

const handleDialogCancel = () => {
    props.dialogCancel()
    resetFormGroup()
}

</script>
