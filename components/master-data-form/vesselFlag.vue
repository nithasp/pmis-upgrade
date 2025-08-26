<template>
   <div>
      <slot name="activator" :on="{ click: openModal }">
         <!-- Default activator can be defined here if needed -->
         <button v-if="!hideButton" class="py-2 px-4 rounded bg-primaryy" @click="openModal">เปิด</button>
      </slot>
      <UModal
         :modelValue="modal"
         :ui="{
            container: 'items-center',
            width: 'w-[95%] md:min-w-[400px]',
            rounded: 'rounded-3xl',
         }"
      >
         <div class="p-6">
            <img :src="DocIcon" :alt="DocIcon" class="w-6" />
            <p class="text-xl font-anuphan-semi-bold my-4">{{ $t("vessel_flag_form_topic") }}</p>
            <p class="my-4">{{ $t("vessel_flag_form_description") }}</p>
            <UForm :schema="vesselFlagSchema" :state="form" @submit="submitForm">
               <div class="">
                  <p class="text-sm my-1">{{ $t("vessel_flag_form_name") }}<span class="text-red-500"> *</span> </p>
                  <Input type="text" :placeholder="$t('vessel_flag_form_placeholder')" class="" v-model="form.name" name="name" :error="messageError" />
               </div>
               <!-- อัพโหลด -->
               <div class="max-w-[512px] mt-4">
                  <p class="font-anuphan-semi-bold my-1">{{ $t("vessel_flag_form_upload") }}</p>
                  <ImageDropzone
                     :error="errorMessageUploadFile"
                     :getFiles="getFiles"
                     :filesValue="uploadFile"
                     :errorFromUpload="(message: string) => errorMessageUploadFile = message"
                  />
                  <div class="flex justify-end">
                     <span class="text-gray-500 text-sm mr-2 my-3">{{ $t("vessel_flag_form_upload_caption") }}</span>
                  </div>
               </div>
               <div class="mt-8 flex justify-between flex-wrap gap-y-3">
                  <UButton
                     size="lg"
                     color="white"
                     variant="solid"
                     :label="'ยกเลิก'"
                     block
                     class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
                     @click="closeModal(false)"
                     ref="removeAutoFocus"
                  />
                  <UButton size="lg" color="primary" variant="solid" block class="rounded-lg w-full sm:w-[170px]" type="submit" :label="'บันทึก'" />
               </div>
            </UForm>
         </div>
      </UModal>
      <DialogAlert title="บันทึกข้อมูล" desc="ข้อมูลนี้ถูกบันทึกแล้ว" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />

      <Loading v-if="isLoading" />
   </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input";
import Loading from "~/components/loading";
import ButtonSave from "~/components/button/save";
import ButtonCancel from "~/components/button/cancel";
import DocIcon from "~/assets/icons/fi-rs-document.svg";
import DialogAlert from "~/components/dialog/alert.vue";
import masterDataShipService from "~/core/services/masterDataShipService/vesselService.ts";
import ImageDropzone from "~/components/form/imageDropzone.vue";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const toast = useToast();

const props = defineProps({
   hideButton: {
      type: Boolean,
      default: false,
   },
   vesselId: {
      type: Number,
      required: false,
      default: null,
   },
   editMode: {
      type: Boolean,
      required: false,
      default: false,
   },
   setOpen: {
      type: Boolean,
      required: false,
      default: false,
   },
   data: {
      type: Object,
      required: false,
   },
});
const { postVesselFlag, putVesselFlag } = masterDataShipService();
const modal = ref(false);

const form = ref({
   name: "",
});
const uploadFile = ref([]);
const errorMessageUploadFile = ref("");
const vesselFlagSchema = z.object({
   name: z.string().min(1, "กรุณากรอกข้อมูล"),
});
watch(
   () => props.setOpen,
   (value) => {
      console.log("get detail", props.data.name);
      if (value) {
         setForm();
         openModal();
      }
   }
);
const messageError = ref("");
const isLoading = ref(false);
const openModal = () => {
   console.log("open");
   modal.value = true;
   if (props.editMode) {
      console.log("open getdetail");
   } else {
   }
};
const setForm = function () {
   form.value.name = props.data.name;
   uploadFile.value = [{ filePath: props.data.filePath, fileName: props.data.name, size: 0, isError: false }];
};
const emit = defineEmits(["fetch,close"]);

async function submitForm(event: FormSubmitEvent<z.output<typeof vesselFlagSchema>>) {
   console.log("submitForm");

   try {
      isLoading.value = true;
      let resp;
      let body = null;
      if (props.editMode) {
         body = {
            name: form.value.name,
            file_id: uploadFile.value.length > 0 ? uploadFile.value[0].file_id : -1,
            status: form.value.status,
         };
         resp = await putVesselFlag(props.vesselId, body);
      } else {
         body = {
            name: form.value.name,
            file_id: uploadFile.value.length > 0 ? uploadFile.value[0].file_id : 0,
         };
         resp = await postVesselFlag(body);
      }
      console.log("submitted", resp);
      if (resp.statusCode === 200) {
         isDialogSuccessOpen.value = true;
         emit("fetch");
         closeModal();
      } else {
         toast.add({ title: resp?.message, color: "red" });
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
}
const closeModal = () => {
   clearForm();
   emit("close");
   modal.value = false;
};
const clearForm = () => {
   form.value = {
      name: "",
   };
};
const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
const getFiles = (value: any) => {
   uploadFile.value = value.map(({ isError, ...i }: { isError: boolean }) => ({ ...i, extension: "image/*" }));
   // console.log(uploadFile.value[0]);
};
</script>
