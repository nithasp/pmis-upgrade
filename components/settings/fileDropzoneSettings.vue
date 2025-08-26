<template>
    <div class="bg-white rounded-lg overflow-hidden">
        <div>
            <div v-if="files.filter(item => !item.hasOwnProperty('id')).length < maximumFileLimit"
                :class="['border-dashed border-2 border-purple-400 text-center p-6 rounded-lg cursor-pointer', errorMessage ? 'border-red-600' : '']"
                v-bind="getRootProps()">
                <input v-bind="getInputProps()" class="hidden" />
                <div class="text-center flex flex-col items-center">
                    <NuxtIcon name="cloud-upload" size="3xl" />
                    <p class="text-gray-600 text-sm">
                        {{ isDragActive ? "Drop the files here ..." : "ลากและวางเอกสาร หรือ เรียกดู" }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">จำกัดขนาดไฟล์สูงสุด 10 MB</p>
                </div>
            </div>
            <div v-else class="border-dashed border-2 border-purple-400 text-center p-6 rounded-lg cursor-not-allowed">
                <div class="text-center flex flex-col items-center">
                    <NuxtIcon name="cloud-check" size="3xl" />
                    <p class="text-gray-600 text-sm">อัปโหลดครบ {{ maximumFileLimit }} ไฟล์แล้ว</p>
                </div>
            </div>
        </div>

        <p v-if="props.note" class="text-[#667085] text-sm text-right my-4">{{ props.note }}</p>
        
        <div v-if="files.length" class="my-4">
            <div v-for="(file, index) in files" :key="index"
                :class="`bg-white rounded-lg shadow p-3 mb-4 border ${file.isError ? 'border-error-500' : 'border-grayy-50'}`">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center">
                        <div class="mr-2">
                            <NuxtIcon name="document" size="3xl" :color="file.isError ? 'text-error-500' : ''" />
                        </div>
                        <div>
                            <a :href="file.preview ? file.preview : file.filePath" target="_blank"
                                :class="file.isError ? 'text-error-500' : 'text-gray-700'">{{
                                    file.fileName
                                }}</a>
                            <div :class="`${file.isError ? 'text-error-500' : 'text-gray-500'} text-sm`">{{
                                formatFileSize(file.size) }}</div>
                            <span v-if="file.isError" class="text-error-500 text-sm">ขนาดไฟล์ของคุณเกินขนาดที่กำหนด
                                กรุณาลบและอัปโหลดใหม่อีกครั้ง</span>
                        </div>
                    </div>
                    <div v-if="!file.id" @click="handleClickDeleteFile(index)" class="cursor-pointer">
                        <NuxtIcon name="cross-circle" size="xl" />
                    </div>
                </div>
                <div v-if="file.progress" class="relative grid grid-cols-[1fr_auto] gap-1 items-center">
                    <div class="overflow-hidden h-2 text-xs flex rounded bg-[#F2F4F7]">
                        <div :style="{ width: file.progress + '%' }"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-600">
                        </div>
                    </div>
                    <div class="text-right text-sm text-gray-400">{{ file.progress }}%</div>
                </div>

            </div>
        </div>
    </div>
    <DialogAlert title="อัปโหลดเกินจำนวน!" desc="อัปโหลดได้ 5 ไฟล์เท่านั้น ไฟล์ที่เกินมาจะไม่ถูกอัปโหลด" type="danger"
        :isOpen="isDialogAlertOpen" :setDialog="handleCloseAlertDialog" btnName="ปิด" />
</template>

<script setup>
import { useDropzone } from "vue3-dropzone";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import useSettingService from "~/core/services/settingService";
const { uploadFileSetting } = useSettingService();

const toast = useToast();
const props = defineProps({
    error: String,
    getFiles: Function,
    filesValue: {
        type: Array,
        default: [],
    },
    errorFromUpload: Function,
    maximumFileLimit: {
        type: Number,
        default: 5,
    },
    uploadType: String,
    note: String
});

onBeforeUnmount(() => {
    clearController();
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const errorMessage = ref(props.error || "");
const files = ref(props.filesValue || []);
const controllers = new Map();
async function onDrop(acceptedFiles, rejectedFiles) {
    const currentFileCount = files.value.filter(item => !item.hasOwnProperty('id'));

    if (currentFileCount.length + acceptedFiles.length > 5) {
        isDialogAlertOpen.value = true;
        return;
    }

    if (acceptedFiles.length <= 5) {
        acceptedFiles.forEach(async (fileItem) => {
            const fileIdMock = generateRandomId();

            if (fileItem.size > MAX_FILE_SIZE) {
                files.value.push({
                    mockId: fileIdMock,
                    fileName: fileItem.name,
                    size: fileItem.size,
                    filePath: "",
                    isError: true,
                });
            } else {
                files.value.push({
                    mockId: fileIdMock,
                    fileName: fileItem.name,
                    size: fileItem.size,
                    progress: 0,
                    isError: false,
                });

                const controller = new AbortController();
                controllers.set(fileIdMock, controller);
                const res = await uploadFileSetting(fileItem, fileIdMock, files.value, controller);
                if (res) {
                    const fileIndex = files.value.findIndex(file => file.mockId === fileIdMock);
                    if (fileIndex > -1) {
                        files.value[fileIndex] = {
                            ...files.value[fileIndex],
                            fileId: res.data.id,
                            size: res.data.size,
                            filePath: res.data.filePath,
                            preview: res.data.preview,
                            progress: 100,
                            isError: false,
                        };
                    }
                } else {
                    console.log(res.error);
                    toast.add({ title: res.error, color: "red" });
                }
            }
        });
    } else {
        isDialogAlertOpen.value = true;
    }
}

const clearController = () => {
    controllers.forEach((controller) => {
        controller.abort();
    });
    controllers.clear();
}

const generateRandomId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

watch(
    () => props.error,
    (error) => {
        if (error) {
            errorMessage.value = error;
        } else {
            errorMessage.value = "";
        }
    }
);

watch(
    () => props.filesValue,
    (value) => {
        files.value = value;
    }
);

const handleClickDeleteFile = (index) => {
    files.value.splice(index, 1);
};

const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: "application/pdf",
    multiple: false,
    maxFiles: 1
});

const isDialogAlertOpen = ref(false);
const handleCloseAlertDialog = (status) => {
    isDialogAlertOpen.value = status;
};

defineExpose({
    clearController
});
</script>