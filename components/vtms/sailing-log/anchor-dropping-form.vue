<template>
   <div id="anchor-dropping" class="bg-white p-4 md:p-6">
     <UForm :schema="droppingAnchorSchema" :state="formGroup" @submit="onSubmit">
       <header class="flex flex-col md:flex-row items-center justify-between">
         <div>
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("anchor_ship_info") }}</h1>
           <div class="mt-1 text-[#667085] text-sm">{{ $t("anchor_ship_info_detail") }}</div>
         </div>
         <div class="flex gap-3 mt-4 md:mt-0">
           <UButton
             class="mx-2 border border-grayy-100 w-[67px] h-[36px] justify-center"
             size="md"
             color="gray"
             :label="$t('cancel')"
             @click="$router.push('/vtms/sailing-log')"
           />
           <SaveButton type="submit" />
         </div>
       </header>
 
       <UDivider class="my-6" />
 
       <section id="anchor-dropping-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-6">
         <div class="ship-info-title">
           <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("ship_info") }}</h2>
         </div>
         <div class="ship-info-content mt-4">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
             <InputNumber
               :label="$t('gross_tonnage_confirm')"
               name="gross_tonnage"
               placeholder="0.000"
               v-model="formGroup.gross_tonnage"
               :decimal="3"
               suffix="t"
               required
             />
             <InputNumber
               :label="$t('draft_confirm')"
               name="depth"
               placeholder="0.00"
               v-model="formGroup.depth"
               :decimal="2"
               suffix="m"
               required
             />
             <Select
               :label="$t('last_port')"
               name="port_id_last"
               searchable
               :searchable-placeholder="$t('search')"
               :options="portList"
               v-model="formGroup.port_id_last"
               required
               icon="i-heroicons-magnifying-glass-20-solid"
             />
             <Select
               :label="$t('next_port')"
               name="port_id_next"
               searchable
               :searchable-placeholder="$t('search')"
               :options="portList"
               v-model="formGroup.port_id_next"
               required
             />
             <Input
               :label="$t('voyage')"
               name="voyage"
               :placeholder="$t('search')"
               v-model="formGroup.voyage"
               required
               class="w-full"
             />
           </div>
         </div>
       </section>
 
       <section id="anchor-dropping-section2" class="border rounded-xl border-solid border-[#D0D5DD] p-6 mt-6">
         <div class="flex flex-col md:flex-row items-center justify-between">
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("anchor_ship_info") }}</h1>
           <UButton
             icon="i-heroicons-plus-circle"
             size="md"
             :label="$t('add_anchor')"
             @click="() => handleAnchorDroppingForm(true, 'create')"
           />
         </div>
         <UTable
           :columns="[
             {
               key: 'id',
               label: t('order'),
               class: 'w-[60px] text-center',
             },
             {
               key: 'berth_name',
               label: t('waiting_at_dock'),
               class: 'text-center',
             },
             {
               key: 'pilot_date',
               label: t('pilot_date'),
             },
             {
               key: 'anchor_date',
               label: t('anchor_date'),
             },
             {
               key: 'latitude',
               label: t('anchor_latitude'),
             },
             {
               key: 'longitude',
               label: t('anchor_longitude'),
             },
             {
               key: 'aweigh_date',
               label: t('anchor_removal_date'),
             },
             {
               key: 'remark',
               label: t('remarks'),
             },
             {
               key: 'actions',
               sortable: false,
             },
           ]"
           :rows="anchorsItem"
           :ui="{
             wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
             thead: 'bg-primary-50',
             tbody: 'border-none',
           }"
         >
           <template #id-data="{ index }">
             <div class="text-center">
               {{ index + 1 }}
             </div>
           </template>
 
           <template #pilot_date-data="{ row }">
             <div>{{ convertDateAndTimeStringFormat(row.pilot_date).date }}</div>
             <div class="text-grayy-75">{{ convertDateAndTimeStringFormat(row.pilot_date).time }}</div>
           </template>
 
           <template #anchor_date-data="{ row }">
             <div>{{ convertDateAndTimeStringFormat(row.anchor_date).date }}</div>
             <div class="text-grayy-75">{{ convertDateAndTimeStringFormat(row.anchor_date).time }}</div>
           </template>
 
           <template #aweigh_date-data="{ row }">
             <div>{{ row.aweigh_date ? convertDateAndTimeStringFormat(row.aweigh_date).date : null }}</div>
             <div class="text-grayy-75">
               {{ row.aweigh_date ? convertDateAndTimeStringFormat(row.aweigh_date).time : null }}
             </div>
           </template>
 
           <template #actions-data="{ row, index }">
             <UDropdown :items="getMenuTable(row, index)">
               <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
             </UDropdown>
           </template>
         </UTable>
       </section>
     </UForm>
   </div>
   <AnchorDroppingForm
     :isDialogOpen="isDialogAnchorDroppingFormOpen"
     :dialogCancel="dialogAnchorDroppingCancel"
     :dialogConfirm="dialogAnchorDroppingConfirm"
     :actionMode="actionMode"
     :itemId="documentId"
     :selectedAnchor="selectedAnchor"
     :selectedAnchorIndex="selectedAnchorIndex"
   />
   <DialogConfirm
     :icon="dialogConfirmProps.icon"
     :title="dialogConfirmProps.title"
     :desc="dialogConfirmProps.desc"
     :labelConfirm="$t('confirm')"
     :isDialogOpen="isDialogConfirmOpen"
     :dialogCancel="dialogCancel"
     :dialogConfirm="dialogConfirm"
   />
   <DialogAlert
     :title="dialogAlertProps.title"
     :desc="dialogAlertProps.desc"
     :type="dialogAlertProps.type"
     :isOpen="isDialogAlertOpen"
     :setDialog="handleCloseDialogAlert"
   />
   <Loading v-if="isLoading" />
 </template>
 

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import InputNumber from "~/components/form/input-number.vue";
import Select from "~/components/form/u-select.vue";
import SaveButton from "~/components/button/save.vue";
import AnchorDroppingForm from "~/components/dialog/sailing-log/anchor-dropping-form.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";

