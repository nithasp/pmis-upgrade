<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         rounded: 'rounded-xl !max-w-[480px] w-full',
      }"
      :initialFocus="removeAutoFocus"
   >
      <UForm :schema="navigateSchema" :state="formData" @submit="onSubmit" class="p-6">
         <img :src="PortraitVariant" alt="portrait-variant-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="mb-1">
               <span class="text-grayy-400 text-lg font-anuphan-semi-bold">
                  {{ props.mode === 'create' ? $t('add') : $t('edit') }}{{ $t('officer') }}
               </span>
            </div>
            <div class="text-[#667085] text-sm">{{ $t('select_officer') }}</div>
         </div>

         <div class="mt-5">
            <div class="gap-x-6 gap-y-5 mb-4">
               <USelectMultiple
                  v-if="props.mode === 'create'"
                  :label="$t('officer')"
                  :options="pilotList"
                  placeholder="เลือกเจ้าหน้าที่"
                  multiple
                  searchable
                  v-model="formData.pilots"
                  name="pilots"
                  required
               />

               <SelectMenu
                  v-else
                  :label="$t('officer')"
                  :placeholder="$t('officer')"
                  v-model="pilotItem"
                  :options="pilotList"
                  class="w-full"
                  required
                  valueAttribute=""
                  @change="handleEditPilotItem"
               />
            </div>
         </div>

         <div class="mt-8 grid grid-cols-[1fr_1fr] gap-3">
            <UButton
               size="lg"
               color="white"
               variant="solid"
               :label="$t('cancel')"
               block
               class="rounded-lg w-full border border-gray-100 outline-none"
               @click="() => dialogCancel!(false)"
               ref="removeAutoFocus"
            />
            <UButton
               size="lg"
               color="primary"
               variant="solid"
               :label="$t('confirm')"
               block
               class="rounded-lg w-full"
               type="submit"
            />
         </div>
      </UForm>
   </UModal>
   <DialogAlert
      :title="$t('save_title')"
      :desc="$t('save_success')"
      type="success"
      :isOpen="isDialogSuccessOpen"
      :setDialog="handleCloseSuccessDialog"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import SelectMenu from "~/components/form/u-select.vue";
import USelectMultiple from "~/components/form/u-select-multiple.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import PortraitVariant from "~/assets/icons/dialog/portrait-variant.png";
import pilotService from "~/core/services/masterDataShipService/pilotService";

const { getMasterPilot } = pilotService();
const { t } = useI18n();
import { z } from "zod";

const navigateSchema = z.object({
   pilots: z.array(z.number()).min(1, t("required")),
});

const props = defineProps({
   isDialogOpen: Boolean,
   mode: String,
   vesselType: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   addData: Function,
   editData: Function,
   documentId: {
      type: [Number, String],
   },
   itemId: {
      type: [Number, String],
      default: 0,
   },
   itemData: {
      type: Object,
      default: () => ({}),
   },
});

const removeAutoFocus = ref(null);
const isLoading = ref<Boolean>(false);
const isDialogSuccessOpen = ref<boolean>(false);
const pilotList = ref<any>([]);
const formData = ref<any>({
   id: 0,
   pilots: [],
});
const pilotItem = ref<any>({
   id: 0,
   name: "",
   tel: "",
   number: "",
});

const clearForm = () => {
   formData.value = {
      id: 0,
      pilots: [],
   };
   pilotItem.value = {
      id: 0,
      name: "",
      tel: "",
      number: "",
   };
};

watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (props.isDialogOpen) {
         getPilotList();
         if (props.mode === "edit") {
            const { id, pilot_id, pilot_name, pilot_tel, pilot_number } = props.itemData;
            pilotItem.value = {
               id: id ? id : 0,
               pilot_id,
               name: pilot_name,
               tel: pilot_tel,
               number: pilot_number,
            };
            formData.value = {
               id: id,
               pilots: [-1],
            };
         }
      } else {
         clearForm();
      }
   }
);

const handleEditPilotItem = (item: any) => {
   pilotItem.value = {
      id: props.itemData.id ? props.itemData.id : 0,
      pilot_id: item.id,
      name: item.name,
      tel: item.tel,
      number: item.number,
   };
};

const getPilotList = async () => {
   try {
      isLoading.value = true;
      const resp = await getMasterPilot();
      if (resp.statusCode === 200) {
         const { data } = resp;
         pilotList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

const onSubmit = () => {
   if (props.mode === "create") {
      const matchedPilots = pilotList.value.filter((pilot: any) => formData.value.pilots.includes(pilot.id));
      const body = matchedPilots.map((selectedPilot: any) => ({
         id: 0,
         pilot_id: selectedPilot.id,
         name: selectedPilot.name,
         tel: selectedPilot.tel,
         number: selectedPilot.number,
      }));
      props.addData!(body);
   } else {
      props.editData!(pilotItem.value, props.itemId);
   }
   props.dialogConfirm!(false);
};

const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
