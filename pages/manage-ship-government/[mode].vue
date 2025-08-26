<template>
   <div class="mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("vessel_government_management") }}</h1>
   </div>
   <UForm :schema="formSchema" :state="formGroup" @submit="onSubmit">
      <div id="ship-agent-form-content" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
         <div class="flex items-center justify-between mb-5">
            <div>
               <h1 class="font-semibold text-lg text-grayy-400">{{ isEdit ? "แก้ไข" : "เพิ่ม" }}ข้อมูลเรือราชการ</h1>
               <div class="mt-1 text-grayy-75 text-sm">ระบุรายละเอียดข้อมูลเรือราชการ</div>
            </div>
            <div v-if="isView" class="flex items-center">
               <UButton @click="() => navigateTo(`/manage-ship-government/list`)" class="mx-1 border border-grayy-100" size="md" color="gray" label="กลับ" />
            </div>
            <div v-else class="flex items-center">
               <UButton @click="handleCancleCreateVessel" class="mx-1 border border-grayy-100" size="md" color="gray" label="ยกเลิก" />
               <UButton class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50" size="md" label="บันทึก" type="submit" />
            </div>
         </div>
         <UDivider />

         <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <Input v-if="isView" is-view :label="'ชื่อเรือ'" name="name" :placeholder="'name'" v-model="formGroup.name" />
                  <Input v-else label="ชื่อเรือ" placeholder="ชื่อเรือ" name="name" required v-model="formGroup.name" />
               </div>
               <div class="col-span-1">
                  <Input
                     v-if="isView"
                     is-view
                     :label="'หมายเลขเรือราชการ'"
                     name="officialNumber"
                     :placeholder="'officialNumber'"
                     v-model="formGroup.officialNumber"
                  />

                  <Input v-else label="หมายเลขเรือราชการ" placeholder="หมายเลขเรือราชการ" name="officialNumber" required v-model="formGroup.officialNumber" />
               </div>
               <div class="col-span-1">
                  <Input v-if="isView" is-view :label="'หน่วยงาน'" name="authority_name" :placeholder="'authorityName'" v-model="formGroup.authority_name" />
                  <UFormGroup v-else label="หน่วยงาน" name="authority_name" required>
                     <USelectMenu
                        v-model="formGroup.authority_id"
                        size="md"
                        variant="outline"
                        color="purple"
                        value-attribute="authority_id"
                        option-attribute="authority_name"
                        searchable
                        clear-search-on-close
                        :options="authorityList"
                        placeholder="หน่วยงาน"
                     >
                     </USelectMenu>
                  </UFormGroup>
               </div>
               <div class="col-span-1">
                  <Input
                     v-if="isView"
                     is-view
                     :label="'สัญชาติเรือ/ธงเรือ'"
                     name="vesselFlagName"
                     :placeholder="'vesselFlagName'"
                     v-model="vesselFlagData.flagName"
                  />
                  <UFormGroup v-else label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId" required>
                     <USelectMenu
                        v-model="formGroup.vesselFlagId"
                        size="md"
                        variant="outline"
                        color="purple"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        clear-search-on-close
                        :options="vesselOptionsStore.vesselFlagsOption"
                        placeholder="สัญชาติเรือ/ธงเรือ"
                        disabled
                     >
                        <template #leading>
                           <UAvatar v-if="vesselFlagData.avatar" size="xs" :src="vesselFlagData.avatar" alt="Avatar" />
                           <NuxtIcon v-else name="flag" size="xl" />
                        </template>
                     </USelectMenu>
                  </UFormGroup>
               </div>

               <UDivider class="my-4 col-span-2" />
               <div class="col-span-1">
                  <Input v-if="isView" is-view :label="'ความยาว'" name="lengthOverall" :placeholder="'lengthOverall'" v-model="formGroup.lengthOverall" float />
                  <NumericInput v-else label="ความยาว" placeholder="0.00" name="lengthOverall" required v-model="formGroup.lengthOverall" type="number" suffix="m" />
               </div>
               <div class="col-span-1">
                  <Input v-if="isView" is-view :label="'ความกว้าง'" name="breadthExtreme" :placeholder="'breadthExtreme'" v-model="formGroup.breadthExtreme" float />
                  <NumericInput
                     v-else
                     label="ความกว้าง"
                     placeholder="0.00"
                     name="breadthExtreme"
                     required
                     v-model="formGroup.breadthExtreme"
                     type="number"
                     suffix="m"
                  />
               </div>
               <div class="col-span-1">
                  <Input v-if="isView" is-view :label="'กินน้ำลึก'" name="depth" :placeholder="'depth'" v-model="formGroup.depth" float />
                  <NumericInput v-else label="กินน้ำลึก" placeholder="0.00" name="depth" required v-model="formGroup.depth" type="number" suffix="m" />
               </div>
               <div class="col-span-1">
                  <Input
                     v-if="isView"
                     is-view
                     :label="'ระวางขับน้ำ(Displacement)'"
                     name="displacement"
                     :placeholder="'displacement'"
                     v-model="formGroup.displacement"
                     float
                  />
                  <NumericInput
                     v-else
                     label="ระวางขับน้ำ(Displacement)"
                     placeholder="0.000"
                     name="displacement"
                     required
                     v-model="formGroup.displacement"
                     type="number"
                     suffix="t"
                     decimalPlaces="3"
                  />
               </div>
            </div>
         </div>
      </div>
   </UForm>
   <DialogConfirm
      title="เพิ่มเรือใหม่"
      desc="คุณยืนยันการเพิ่มเรือใหม่นี้ใช่หรือไม่"
      icon="warning"
      labelConfirm="ยืนยัน"
      :isDialogOpen="isConfirmDialogOpen"
      :dialogCancel="dialogCancel"
      :dialogConfirm="dialogConfirm"
   />
   <DialogConfirm
      title="ต้องการออกจากหน้านี้"
      desc="คุณยังไม่ได้บันทึกรายการ ข้อมูลคุณอาจสูญหาย"
      icon="warning"
      labelConfirm="ยืนยัน"
      :isDialogOpen="isConfirmLeaveDialogOpen"
      :dialogCancel="handleCancelLeave"
      :dialogConfirm="handleConfirmLeave"
   />
   <DialogConfirm
      title="ยกเลิกการบันทึกข้อมูล"
      desc="คุณยังไม่ได้บันทึกรายการ ข้อมูลคุณอาจสูญหาย"
      icon="warning"
      labelConfirm="ยืนยัน"
      :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)"
      :dialogConfirm="() => navigateTo('/manage-ship-government/list')"
   />
   <DialogAlert
      :isOpen="isAlertDialogOpen"
      :desc="modalAlertMessage"
      title="เพิ่มเรือใหม่"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialog"
      btnName="ปิด"
   />
   <DialogAlert
      :isOpen="isAlertDialogUpdateOpen"
      :desc="modalAlertMessage"
      title="บันทึกตัวแทนเรือ"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialogUpdate"
      btnName="ปิด"
   />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import Input from "~/components/form/u-input.vue";
