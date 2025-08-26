<template>
   <UModal
      :modelValue="isDialogOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[400px]',
         rounded: 'rounded-xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <UForm :schema="portSchema" :state="form" @submit="onSubmit" class="p-6">
         <img :src="ShipVariant2Icon" alt="ship-variant2-icon" class="w-12 h-12" />

         <div class="mt-5">
            <div class="text-grayy-400 text-lg font-anuphan-semi-bold mb-1">{{ $t("ship_port_info") }}</div>
            <div class="text-[#667085] text-sm">{{ $t("specify_port_details") }}</div>
         </div>

         <Input label="LOCODE" name="locode" placeholder="LOCODE" v-model="form.locode" required class="mt-5" />

         <Input :label="$t('port_name')" name="name" :placeholder="$t('port_placeholder')" v-model="form.name" required class="mt-5" />

         <Select
            :label="$t('country')"
            name="country_id"
            :placeholder="$t('country_placeholder')"
            :options="countryOption"
            v-model="form.country_id"
            required
            searchable
            :searchable-placeholder="$t('search_province')"
            class="mt-5"
         />

         <div class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton
               size="lg"
               color="white"
               variant="solid"
               :label="$t('cancel')"
               block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
               @click="() => dialogCancel!(false)"
               ref="removeAutoFocus"
            />
            <UButton size="lg" color="primary" variant="solid" :label="$t('confirm')" block class="rounded-lg w-full sm:w-[170px]" type="submit" />
         </div>
      </UForm>
   </UModal>
   <DialogAlert :title="$t('save_title')" :desc="$t('save_success')" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Loading from "~/components/loading.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import ShipVariant2Icon from "~/assets/icons/dialog/ship-variant2.png";

import usePortService from "~/core/services/masterDataShipService/port/portService";
import useMasterDataService from "~/core/services/masterDataService";
const { getCountries } = useMasterDataService();
const { addPort, updatePort, getPortDetail } = usePortService();
const { t, locale } = useI18n();

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { ICountries } from "~/core/interfaces/ICountries";
import type { IPortAdd, IPortUpdate } from "~/core/interfaces/IPort";

const portSchema = z.object({
   locode: z.string().min(1, t("required")),
   name: z.string().min(1, t("required")),
   country_id: z.number().min(1, { message: t("required") }),
});

const props = defineProps({
   isDialogOpen: Boolean,
   mode: String,
   title: String,
   desc: String,
   icon: String,
   labelCancel: String,
   labelConfirm: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   itemId: Number,
});

watch(
   () => props.isDialogOpen,
   (newValue) => {
      resetForm();
      if (props.isDialogOpen) {
         getCountriesOptions();
         if (props.mode === "edit") {
            handleGetPortDetail();
         }
      }
   }
);

const toast = useToast();
const removeAutoFocus = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const countryOption = ref<ICountries[]>([]);
const form = ref<IPortAdd | IPortUpdate>({
   locode: "",
   name: "",
   country_id: 0,
});

const resetForm = () => {
   form.value.locode = "";
   form.value.name = "";
   form.value.country_id = 0;
};

const getCountriesOptions = async () => {
   const resp = await getCountries();
   if (resp.statusCode === 200) {
      countryOption.value = resp.data.map((item: ICountries) => ({ id: item.id, name: locale.value === "en" ? item.nameEn : item.nameTh }));
   }
};

const handleGetPortDetail = async () => {
   isLoading.value = true;
   const resp = await getPortDetail(props.itemId!);
   if (resp.statusCode === 200) {
      form.value = {
         ...resp.data,
         // locode: "locode test",
      };
   } else {
      console.error("get port detail error:", resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof portSchema>>) {
   isLoading.value = true;
   const resp = props.mode === "edit" ? await updatePort(props.itemId!, form.value) : await addPort(form.value);
   if (resp.statusCode === 200) {
      isDialogSuccessOpen.value = true;
      props.dialogConfirm!(false, "refresh");
   } else {
      console.error(`${props.mode === "edit" ? "update" : "add"} port error:`, resp);
      toast.add({ title: resp?.message, color: "red" });
   }
   isLoading.value = false;
}

const isDialogSuccessOpen = ref<boolean>(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
</script>
