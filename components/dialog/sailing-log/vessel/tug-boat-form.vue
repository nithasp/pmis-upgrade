<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         rounded: 'rounded-xl !max-w-[480px] w-full',
      }"
      :initialFocus="removeAutoFocus"
   >
      <UForm :schema="tugBoatSchema" :state="formData" @submit="onSubmit" class="p-6">
         <img :src="ShipVariant2" alt="ship-variant2-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="mb-1">
               <span class="text-grayy-400 text-lg font-anuphan-semi-bold">{{ props.mode === "create" ? $t("add") : $t("edit") }}{{ $t("tug_boat") }}</span>
            </div>
            <div class="text-[#667085] text-sm">{{ $t("select_tug_boat") }}</div>
         </div>

         <div class="mt-5">
            <div class="gap-x-6 gap-y-5 mb-4">
               <USelectMultiple
                  v-if="props.mode === 'create'"
                  :label="$t('tug_boat')"
                  :options="tugList"
                  placeholder="เรือทัก"
                  multiple
                  searchable
                  v-model="formData.tugs"
                  name="tugs"
                  required
               />

               <SelectMenu
                  v-else
                  :label="$t('tug_boat')"
                  :placeholder="$t('tug_boat')"
                  v-model="tugItem"
                  :options="tugList"
                  class="w-full"
                  required
                  valueAttribute=""
                  @change="handleEditTugItem"
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
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full" type="submit" />
         </div>
      </UForm>
   </UModal>
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import SelectMenu from "~/components/form/u-select.vue";
import USelectMultiple from "~/components/form/u-select-multiple.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import ShipVariant2 from "~/assets/icons/dialog/ship-variant2.png";
import tugService from "~/core/services/masterDataShipService/tugService";

const { t } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { getMasterTug } = tugService();

const props = defineProps({
   isDialogOpen: Boolean,
   mode: String,
   vesselType: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   addData: Function,
   editData: Function,
   editMode: { type: Boolean, default: false },
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
const tugBoatSchema = z.object({
   tugs: z.array(z.number()).min(1, t("required")),
});

const removeAutoFocus = ref(null);
const isLoading = ref<Boolean>(false);

const formData = ref<any>({
   id: 0,
   tugs: [],
});
const tugItem = ref<any>({
   id: 0,
   name: "",
   type: "",
});

const tugList = ref<any>([]);
// const tugListMock = ref([
//    { id: 1, name: "Tug 1", type: "Small Tug1" },
//    { id: 2, name: "Tug 2", type: "Small Tug2" },
//    { id: 3, name: "Tug 3", type: "Small Tug3" },
// ]);

const clearForm = () => {
   formData.value = {
      id: 0,
      tugs: [],
   };
   tugItem.value = {
      id: 0,
      name: "",
      type: "",
   };
};

watch(
   () => props.isDialogOpen,
   (newValue) => {
      if (props.isDialogOpen) {
         getTugList();
         //console.log("item", props.itemId, props.itemData);
         if (props.mode === "edit") {
            const { id, tug_id, tug_name, tug_type } = props.itemData;
            tugItem.value = {
               id: id ? id : 0,
               tug_id: tug_id,
               name: tug_name,
               type: tug_type,
            };

            // Mock validate edit mode
            formData.value = {
               id: 0,
               tugs: [-1],
            };
         }
      } else {
         clearForm();
      }
   }
);

const handleEditTugItem = (item: any) => {
   tugItem.value = {
      id: props.itemData.id ? props.itemData.id : 0,
      tug_id: item.id,
      name: item.name,
      type: item.type,
   };
};

const getTugList = async () => {
   try {
      isLoading.value = true;
      const resp = await getMasterTug();
      if (resp.statusCode === 200) {
         const { data } = resp;
         tugList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

const onSubmit = () => {
   if (props.mode === "create") {
      const matchedTugs = tugList.value.filter((tug: any) => formData.value.tugs.includes(tug.id));
      const body = matchedTugs.map((selectedTug: any) => ({
         id: 0,
         tug_id: selectedTug.id,
         name: selectedTug.name,
         type: selectedTug.type,
      }));
      props.addData!(body);
   } else {
      props.editData!(tugItem.value, props.itemId);
   }
   props.dialogConfirm!(false);
};

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
