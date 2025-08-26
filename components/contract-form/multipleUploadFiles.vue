<template>
    <h2 class="font-bold text-grayy-400">{{ $t('document_content.title2') }}</h2>
    <ul class="list-decimal pl-6 space-y-0.5 text-grayy-500 my-2">
        <li>{{ $t('เอกสารสัญญา') }}</li>
    </ul>
   
    <FileDropzone :error="errorMessage" :getFiles="getFiles" :filesValue="filesValue" :uploadType="'contract'"
        :errorFromUpload="(message) => errorMessage = message" :maximumFileLimit="20" :isGrid="true" :isView="isView" />
    <div class="flex justify-between">
        <div class="flex items-center">
            <NuxtIcon v-if="errorMessage" name="exclamation" color="text-error-500" />
            <span v-if="errorMessage" class="text-red-500 ml-2 my-3">
                {{ $t(`${errorMessage}`).replace('<amount>', 20) }}
            </span>
        </div>
        <span class="text-grayy-500 mr-2 my-3">{{ $t('document_content.upload_caption').replace('<amount>', 20) }}</span>
    </div>
</template>
<script setup>

const config = useRuntimeConfig();

const props = defineProps({
    required: Boolean,
    getFiles: Function,
    filesValue: {
        type: Array,
        default: []
    },
    isView: {
        type: Boolean,
        default: false
    }
})
const errorMessage = ref(props.required ? 'กรุณานำส่งเอกสาร' : '')

watch(
    () => props.required,
    (required) => {
        if (required) {
            errorMessage.value = 'กรุณานำส่งเอกสาร'
        } else {
            errorMessage.value = ''
        }
    }
);

watch(
    () => props.filesValue.length,
    () => {
        errorMessage.value = ''
    }
);


import FileDropzone from "~/components/form/fileDropzone.vue";
import NuxtIcon from "../ui/nuxtIcon.vue";
</script>