import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";

import useDocumentService from "~/core/services/documentService";
const documentService = useDocumentService();

import usePortService from "~/core/services/masterDataShipService/port/portService";
const { getPort } = usePortService();

import useAnchorService from "~/core/services/vtms/anchorService";
const anchorService = useAnchorService();

import useLogBookService from "~/core/services/vtms/logBookService";
const logBookService = useLogBookService();

const documentOptionsStore = useDocumentOptionsStore();

import { useVtmsStore } from "~/stores/vtmsStore";
const vtmsStore = useVtmsStore();

const { t } = useI18n();
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const droppingAnchorSchema = z.object({
   gross_tonnage: z
    .union([z.string().min(1, { message: t("required") }), z.number()])
    .refine(
      (value) =>
        (typeof value === "string" && value.trim() !== "" && !value.startsWith("0")) || 
        (typeof value === "number" && value > 0),
      { message: t("required") }
    ),
  depth: z
    .union([z.string().min(1, { message: t("required") }), z.number()])
    .refine(
      (value) =>
        (typeof value === "string" && value.trim() !== "" && !value.startsWith("0")) || 
        (typeof value === "number" && value > 0),
      { message: t("required") }
    ),
   port_id_last: z.number().min(1, { message: t("required") }),
   port_id_next: z.number().min(1, { message: t("required") }),
   voyage: z.string().min(1, t("required")),
});

const props = defineProps({
   documentId: Number || String,
});

onMounted(() => {
   getDocumentDetail();
   getPortList();
   //getVtmsLogBookBerthDetail();
   getVtmsAnchorDocument();
});

const formGroup = ref<any>({
   gross_tonnage: 0,
   depth: 0,
   port_id_last: 0,
   port_id_next: 0,
   voyage: "",
   anchors: [],
});
const actionMode = ref<string>("");
const isLoading = ref<boolean>(false);
const portList = ref<any>([]);
const vesselId = ref<number>(0);
const documentBerthId = ref<number>(0);
const selectedAnchor = ref<any>(null);
const selectedAnchorIndex = ref<number>(0);
const anchorsItem = ref<any>([]);

const getPortList = async () => {
   const res = await getPort();
   if (res.statusCode === 200) {
      portList.value = res.data.data;
   }
};