import NumericInput from "~/components/form/u-numeric-input.vue";
import USelect from "~/components/form/u-select.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";
import FileDropzone from "~/components/form/fileDropzone.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";

import useMasterDataShipService from "~/core/services/masterDataShipService/vesselService";
import type { IVesselGovermentDetail } from "~/core/interfaces/vesselGovernmentService";
import useVesselGovernmentService from "~/core/services/masterDataShipService/vesselGovernmentService";
import { format } from "date-fns";
import VDatepicker from "~/components/form/v-datepicker.vue";
const route = useRoute();

const { t } = useI18n();
const isEdit = route.params.mode === "edit";
const isView = route.params.mode === "view";
const query: any = route.query;
const vesselGovernmentId = (isEdit || isView) && query.id;
const vesselGovernmentService = useVesselGovernmentService();
const masterDataShipService = useMasterDataShipService();

const isLoading = ref(false);

const isConfirmDialogOpen = ref(false);
const isConfirmLeaveDialogOpen = ref(false);
const isConfirmCancelDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const isAlertDialogUpdateOpen = ref(false);
const modalAlertMessage = ref("");
const modalAlertType = ref("");
const nextRoute = ref<any>(null);
const notAllowNavigate = ref(true);

const filesUpload = ref([]);
const errorFileMessage = ref("");
const vesselFlagData = ref({
   avatar: "",
   flagName: "",
});

const createSchema = () => {
   return z.object({
      name: z.string().nonempty({ message: t("please_enter_a_value") }),
      breadthExtreme: z.number().min(1, { message: t("please_enter_a_value") }),
      depth: z.number().min(1, { message: t("please_enter_a_value") }),
      displacement: z.number().min(1, { message: t("please_enter_a_value") }),
      lengthOverall: z.number().min(1, { message: t("please_enter_a_value") }),
      officialNumber: z.string().nonempty({ message: t("please_enter_a_value") }),
      vesselFlagId: z.number().min(1, { message: t("please_enter_a_value") }),
      authority_id: z.number().min(1, { message: t("please_enter_a_value") }),
   });
};

const errors = ref<FormError[]>([]);

const formSchema = ref(createSchema());

const formGroup = ref<IVesselGovermentDetail>({
   name: "",
   breadthExtreme: 0,
   depth: 0,
   lengthOverall: 0,
   officialNumber: "",
   vesselFlagId: 0,
   vesselTypeId: 1,
   displacement: 0,
   fileId: 0,
   authority_id: 0,
   authority_name: "",
   vesselFlagName: "",
});

