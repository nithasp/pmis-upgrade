<template>
   <UFormGroup :label="label" :name="name" :required="required">
      <div class="flex space-x-2 flex-col md:flex-row">
         <div class="relative">
            <!-- Custom Upload Button -->
            <UButton :for="id" class="absolute top-0 left-0 whitespace-nowrap" size="md" label="แนบไฟล์"
               icon="i-heroicons-paper-clip-solid" />

            <!-- File Input (hidden) -->
            <input type="file" ref="fileInput" :id="id" @change="onFileUpload" class="file-input opacity-0 w-[102px]"
               accept="application/pdf" />
         </div>

         <!-- Display File Name and Remove Button -->
         <div v-if="fileName"
            :class="`file-info hover:underline cursor-pointer flex items-center w-full border border-solid border-grayy-100 pl-2 pr-1 min-h-[36px] rounded mt-4 !ml-0 md:mt-0 md:!ml-4 ${isRequired ? 'border-red-500' : ''}`">
            <span @click="onPreviewFile" class="flex-1">{{ fileName }}</span>
            <UButton variant="link" size="sm" color="primary" icon="i-heroicons-x-circle" @click="onRemoveFile" />

         </div>
         <span class="text-red-500 mt-2 !ml-0 md:!ml-2" v-if="isRequired">กรุณานำส่งเอกสาร</span>
      </div>
   </UFormGroup>
</template>

<script setup lang="ts">
import useMasterDataService from "~/core/services/masterDataService";

// Props for customization
const props = defineProps({
   label: {
      type: String,
      default: "Attach File",
   },
   modelValue: {
      type: Object,
      default: null,
   },
   name: {
      type: String,
      required: true,
   },
   required: {
      type: Boolean,
      default: false,
   },
   id: {
      type: String,
      required: true,
   },
   valueFile: {
      type: Object,
      default: null,
   },
   type: {
      type: String,
      default: "file",
   },
   isDocumentType: {
      type: Boolean,
      default: false,
   },
   onFileUpload: {
      type: Function,
      default: () => { },
   },
   fileName: {
      type: String,
      default: null,
   },
   filePreview: {
      type: String,
      default: null,
   },
   isRequired: {
      type: Boolean,
      default: false,
   },
   onRemoveFile: {
      type: Function,
      default: () => { },
   },
   uploadType: {
      type: String,
      default: "file",
   },
});
const masterDataService = useMasterDataService()
// Emits for communicating with the parent
const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue);

// Emit the changes back to the parent component
watch(internalValue, (newValue) => {
   console.log('internalValue ', newValue)
   emit("update:modelValue", newValue);
});


// Reactive state for the file name and file input
const fileName = ref<string | null>(props.fileName);
const filePreview = ref<string | null>(props.filePreview);
const fileInput = ref<HTMLInputElement | null>(null);
const isRequired = ref<boolean>(false);

const onPreviewFile = () => {
   console.log('filePath.value ', filePreview.value)
   if (filePreview.value) {
      window.open(filePreview.value, "_blank");
   }
};
// Handle file upload
const onFileUpload = async (event: Event) => {
   const target = event.target as HTMLInputElement;
   if (target && target.files && target.files[0]) {
      const file = target.files[0];

      // Validate file type (only accept PDFs)
      if (file.type !== "application/pdf") {
         alert("Please upload a valid PDF file.");
         target.value = ""; // Clear the file input
         return;
      }

      // Validate file size (not over 10 MB)
      const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
      if (file.size > maxFileSize) {
         alert("The file size exceeds 10 MB. Please upload a smaller file.");
         target.value = ""; // Clear the file input
         return;
      }

      try {
         // Determine the upload method based on `isDocumentType` prop
         const resp = props.uploadType === 'file' ? props.isDocumentType
            ? await masterDataService.uploadFileDocument(file, props.type)
            : await masterDataService.uploadFileVessel(file, props.type) : await masterDataService.uploadFileRegister(file, props.type);

         // Handle successful response
         if (resp.statusCode === 200) {
            const fileData = {
               ...resp.data,
               document_file_type: resp.data?.document_file_type || "",
               extension: resp.data?.extension || "",
               fileName: resp.data?.fileName || "",
               filePath: resp.data?.filePath || "",
               preview: resp.data?.preview || "",
               size: resp.data?.size || 0,
               fileType: props.uploadType === 'register' ? props.type : resp.data.fileType || "",
            };

            // Emit the file data and trigger callback
            emit("update:modelValue", fileData);
            props.onFileUpload(fileData);
            fileName.value = file.name; // Update file name display
            filePreview.value = fileData.preview;
         }
      } catch (error) {
         console.error("Error uploading file:", error);
         alert("Failed to upload the file. Please try again.");
      }
   }
};

// Remove the file and clear the file name
const onRemoveFile = () => {
   if (fileInput.value) {
      fileInput.value.value = "";
   }
   fileName.value = null;
   emit("update:modelValue", null);
};

watch(() => props.valueFile, (newValue) => {
   if (newValue) {
      fileName.value = newValue.fileName;
      props.onRemoveFile(newValue)
   }
});

watch(() => props.fileName, (newValue) => {
   if (newValue) {
      fileName.value = newValue;
   }
});

watch(() => props.filePreview, (newValue) => {
   if (newValue) {
      filePreview.value = newValue;
   }
});

watch(() => props.isRequired, (newValue) => {

   isRequired.value = newValue;

});

</script>
