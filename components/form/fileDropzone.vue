<template>
    <div class="bg-white rounded-lg overflow-hidden">
        <div v-if="!isView">
            <div v-if="files.length < maximumFileLimit"
                :class="['border-dashed border-2 border-primaryy-500 text-center p-6 rounded-lg cursor-pointer', errorMessage ? 'border-red-600' : '']"
                v-bind="getRootProps()">
                <input v-bind="getInputProps()" class="hidden" />
                <div class="text-center flex flex-col items-center">
                    <NuxtIcon name="cloud-upload" size="3xl" />
                    <p class="text-gray-600 text-sm">
                        {{ isDragActive ? 'Drop the files here ...' : $t('document_content.drag_and_drop') }}
                    </p>

                    <p class="text-xs text-gray-500 mt-1">{{ $t('document_content.maximum_file_size_message') }}</p>
                </div>
            </div>
            <div v-else
                class="border-dashed border-2 border-primaryy-500 text-center p-6 rounded-lg cursor-not-allowed">
                <div class="text-center flex flex-col items-center">
                    <NuxtIcon name="cloud-check" size="3xl" />
                    <p class="text-gray-600 text-sm">
                        {{ $t("document_content.uploaded_limit_reached").replace('<amount>', maximumFileLimit) }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if="files.length" :class="`my-4 ${(isView || isGrid) ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : ''}`">
            <div v-for="(file, index) in files" :key="index"
                :class="`bg-white rounded-lg shadow p-3  border ${file.isError ? 'border-error-500' : 'border-grayy-50'}`">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center cursor-pointer hover:underline"
                        @click="() => handlePreviewFile(file.filePath)">
                        <div class="mr-2">
                            <NuxtIcon name="document" size="3xl" :color="file.isError ? 'text-error-500' : ''" />
                        </div>
                        <div>
                            <div :class="file.isError ? 'text-error-500' : 'text-gray-700'">{{ file.fileName }}</div>
                            <div :class="`${file.isError ? 'text-error-500' : 'text-gray-500'} text-sm`">{{
                                formatFileSize(file.size) }}</div>
                            <span v-if="file.isError" class="text-error-500 text-sm">{{
                                $t('document_content.alert_file_exceeds_allowed_size') }}</span>
                        </div>
                    </div>
                    <div v-if="(!isView || isDelete)" @click="handleClickDeleteFile(index)" class="cursor-pointer">
                        <NuxtIcon name="cross-circle" size="xl" />
                    </div>
                </div>
                <div class="relative">
                    <!-- <div class="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                        <div :style="{ width: file.progress + '%' }"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500">
                        </div>
                    </div>
                    <p class="text-right text-xs text-purple-600 mt-1">{{ file.progress }}%</p> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDropzone } from 'vue3-dropzone';
import NuxtIcon from "../../components/ui/nuxtIcon.vue";
import useMasterDataService from '~/core/services/masterDataService';

const props = defineProps({
    error: String,
    getFiles: {
        type: Function,
        default: () => { }
    },
    getDeletedFiles: {
        type: Function,
        default: () => { }
    },
    filesValue: {
        type: Array,
        default: []
    },
    errorFromUpload: Function,
    isView: {
        type: Boolean,
        default: false
    },
    isGrid: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    maximumFileLimit: {
        type: Number,
        default: 5
    },
    uploadType: String
})

const masterDataService = useMasterDataService()
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const errorMessage = ref(props.error || '')
const files = ref(props.filesValue || [])
const maximumFileLimitRemain = ref(props.maximumFileLimit)
const deletedFiles = ref([]);

const handlePreviewFile = (filePath) => {
    if (filePath) {
        window.open(filePath, '_blank')
    }
}

async function onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length < maximumFileLimitRemain.value) {
        acceptedFiles.forEach(async (file) => {
            if (file.size > MAX_FILE_SIZE) {
                files.value.push({
                    fileName: file.name,
                    size: file.size,
                    filePath: '',
                    isError: true
                });
            } else {
                const resp = await serviceUpload(file, props.uploadType)
                if (resp.statusCode === 200) {
                    files.value.push({
                        fileName: file.name,
                        size: file.size,
                        filePath: resp.data.filePath,
                        isError: false
                    });
                }
            }
            props.getFiles(files.value)
        });
    } else {
        errorMessage.value = 'document_content.drag_and_drop_alert_exceeds_allowed_size'
        props.errorFromUpload('document_content.drag_and_drop_alert_exceeds_allowed_size')
    }
}

const serviceUpload = (acceptedFiles, uploadType) => {
    switch (uploadType) {
        case 'register':
            return masterDataService.uploadFileRegister(acceptedFiles)
        case 'vessel':
            return masterDataService.uploadFileVessel(acceptedFiles)
        case 'document':
            return masterDataService.uploadFileDocument(acceptedFiles)
        case 'contract':
            return masterDataService.uploadFileContract(acceptedFiles)
        default:
            return masterDataService.uploadFileRegister(acceptedFiles)
    }
}

watch(
    () => props.error,
    (error) => {
        if (error) {
            errorMessage.value = error
        } else {
            errorMessage.value = ''
        }
    }
);

watch(
    () => props.filesValue,
    () => {
        maximumFileLimitRemain.value = props.maximumFileLimit - props.filesValue.length
        files.value = props.filesValue
    }
);



const handleClickDeleteFile = (index) => {
    const deletedFile = files.value.splice(index, 1)[0];
    deletedFiles.value.push(deletedFile);
    props.getFiles(files.value)
    props.getDeletedFiles(deletedFiles.value);
}

const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: 'application/pdf'
});

function back() {
    console.log("Back button clicked");
}

</script>

<style scoped>
/* Add any custom styles if necessary */
</style>