const payload = ref<IVesselGovermentDetail>({
   name: "",
   breadthExtreme: 0,
   depth: 0,
   lengthOverall: 0,
   officialNumber: "",
   vesselFlagId: 0,
   vesselTypeId: 1,
   displacement: 0,
   fileId: 0,
   authority_id: 0,
   authority_name: "",
   vesselFlagName: "",
});
const authorityList = ref([]);
const vesselOptionsStore = useVesselOptionsStore();

onMounted(async () => {
   // vesselOptionsStore.getVesselTypeOption();
  await vesselOptionsStore.getVesselFlagOption();
   getAuthorityList();
   if (vesselGovernmentId) {
      await getVesselDetailById(+vesselGovernmentId);
   }
   setThaiFlag();
});

onBeforeRouteLeave((to, from, next) => {
   if (notAllowNavigate.value && !isView) {
      isConfirmLeaveDialogOpen.value = true;
      nextRoute.value = to;
      next(false); // Prevent navigation until confirmed
   } else {
      next(); // Allow navigation
   }
});

watch(
   () => formGroup.value.vesselFlagId,
   (value) => {
      if (value) {
         const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value);
         if (findVesselFlag) {
            vesselFlagData.value.avatar = findVesselFlag.path;
            vesselFlagData.value.flagName = findVesselFlag.name;
         }
      }
   }
);
const getVesselDetailById = async (id: number) => {
   try {
      isLoading.value = true;
      const resp = await vesselGovernmentService.getVesselGovernmentDetail(id);

      console.log("res", resp);
      if (resp.statusCode === 200) {
         formGroup.value = resp.data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const getAuthorityList = async () => {
   try {
      isLoading.value = true;
      const resp = await vesselGovernmentService.getAuthority();
      if (resp.statusCode === 200) {
         const { data } = resp;
         authorityList.value = data.map((item: any) => {
            return {
               authority_id: item.id,
               authority_name: item.name,
            };
         });
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const validate = (field: string, valueSelected: any = 0) => {
   const validationErrors: FormError[] = [];

   // Clear previous errors for the specific field and add the new error if any
   errors.value = errors.value.filter((err) => err.path !== field);
   if (validationErrors.length) {
      errors.value.push(...validationErrors);
   }
};

const handleChangeOwner = (value: any) => {
   formGroup.value.owner = value.name;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof formSchema.value>>) {
   const newPayload: IVesselGovermentDetail = {
      ...payload.value,
      ...event.data,
   };
   payload.value = { ...newPayload };
   isConfirmDialogOpen.value = true;
}

const onSearchVesselOwners = async (q: any) => {
   const filter = { q };
   formGroup.value.owner = q;
   const resp = await masterDataShipService.getVesselOwnersOption(filter);
   if (resp.statusCode === 200) {
      return resp.data.map((e: any) => ({ id: e, name: e }));
   }
   return [];
};

const setThaiFlag = async () => {
   formGroup.value.vesselFlagId = 218;
};
const dialogCancel = () => {
   isConfirmDialogOpen.value = false;
};
const dialogConfirm = async () => {
   isLoading.value = true;
   notAllowNavigate.value = false;
   let resp;
   if (vesselGovernmentId) {
      resp = await vesselGovernmentService.putVesselGovernment(vesselGovernmentId, payload.value);
   } else {
      resp = await vesselGovernmentService.postVesselGovernment(payload.value);
   }
   if (resp.statusCode === 200) {
      isAlertDialogOpen.value = true;
      modalAlertMessage.value = "การเพิ่มเรือใหม่ของคุณสำเร็จแล้ว";
      modalAlertType.value = "success";
   } else {
      isAlertDialogOpen.value = true;
      modalAlertMessage.value = resp.message;
      modalAlertType.value = "error";
   }

   isLoading.value = false;
   isConfirmDialogOpen.value = false;
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      navigateTo("/manage-ship-government/list");
   }
   isAlertDialogOpen.value = false;
};

const handleCloseAlertDialogUpdate = () => {
   isAlertDialogUpdateOpen.value = false;
};

const handleConfirmLeave = () => {
   isConfirmLeaveDialogOpen.value = false;
   notAllowNavigate.value = false;
   if (nextRoute.value) {
      navigateTo(nextRoute.value);
   }
};

const handleCancelLeave = () => {
   isConfirmLeaveDialogOpen.value = false;
   nextRoute.value = null;
};

const handleCancleCreateVessel = () => {
   isConfirmCancelDialogOpen.value = true;
   notAllowNavigate.value = false;
};
</script>