const getVtmsLogBookBerthDetail = async () => {
   const res = await logBookService.getVtmsLogBookBerthDetail(props.documentId!);
   if (res.statusCode === 200) {
      documentBerthId.value = res.data[0]?.doc_berth_id;
   }
}

const getVtmsAnchorDocument = async () => {
   const res = await anchorService.getVtmsAnchorDocument(props.documentId!);
   if (res.statusCode === 200) {
      formGroup.value.gross_tonnage = getInputDecimal(res.data.gross_tonnage?.toString(), 3);
      formGroup.value.depth = getInputDecimal(res.data.depth?.toString(), 2);
      formGroup.value.port_id_last = res.data.port_id_last;
      formGroup.value.port_id_next = res.data.port_id_next;
      formGroup.value.voyage = res.data.voyage;
      anchorsItem.value = res.data.anchors ? res.data.anchors : [];
   }
}

const getDocumentDetail = async () => {
   isLoading.value = true;
   const resp = await documentService.getDocumentDetail(props.documentId!);
   if (resp.statusCode === 200) {
      documentBerthId.value = props.documentId!;
      vesselId.value = resp.data.vessel.vesselId;
      vtmsStore.setVtmsDocumentStatus(resp.data.status);
      vtmsStore.getVtmsTab();
   }
   isLoading.value = false;
};

async function onSubmit(event: FormSubmitEvent<z.output<typeof droppingAnchorSchema>>) {
   dialogConfirmProps.value = {
      title: t("add_vessel_agent"),
      desc: t("confirm_add_vessel_agent"),
      icon: "warning",
   };
   isDialogConfirmOpen.value = true;
}

const handleAddVtmsAnchor = async () => {
   isLoading.value = true;

   const payload = {
      ...formGroup.value,
      document_id: documentBerthId.value,
      vessel_id: vesselId.value,
      gross_tonnage: removeCommaAndConvertToNumber(formGroup.value.gross_tonnage),
      depth: removeCommaAndConvertToNumber(formGroup.value.depth),
      anchors: anchorsItem.value.map(({ berth_name, ...allProperty }: any) => allProperty)
   };

   const resp = await anchorService.addVtmsAnchor(payload);
   if (resp.statusCode === 200) {
      dialogAlertProps.value = {
         title: t("save_title"),
         desc: t("save_success"),
         type: "success",
      };
      isDialogAlertOpen.value = true;
      isDialogConfirmOpen.value = false;
   } else {
      dialogAlertProps.value = {
         title: t("error_title"),
         desc: t("error_try_again"),
         type: "danger",
      };
      isDialogAlertOpen.value = true;
      isDialogConfirmOpen.value = false;
   }
   isLoading.value = false;
};

const isDialogAnchorDroppingFormOpen = ref(false);
const handleAnchorDroppingForm = (status: boolean, mode: string, anchorIndex: number = -1) => {
   actionMode.value = mode;
   isDialogAnchorDroppingFormOpen.value = status;
   if (mode === "create") {
      selectedAnchor.value = "";
      selectedAnchorIndex.value = -1;
   } else {
      selectedAnchorIndex.value = anchorIndex;
   }
};
const dialogAnchorDroppingCancel = () => {
   isDialogAnchorDroppingFormOpen.value = false;
};

const dialogAnchorDroppingConfirm = (status: boolean, type: string = "", anchorItem: any, anchorIndex: number) => {
   isDialogAnchorDroppingFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getAnchorDroppingList();
   }
   if (type === "create") {
      anchorsItem.value.push(anchorItem);
   } else {
      anchorsItem.value[anchorIndex] = anchorItem;
   }
};

const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};

const dialogAlertProps = ref({
   title: "",
   desc: "",
   type: "",
});
const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
};

const dialogConfirmProps = ref({
   title: "",
   desc: "",
   icon: "",
});
const isDialogConfirmOpen = ref(false);
const dialogCancel = () => {
   isDialogConfirmOpen.value = false;
};
const dialogConfirm = () => {
   handleAddVtmsAnchor();
};

const getMenuTable = (row: any, index: number) => {
   const { status } = row;
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               handleAnchorDroppingForm(true, "edit", index);
               selectedAnchor.value = row;
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               anchorsItem.value.splice(index, 1);
            },
         },
      ],
   ];
   return items;
};
</script>
