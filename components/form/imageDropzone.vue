<template>
   <UFormGroup :label="label" :name="name" :required="required">
      <div class="bg-white rounded-lg overflow-hidden">
         <div v-if="!isView">
            <div
               v-if="files.length < props.limitFile"
               :class="['border-dashed border-2 border-purple-400 text-center p-6 rounded-lg cursor-pointer', errorMessage ? 'border-red-600' : '']"
               v-bind="getRootProps()"
            >
               <input v-bind="getInputProps()" class="hidden" :required="required" />
               <div class="text-center flex flex-col items-center">
                  <NuxtIcon name="cloud-upload" size="3xl" />
                  <p class="text-gray-600 text-sm">
                     {{ isDragActive ? "Drop the files here ..." : $t("vessel_flag_form_upload_drag") }}
                  </p>

                  <p class="text-xs text-gray-500 mt-1">{{ $t("vessel_flag_form_upload_description") }}</p>
               </div>
            </div>
            <div v-else class="border-dashed border-2 border-purple-400 text-center p-6 rounded-lg ${} cursor-not-allowed">
               <div class="text-center flex flex-col items-center">
                  <NuxtIcon name="cloud-check" size="3xl" />
                  <p class="text-gray-600 text-sm">อัปโหลดครบ {{ props.limitFile }} ไฟล์แล้ว</p>
               </div>
            </div>
         </div>
         <span class="text-red-500" v-if="errorMessage && files.length == 0">กรุณานำส่งเอกสาร</span>
         <div v-if="files.length" class="my-4">
            <div
               v-for="(file, index) in files"
               :key="index"
               :class="`bg-white rounded-lg shadow p-3 mb-4 border ${file.isError ? 'border-error-500' : 'border-grayy-50'}`"
            >
               <div class="flex justify-between items-center" :class="`${file.filePathDownload ? 'cursor-pointer' : ''}`" @click="()=>{file.filePathDownload ? downloadFile(file.filePathDownload):{}}">
                  <div class="flex items-center">
                     <div class="mr-2">
                        <img v-if="file.filePath" :src="file.filePath" alt="" width="40" height="40" class="rounded-sm" />
                        <NuxtIcon v-else name="document" size="3xl" :color="file.isError ? 'text-error-500' : ''" />
                     </div>

                     <div>
                        <div :class="file.isError ? 'text-error-500' : 'text-gray-700'">{{ file.fileName ? file.fileName : "xxx" }}</div>
                        <div v-if="file.isError || file.size" :class="`${file.isError ? 'text-error-500' : 'text-gray-500'} text-sm`">
                           {{ formatFileSize(file.size) }}
                        </div>
                        <span v-if="file.isError" class="text-error-500 text-sm">ขนาดไฟล์ของคุณเกินขนาดที่กำหนด กรุณาลบและอัปโหลดใหม่อีกครั้ง</span>
                     </div>
                  </div>
                  <div v-if="!isView" @click="handleClickDeleteFile(index)" class="cursor-pointer">
                     <NuxtIcon name="cross-circle" size="xl" />
                  </div>
               </div>
               <div v-if="progressShow" class="mt-2 flex justify-between items-center">
                  <UProgress class="mr-2" :value="percentCompleted" />
                  <p>{{ percentCompleted }}%</p>
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
   </UFormGroup>
</template>

<script setup lang="ts">
import { useDropzone } from "vue3-dropzone";
import NuxtIcon from "../../components/ui/nuxtIcon.vue";
import masterDataShipService from "~/core/services/masterDataShipService/vesselService.ts";
const { $api } = useNuxtApp();

const props = defineProps({
   error: String,
   getFiles: Function,
   filesValue: {
      type: Array,
      default: [],
   },
   errorFromUpload: Function,
   isView: {
      type: Boolean,
      default: false,
   },
   limitFile: {
      type: Number,
      default: 1,
   },
   accept: {
      type: String,
      default: "image/*",
   },
   required: {
      type: Boolean,
      default: false,
   },
   isRequired: {
      type: Boolean,
      default: false,
   },
});

// const { uploadFileVessel } = masterDataShipService();
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB in bytes
const errorMessage = ref(props.error || "");
const files = ref(props.filesValue || []);
const isRequired = ref<boolean>(false);
const progressShow = ref(false);
const percentCompleted = ref(0);
watch(
   () => percentCompleted.value,
   (value) => {
      console.log("percentCompleted", value);
   }
);
watch(() => props.isRequired, (newValue) => {
   isRequired.value = newValue;
});

async function onDrop(acceptedFiles, rejectedFiles) {
   if (acceptedFiles.length <= props.limitFile) {
      acceptedFiles.forEach(async (file) => {
         if (file.size > MAX_FILE_SIZE) {
            files.value.push({
               file_id: null,
               fileName: file.name,
               size: file.size,
               filePath: "",
               isError: true,
            });
         } else {
            files.value.push({
               file_id: 0,
               fileName: file.name,
               size: file.size,
               filePath: "",
               isError: false,
            });
            const resp = await uploadFileVessel(acceptedFiles);
            console.log("resp", resp);
            // progressShow.value = percentCompleted;
            if (resp.statusCode === 200) {
               const { id } = resp.data.data;
               files.value[0] = {
                  file_id: id,
                  fileName: file.name,
                  size: file.size,
                  filePath: resp.data.filePath,
                  isError: false,
               };
            }
         }
         props.getFiles(files.value);
      });
   } else {
      errorMessage.value = `ไม่อนุญาตให้อัพเกิน ${props.limitFile} ไฟล์ได้`;
      props.errorFromUpload(`ไม่อนุญาตให้อัพเกิน ${props.limitFile} ไฟล์ได้`);
   }
}
const uploadFileVessel = async (file: any) => {
   progressShow.value = true;
   percentCompleted.value = 0;
   const formData = new FormData();
   // console.log('file.name',file)
   formData.append("file", file[0], file[0].name);
   try {
      const response: AxiosResponse<UploadResponse> = await $api.post("/admin/master-data/upload", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
         onUploadProgress: (progressEvent) => {
            // console.log("progressEvent", progressEvent);
            percentCompleted.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // console.log(`Upload progress: ${percentCompleted}%`);
         },
      });
      return wrapperSuccessResp(response);
   } catch (error) {
      console.error("upload file register failed:", error);
      return wrapperErrorResp(error);
   } finally {
      progressShow.value = false;
   }
};

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
   accept: props.accept,
   // accept: "image/*",
});


function downloadFile(filePath) {
   window.open(filePath,'_blank');
}
function back() {
   console.log("Back button clicked");
}
</script>

<style scoped>
/* Add any custom styles if necessary */
</style>
