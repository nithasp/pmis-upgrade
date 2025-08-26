<template>
    <h2 class="font-bold text-grayy-400">{{ $t('document_content.title2') }}</h2>
    <ul class="list-decimal pl-6 space-y-0.5 text-grayy-500 my-2">
        <li>{{ $t('document_content.list[0]') }}</li>
        <li>{{ $t('document_content.list[1]') }}</li>
        <li>{{ $t('document_content.list[2]') }}</li>
        <li>{{ $t('document_content.list[3]') }}</li>
        <li>{{ $t('document_content.list[4]') }}</li>
    </ul>
    <div class="flex justify-end">
        <a :href="downloadUrl" class="flex items-center cursor-pointer" target="_blank">
            <span class="text-primaryy-500 mr-2 my-3">{{ $t('document_content.download_example') }}</span>
            <NuxtIcon name="download" />
        </a>
    </div>
    <FileDropzone :error="errorMessage" :getFiles="getFiles" :filesValue="filesValue"
        :errorFromUpload="(message) => errorMessage = message" :maximumFileLimit="5" />
    <div class="flex justify-between">
        <div class="flex items-center">
            <NuxtIcon v-if="errorMessage" name="exclamation" color="text-error-500" />
            <span v-if="errorMessage" class="text-red-500 ml-2 my-3">
                {{ $t(`${errorMessage}`).replace('<amount>', 5) }}
            </span>
        </div>
        <span class="text-grayy-500 mr-2 my-3">{{ $t('document_content.upload_caption').replace('<amount>', 5) }}</span>
    </div>
</template>
<script setup>

const config = useRuntimeConfig();
const downloadUrl = config.public.apiBaseUrl + '/downloads/agent-template';

const props = defineProps({
    required: Boolean,
    getFiles: Function,
    filesValue: {
        type: Array,
        default: []
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
