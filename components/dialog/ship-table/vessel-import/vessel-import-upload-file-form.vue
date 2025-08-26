<template>
    <UModal :modelValue="isDialogOpen" :ui="{
        container: 'items-center',
        width: 'w-[400px]',
        rounded: 'rounded-xl',
        margin: 'p-6',
    }" :initialFocus="removeAutoFocus">
        <UForm :state="formGroup" :schema="vesselImportEditSchema" @submit="onSubmit">
            <img :src="DocumentVariant" alt="document-icon" class="w-12 h-12" />
            <div class="my-5">
                <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("document_send") }}
                </div>
                <div class="text-[#667085] text-sm">{{ $t("select_upload_file") }}</div>
            </div>
            <Input :label="$t('document_name')" name="name" :placeholder="$t('document_name')" v-model="formGroup.name"
                class="w-full mb-4" required />
            <fileDropzoneVesselImport :error="errorMessageUploadFile" :getFiles="getFiles" :filesValue="uploadFiles"
                :errorFromUpload="(message: string) => errorMessageUploadFile = message" ref="fileDropzoneVesselImport"
                note="รองรับสกุลไฟล์ .pdf และอัปโหลดได้สูงสุด 1 ไฟล์" :maximumFileLimit="1" />
            <div class="mt-5 flex justify-between flex-wrap gap-y-3">
                <UButton size="lg" color="white" variant="solid" :label="$t('cancel')" block
                    class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
                    @click="() => dialogCancel!(false)" ref="removeAutoFocus" />
                <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block
                    class="rounded-lg w-full sm:w-[170px]" type="submit" />
            </div>
        </UForm>
    </UModal>
    <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import FileDropzoneVesselImport from "~/components/form/fileDropzoneVesselImport.vue";
import Loading from "~/components/loading.vue";
import DocumentVariant from "~/assets/icons/dialog/document-variant.png";

const { t } = useI18n();
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const vesselImportEditSchema = z.object({
    name: z.string().min(1, t("required")),
});

const props = defineProps({
    isDialogOpen: Boolean,
    dialogCancel: Function,
    dialogConfirm: Function,
    itemData: Object,
});

watch(
    () => props.isDialogOpen,
    (newValue) => {
        resetForm();
    }
);

const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const formGroup = ref<any>({
    name: "",
});
const resetForm = () => {
    formGroup.value.name = "";
    uploadFiles.value = [];
};
const fileDropzoneVesselImport = ref<any | null>(null);
const uploadFiles = ref<any>([]);
const errorMessageUploadFile = ref("");

async function onSubmit(event: FormSubmitEvent<z.output<typeof vesselImportEditSchema>>) {
    const body = {
        ...formGroup.value,
        uploadFiles: uploadFiles.value
    }
    const areAllFilesErrorFalse = uploadFiles.value.every((file: any) => file.isError === false);
    if (areAllFilesErrorFalse) {
        props.dialogConfirm!(false, body);
    }
}

const getFiles = (value: any) => {
    uploadFiles.value = value.map(({ isError, ...i }: { isError: boolean }) => ({ ...i, extension: "application/xml" }));
};
</script>