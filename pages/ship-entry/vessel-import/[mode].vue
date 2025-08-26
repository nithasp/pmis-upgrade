<template>
   <h1 class="font-anuphan-semi-bold text-2xl md:text-[30px] text-black py-4">
     {{ $t("vessel_import_list") }}
   </h1>
   <UForm
     id="vessel-import-form"
     class="bg-white p-6"
     :state="formGroup"
     @submit="onSubmit"
     v-on:error="handleFormError"
   >
     <header class="flex flex-col md:flex-row items-center justify-between">
       <div>
         <div class="flex gap-4 flex-wrap">
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
             {{ $t("vessel_import_data") }}
           </h1>
           <BadgeVesselImport
             v-if="isEdit"
             :label="formGroup.statusDes"
             :type="formGroup.status"
           />
         </div>
         <p class="mt-1 text-[#667085] text-sm">
           {{ $t("vessel_import_specify_details") }}
         </p>
       </div>
       <div class="flex gap-2 mt-4 md:mt-0">
         <UButton
           v-if="isEdit"
           class="mx-2 border border-error-500 text-error-500 bg-white hover:bg-white w-[67px] h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('cancel')"
           @click="() => handleDialogConfirm(true, 'delete')"
         />
         <UButton
           v-else
           class="mx-2 border border-grayy-100 w-[67px] h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('close')"
           @click="$router.push('/ship-entry/vessel-import')"
         />
         <UButton
           class="mx-2 border border-primaryy-500 bg-primaryy-500 hover:bg-primaryy-500 text-grayy-25 w-[82px] h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('submit')"
           type="submit"
         />
       </div>
     </header>
 
     <div v-if="formGroup.status === 'PendingEdit'" class="notes mt-5">
       <p v-for="(item, indexMenu) in formGroup.notes" :key="`note-${indexMenu}`" class="mb-2 text-error-500">
         {{ item.note }}
       </p>
     </div>
 
     <UDivider class="m-[22px_0_24px_0]" />
 
     <section id="request-form-section1" class="border rounded-xl border-solid border-[#D0D5DD] p-8">
       <div class="ship-info-title">
         <h2 class="font-anuphan-semi-bold text-base text-gray-400">
           {{ $t("ship_info") }}
         </h2>
       </div>
       <div class="ship-info-content mt-4">
         <UFormGroup v-if="!isEdit" :label="$t('vn_imo_on')" class="mb-4">
           <UInputMenu
             v-model="vesselSearchDisplay"
             size="md"
             variant="outline"
             color="purple"
             icon="i-heroicons-magnifying-glass-20-solid"
             :search="onSearchVessels"
             @change="handleChangeVessel"
             :placeholder="$t('search')"
             option-attribute="name"
           >
             <template #leading>
               <NuxtIcon name="search" size="xl" />
             </template>
           </UInputMenu>
         </UFormGroup>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_name") }}</h3>
             <div class="text-grayy-75">{{ formGroup.vesselName || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_type") }}</h3>
             <div class="text-grayy-75">{{ formGroup.vesselTypeName || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_registration_number") }}</h3>
             <div class="text-grayy-75">{{ formGroup.officialNumber || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("imo_number") }}</h3>
             <div class="text-grayy-75">{{ formGroup.imoNumber || "-" }}</div>
           </div>
           <div>
             <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("ship_nationality_flag") }}</h3>
             <div class="text-grayy-75 flex gap-2 mt-1">
               <img
                 v-if="formGroup.vesselFlagImage"
                 :src="formGroup.vesselFlagImage"
                 :alt="formGroup.vesselFlagName"
                 class="w-6 h-6 rounded-full"
               />
               <span>{{ formGroup.vesselFlagName || "-" }}</span>
             </div>
           </div>
           <div>
             <InputNumber
               :label="$t('gross_tonnage_confirm')"
               name="grossTonnage"
               placeholder="0.000"
               v-model="formGroup.grossTonnage"
               :decimal="3"
               suffix="t"
               required
               class="w-full max-w-[486px]"
               :error="isFieldError('grossTonnage') ? fieldValidation.grossTonnage.message : ''"
             />
           </div>
         </div>
 
         <UDivider class="my-4" />

         <div>
           <h2 class="font-anuphan-semi-bold text-base text-gray-400 mb-4">{{ $t("port_info") }}</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="max-w-[486px]">
               <div v-if="!isEdit">
                 <Select
                   :label="$t('berth')"
                   name="berthId"
                   :placeholder="$t('search')"
                   :options="documentOptionsStore.berthsOption"
                   v-model="formGroup.berthId"
                   required
                   @change="(berthId: number) => getJetty(berthId, 'change')"
                   :error="isFieldError('berthId') ? fieldValidation.berthId.message : ''"
                 />
               </div>
               <div v-else>
                 <h3 class="font-anuphan-medium text-sm text-gray-400">{{ $t("port") }}</h3>
                 <div class="text-grayy-75">{{ formGroup.berthName || "-" }}</div>
               </div>
             </div>
             <div class="max-w-[486px]">
               <Select
                 :label="$t('jetty')"
                 name="jettyId"
                 :placeholder="$t('search')"
                 required
                 :searchable-placeholder="$t('search')"
                 v-model="formGroup.jettyId"
                 searchable
                 :options="jettyList"
                 :disabled="!jettyList.length"
                 :error="isFieldError('jettyId') ? fieldValidation.berthId.message : ''"
               />
             </div>
             <div class="max-w-[486px]">
               <UFormGroup :label="$t('vessel_date_and_time_mooring')" required>
                 <UPopover :popper="{ placement: 'bottom-start' }">
                   <Input
                     name="mooringDate"
                     size="md"
                     variant="outline"
                     color="purple"
                     custom-icon="calendar"
                     v-model="formGroup.mooringDate"
                     :value="formGroup.mooringDate ? format(new Date(formGroup.mooringDate), 'd MMM, yyyy, HH:mm') : ''"
                     :placeholder="$t('vessel_date_and_time_mooring')"
                     :error="isFieldError('mooringDate') ? fieldValidation.mooringDate.message : ''"
                     :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                   />
 
                   <template #panel="{ close }">
                     <Datepicker
                       v-model="mooringDate"
                       @close="close"
                       is-required
                       is24hr
                       type="normal"
                       mode="dateTime"
                       v-on:date-change="onMooringDateChange"
                     />
                   </template>
                 </UPopover>
               </UFormGroup>
             </div>
             <div class="max-w-[486px]">
               <UFormGroup :label="$t('vessel_date_and_time_departure')" required>
                 <UPopover :popper="{ placement: 'bottom-start' }">
                   <Input
                     name="unmooringDate"
                     size="md"
                     variant="outline"
                     color="purple"
                     custom-icon="calendar"
                     v-model="formGroup.unmooringDate"
                     :value="formGroup.unmooringDate ? format(new Date(formGroup.unmooringDate), 'd MMM, yyyy, HH:mm') : ''"
                     :placeholder="$t('vessel_date_and_time_departure')"
                     :error="isFieldError('unmooringDate') ? fieldValidation.unmooringDate.message : ''"
                     :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                   />
 
                   <template #panel="{ close }">
                     <Datepicker
                       v-model="unmooringDate"
                       @close="close"
                       is-required
                       is24hr
                       type="normal"
                       mode="dateTime"
                       v-on:date-change="onUnmooringDateChange"
                     />
                   </template>
                 </UPopover>
               </UFormGroup>
             </div>
           </div>
         </div>
 
         <UDivider class="my-4" />

         <div id="product-list">
           <div class="flex flex-col md:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("cargo_list") }}
             </h1>
             <UButton
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('add_cargo')"
               @click="() => handleVesselImportProductForm(true, 'create', 'vessel-in')"
               class="mt-2 md:mt-0"
             />
           </div>
           <UTable
             :rows="productList"
             :columns="columnsProductTable"
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template
               v-for="key in ['purposeTypeId', 'cargoTypeId', 'cargoWharfageId', 'productId', 'productGroupId', 'productTypeId', 'countryId']"
               #[`${key}-data`]="{ row }"
             >
               <div>{{ renderOption(key, row[key]) }}</div>
             </template>
             <template #mTonQty-data="{ row }">
               <div>{{ getInputDecimal(row.mTonQty?.toString(), 3) }}</div>
             </template>
             <template #rTonQty-data="{ row }">
               <div>{{ getInputDecimal(row.rTonQty?.toString(), 3) }}</div>
             </template>
             <template #actions-data="{ row, index }">
               <div class="text-right">
                 <UDropdown :items="getProductListMenuTable(row, index)">
                   <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                 </UDropdown>
               </div>
             </template>
           </UTable>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">
                 {{ $t("total_mt_cargo") }}
               </h3>
               <div class="text-grayy-75">
                 {{ totalMTonQty().toFixed(3) }} M/Ton
               </div>
             </div>
             <div>
               <h3 class="font-anuphan-medium text-sm text-gray-400">
                 {{ $t("total_rt_cargo") }}
               </h3>
               <div class="text-grayy-75">
                 {{ totalRTonQty().toFixed(3) }} R/Ton
               </div>
             </div>
           </div>
         </div>
 
         <UDivider class="my-4" />
 
         <section id="passanger-table" class="mt-6">
           <div class="flex flex-col md:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("รายการผู้โดยสาร") }}
             </h1>
             <UButton
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('เพิ่มผู้โดยสาร')"
               @click="() => handlePassengerDroppingForm(true, 'create')"
               class="mt-2 md:mt-0"
             />
           </div>
           <UTable
             :columns="[
               { key: 'id', label: t('order'), class: 'w-[60px] text-center' },
               { key: 'purposeTypeId', label: t('วัตถุประสงค์'), class: '' },
               { key: 'detail', label: t('รายละเอียด') },
               { key: 'passengers', label: t('จำนวนผู้โดยสาร') },
               { key: 'actions', sortable: false }
             ]"
             :rows="passengerList"
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #purposeTypeId-data="{ row }">
               <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
             </template>
             <template #actions-data="{ row, index }">
               <div class="text-right">
                 <UDropdown :items="getPassengerListMenuTable(row, index)">
                   <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                 </UDropdown>
               </div>
             </template>
           </UTable>
         </section>
 
         <UDivider class="my-4" />

         <section id="sparepart-table" class="mt-6">
           <div class="flex flex-col md:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("รายการ Spare Part") }}
             </h1>
             <UButton
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('เพิ่ม Spare Part')"
               @click="() => handleSparePartForm(true, 'create')"
               class="mt-2 md:mt-0"
             />
           </div>
           <UTable
             :columns="[
               { key: 'id', label: t('order'), class: 'w-[60px] text-center' },
               { key: 'purposeTypeId', label: t('วัตถุประสงค์'), class: '' },
               { key: 'detail', label: t('รายละเอียด') },
               { key: 'actions', sortable: false }
             ]"
             :rows="sparePartList"
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #purposeTypeId-data="{ row }">
               <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
             </template>
             <template #actions-data="{ row, index }">
               <div class="text-right">
                 <UDropdown :items="getSparePartListMenuTable(row, index)">
                   <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                 </UDropdown>
               </div>
             </template>
           </UTable>
         </section>
 
         <UDivider class="my-4" />

         <section id="other-table" class="mt-6">
           <div class="flex flex-col md:flex-row items-center justify-between">
             <h1 class="font-anuphan-semi-bold text-lg text-gray-400">
               {{ $t("รายการอื่นๆ") }}
             </h1>
             <UButton
               icon="i-heroicons-plus-circle"
               size="md"
               :label="$t('เพิ่มอื่นๆ')"
               @click="() => handleOtherForm(true, 'create')"
               class="mt-2 md:mt-0"
             />
           </div>
           <UTable
             :columns="[
               { key: 'id', label: t('order'), class: 'w-[60px] text-center' },
               { key: 'purposeTypeId', label: t('วัตถุประสงค์'), class: '' },
               { key: 'detail', label: t('รายละเอียด') },
               { key: 'actions', sortable: false }
             ]"
             :rows="otherList"
             :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6 overflow-x-auto',
               thead: 'bg-primary-50 whitespace-nowrap',
               tbody: 'border-none'
             }"
           >
             <template #id-data="{ index }">
               <div class="text-center">{{ index + 1 }}</div>
             </template>
             <template #purposeTypeId-data="{ row }">
               <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
             </template>
             <template #actions-data="{ row, index }">
               <div class="text-right">
                 <UDropdown :items="getOtherListMenuTable(row, index)">
                   <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                 </UDropdown>
               </div>
             </template>
           </UTable>
         </section>
 
         <UDivider class="mb-4 mt-8" />

         <div class="mb-4">
           <h2 class="font-bold text-grayy-400">
             นำเข้าเอกสารประกอบดังต่อไปนี้
           </h2>
           <span class="text-grayy-500 mr-2 my-3">
             รองรับสกุลไฟล์ .pdf และอัปโหลดไฟล์ไม่เกิน 10 MB
           </span>
         </div>
         <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <template v-for="fileType in fileTypes" :key="fileType.key">
             <UFormGroup
               v-if="fileType.isDisplay"
               :label="$t(`${fileType.name}`)"
               :name="fileType.key"
               :required="fileType.key !== 'otherFile'"
               :error="getFieldError(fileType.key)"
             >
               <div class="flex space-x-2">
                 <div class="relative">
                   <UButton
                     :for="fileType.key"
                     class="whitespace-nowrap"
                     size="md"
                     label="แนบไฟล์"
                     icon="i-heroicons-paper-clip-solid"
                     @click="() => selectFile(fileType.key)"
                   />
                   <input
                     type="file"
                     :ref="(el) => (inputRefs[fileType.key] = el)"
                     :id="`input_file_${fileType.key}`"
                     @change="(e) => handleFileUpload(e, fileType.key)"
                     class="file-input hidden w-[102px]"
                     accept="application/pdf"
                     :name="fileType.key"
                   />
                 </div>
                 <div
                   v-if="formGroup[fileType.key] && !formGroup[fileType.key].isDelete"
                   :class="`file-info flex items-center w-full border border-solid border-grayy-100 pl-2 pr-1 min-h-[36px] rounded`"
                 >
                   <a
                     :href="formGroup[fileType.key].filePath"
                     target="_blank"
                     class="flex-1"
                   >
                     {{ formGroup[fileType.key].fileName }}
                   </a>
                   <UButton
                     variant="link"
                     size="sm"
                     color="primary"
                     icon="i-heroicons-x-circle"
                     @click="() => onRemoveFile(fileType.key)"
                   />
                 </div>
               </div>
             </UFormGroup>
           </template>
         </div>
 
         <UDivider class="mb-4" />

         <div>
           <h1 class="font-anuphan-semi-bold text-lg text-gray-400 mb-2">
             {{ $t("remark") }}
           </h1>
           <Input name="note" :placeholder="$t('remark')" v-model="formGroup.note" class="w-full" />
         </div>
       </div>
     </section>
   </UForm>

   <DialogConfirm
     :icon="dialogConfirmProps.icon"
     :title="dialogConfirmProps.title"
     :desc="dialogConfirmProps.desc"
     :type="dialogConfirmProps.type"
     :colorConfirm="dialogConfirmProps.colorConfirm"
     :labelCancel="$t('cancel')"
     :labelConfirm="$t('confirm')"
     :isDialogOpen="isDialogConfirmOpen"
     :dialogCancel="dialogConfirmCancel"
     :dialogConfirm="dialogConfirm"
   />
   <DialogAlert
     :title="dialogAlertProps.title"
     :desc="dialogAlertProps.desc"
     :type="dialogAlertProps.type"
     :isOpen="isDialogAlertOpen"
     :setDialog="handleCloseDialogAlert"
     :btnName="$t('close')"
   />
   <VesselImportEditForm
     :isDialogOpen="isDialogVesselImportEditFormOpen"
     :dialogCancel="dialogVesselImportEditCancel"
     :dialogConfirm="dialogVesselImportEditConfirm"
     :itemData="formGroup"
   />
   <VesselImportProductForm
     :isDialogOpen="isDialogProductVesselImportFormOpen"
     :dialogCancel="dialogProductVesselImportCancel"
     :dialogConfirm="dialogProductVesselImportConfirm"
     :addData="addProduct"
     :editData="editProduct"
     :mode="actionMode"
     :itemId="itemIndexProduct"
     :itemData="itemDataProduct"
     :vesselType="vesselType"
   />
   <VesselImportUploadFileForm
     :isDialogOpen="isDialogUploadFileFormOpen"
     :dialogCancel="dialogUploadFileCancel"
     :dialogConfirm="dialogUploadFileConfirm"
   />
   <VesselImportPassengerForm
     :isDialogOpen="isDialogPassengerDroppingFormOpen"
     :dialogCancel="dialogPassengerDroppingCancel"
     :dialogConfirm="dialogPassengerDroppingConfirm"
     :actionMode="actionMode"
     :itemId="passengerItemId"
     :selectedPassenger="selectedPassenger"
     :selectedPassengerIndex="selectedPassengerIndex"
   />
   <VesselImportSparePartForm
     :isDialogOpen="isDialogSparePartFormOpen"
     :dialogCancel="dialogSparePartCancel"
     :dialogConfirm="dialogSparePartConfirm"
     :actionMode="actionMode"
     :itemId="sparePartItemId"
     :selectedSparePart="selectedSparePart"
     :selectedSparePartIndex="selectedSparePartIndex"
   />
   <VesselImportOtherForm
     :isDialogOpen="isDialogOtherFormOpen"
     :dialogCancel="dialogOtherCancel"
     :dialogConfirm="dialogOtherConfirm"
     :actionMode="actionMode"
     :itemId="otherItemId"
     :selectedOther="selectedOther"
     :selectedOtherIndex="selectedOtherIndex"
   />
   <Loading v-if="isLoading" />
 </template>
 

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import InputNumber from "~/components/form/input-number.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeVesselImport from "~/components/badge/badgeVesselImport.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import Loading from "~/components/loading.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import VesselImportEditForm from "~/components/dialog/ship-table/vessel-import/vessel-import-edit-form.vue";
import VesselImportProductForm from "~/components/dialog/ship-table/vessel-import/vessel-import-product-form.vue";
import VesselImportUploadFileForm from "~/components/dialog/ship-table/vessel-import/vessel-import-upload-file-form.vue";
import VesselImportPassengerForm from "~/components/dialog/ship-table/vessel-import/vessel-import-passenger-form.vue";
import VesselImportSparePartForm from "~/components/dialog/ship-table/vessel-import/vessel-import-spare-part-form.vue";
import VesselImportOtherForm from "~/components/dialog/ship-table/vessel-import/vessel-import-other-form.vue";
import { useDocumentStore } from "~/stores/documentStore";
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const addressOptionsStore = useAddressOptionsStore();
const documentOptionsStore = useDocumentOptionsStore();
import useVesselImportService from "~/core/services/vesselImport";
const vesselImportService = useVesselImportService();

import useVesselService from "~/core/services/vesselService";
const vesselService = useVesselService();

import useBerthService from "~/core/services/masterDataShipService/port/berthService";
const berthService = useBerthService();

import useMasterDataService from "~/core/services/masterDataService";
const masterDataService = useMasterDataService();

import type { IJetty } from "~/core/interfaces/IBerth";
import { format } from "date-fns";
import type { IVesselImportEdit } from "~/core/interfaces/IVesselImport";
import type { IVesselData } from "~/core/interfaces/IVesselData";

const documentStore = useDocumentStore();
const authStore = useAuthStore();
const { t, locale } = useI18n();

const itemIndexProduct = ref<number>(0);
const itemDataProduct = ref();
const vesselImportSchema = z.object({});

const passengerItemId = ref<any>(null);
const selectedPassenger = ref<any>(null);
const selectedPassengerIndex = ref<number>(0);

const dialogConfirmProps = ref<any>({
   title: "",
   desc: "",
   type: "",
   icon: "",
   colorConfirm: "",
});
const dialogAlertProps = ref<any>({
   title: "",
   desc: "",
   type: "",
});

const mooringDate = ref<any>(new Date());
const unmooringDate = ref<any>(new Date());

const route = useRoute();
const query: any = route.query;
const vesselImportId = ref(query.id);
const isEdit = route.params.mode === "edit";
const isLoading = ref<boolean>(false);
const formGroup = ref<any>({
   id: 0,
   vesselId: 0,
   vesselName: "",
   imoNumber: "",
   officialNumber: "",
   vesselFlagId: 0,
   vesselFlagName: "",
   vesselFlagImage: "",
   vesselTypeId: 0,
   vesselTypeName: "",
   grossTonnage: "",
   mooringDate: null,
   unmooringDate: null,
   berthId: 0,
   berthName: "",
   jettyId: 0,
   jettyName: "",
   note: "",
   notes: [],
   status: "",
   statusDes: "",
   files: [],
   products: [],
   logBook: {
      id: 0,
      status: "",
      voyage: "",
      gross_tonnage: 0,
      depth: 0,
      port_id_next: 0,
      port_name_next: "",
      port_id_last: 0,
      port_name_last: "",
      document_berth_id: null,
      document_number: "",
      vessel: {
         id: 0,
         owner: "",
         vessel_flag: {
            id: 0,
            name: "",
            image_path: "",
         },
         name: "",
         vessel_type: "",
         imo_number: "",
         mmsi_number: "",
         official_number: "",
         call_sign: "",
         license_expired_date: null,
         load_weight: 0,
         gross_tonnage: 0,
         net_tonnage: 0,
         length_overall: 0,
         breadth_extreme: 0,
         depth: 0,
         main_engine: "",
         band_and_model: "",
      },
      details: {
         berth_id: 0,
         berth_name: "",
         purpose_id: 0,
         purpose_name: "",
         cargo_type_id: 0,
         cargo_type_name: "",
         cargo_wharfage_id: 0,
         cargo_wharfage_name: "",
         jetty_id: 0,
         jetty_name: "",
         mooring_date: null,
         departure_date: null,
      },
      create_date: null,
      tugs: null,
      pilots: null,
      products: null,
      agency_name: "",
   },

   statementFile: null,
   shipFile: null,
   cargoManifestFile: null,
   surveyorFile: null,
   certificateQuantityFile: null,
   berthBookingRequestFile: null,
   otherFile: null,
});
const isDocumentBerthOfficer = authStore.profileUser?.roleType === "DocumentBerthOfficer";
const isDocumentBerthOfficerMIT = authStore.profileUser?.roleType === "DocumentBerthOfficerMIT";
const isDocumentBerthOfficerTCT = authStore.profileUser?.roleType === "DocumentBerthOfficerTCT";
const isDocumentBerthOfficerTTT = authStore.profileUser?.roleType === "DocumentBerthOfficerTTT";
const columnsProductTable = ref<any>([]);
const jettyList = ref<IJetty[]>([]);
const productList = ref<any>([]);
const productListDeletedItem = ref<any>([]);

const passengerList = ref<any>([]);
const passengerDeletedItem = ref<any>([]);

const sparePartList = ref<any[]>([]);
const sparePartDeletedItem = ref<any[]>([]);
const sparePartItemId = ref<any>(null);
const selectedSparePart = ref<any>(null);
const selectedSparePartIndex = ref<number>(0);

const otherList = ref<any[]>([]);
const otherDeletedItem = ref<any[]>([]);
const otherItemId = ref<any>(null);
const selectedOther = ref<any>(null);
const selectedOtherIndex = ref<number>(0);

const uploadFilesDeletedItem = ref<any>([]);
const fileTypes = ref([
   { key: "statementFile", name: "Statement/BL&Timesheet", isDisplay: true },
   { key: "shipFile", name: "Ship’s Particular", isDisplay: true },
   { key: "cargoManifestFile", name: "Cargo Manifest", isDisplay: isDocumentBerthOfficerTCT || isDocumentBerthOfficerMIT ? true : false },
   { key: "surveyorFile", name: "Surveyor/Invoice", isDisplay: !isDocumentBerthOfficerTCT || !isDocumentBerthOfficerMIT ? true : false },
   { key: "certificateQuantityFile", name: "Certificate of Quantity (CoQ)", isDisplay: isDocumentBerthOfficerTTT ? true : false },
   { key: "berthBookingRequestFile", name: "ใบขอจองท่าเรือ", isDisplay: isDocumentBerthOfficerTCT || isDocumentBerthOfficerMIT ? true : false },
   { key: "otherFile", name: "เอกสารอื่นๆ", isDisplay: true },
]);
const statementFileInit = ref<any>(null);
const shipFileInit = ref<any>(null);
const cargoManifestFileInit = ref<any>(null);
const surveyorFileInit = ref<any>(null);
const certificateQuantityFileInit = ref<any>(null);
const berthBookingRequestFileInit = ref<any>(null);
const otherFileInit = ref<any>(null);

onMounted(() => {
   renderColumnsProductTable();
   getMasterDataList();
   if (isEdit) {
      getVesselImportDetail();
   }
});

const getMasterDataList = async () => {
   documentOptionsStore.getPurposeTypeOptions();
   documentOptionsStore.getCargoTypesOptions();
   documentOptionsStore.getCargoWharfageOptions();
   documentOptionsStore.getProductGroupOptions();
   documentOptionsStore.getProductTypesOptions();
   documentOptionsStore.getProductOptions();
   documentOptionsStore.getBerthsOptions();
   addressOptionsStore.getCountriesOptions();
};
const getVesselImportDetail = async () => {
   isLoading.value = true;
   const resp = await vesselImportService.getVesselImportDetail(vesselImportId.value);
   if (resp.statusCode === 200) {
      formGroup.value = {
         ...resp.data,
         grossTonnage: getInputDecimal(resp.data.grossTonnage?.toString(), 3),
         mooringDate: resp.data.mooringDate ? new Date(resp.data.mooringDate) : "",
         unmooringDate: resp.data.unmooringDate ? new Date(resp.data.unmooringDate) : "",
         statementFile: resp.data.statementFile?.id !== 0 ? resp.data.statementFile : null,
         shipFile: resp.data.shipFile?.id !== 0 ? resp.data.shipFile : null,
         cargoManifestFile: resp.data.cargoManifestFile?.id !== 0 ? resp.data.cargoManifestFile : null,
         surveyorFile: resp.data.surveyorFile?.id !== 0 ? resp.data.surveyorFile : null,
         certificateQuantityFile: resp.data.certificateQuantityFile?.id !== 0 ? resp.data.certificateQuantityFile : null,
         berthBookingRequestFile: resp.data.berthBookingRequestFile?.id !== 0 ? resp.data.berthBookingRequestFile : null,
         otherFile: resp.data.otherFile?.id !== 0 ? resp.data.otherFile : null,
      };

      mooringDate.value = resp.data.mooringDate ? new Date(resp.data.mooringDate) : new Date();
      unmooringDate.value = resp.data.unmooringDate ? new Date(resp.data.unmooringDate) : new Date();

      passengerList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Passenger")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Passenger")[0].details
         : [];

      sparePartList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Spare Part")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Spare Part")[0].details
         : [];

      otherList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Other")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Other")[0]
         : [];

      productList.value = resp.data.products.filter((p: any) => !["Passenger", "Spare Part", "Other"].includes(p.purposeTypeName))[0]
         ? resp.data.products
              .filter((p: any) => !["Passenger", "Spare Part", "Other"].includes(p.purposeTypeName))
              .map((item: any) => ({
                 ...item,
                 mTonQty: getInputDecimal(item.details?.[0]?.mTonQty?.toString(), 3),
                 rTonQty: getInputDecimal(item.details?.[0]?.rTonQty?.toString(), 3),
              }))[0].details
         : [];

      statementFileInit.value = resp.data.statementFile?.id !== 0 ? resp.data.statementFile : null;
      shipFileInit.value = resp.data.shipFile?.id !== 0 ? resp.data.shipFile : null;
      cargoManifestFileInit.value = resp.data.cargoManifestFile?.id !== 0 ? resp.data.cargoManifestFile : null;
      surveyorFileInit.value = resp.data.surveyorFile?.id !== 0 ? resp.data.surveyorFile : null;
      certificateQuantityFileInit.value = resp.data.certificateQuantityFile?.id !== 0 ? resp.data.certificateQuantityFile : null;
      berthBookingRequestFileInit.value = resp.data.berthBookingRequestFile?.id !== 0 ? resp.data.berthBookingRequestFile : null;
      otherFileInit.value = resp.data.otherFile?.id !== 0 ? resp.data.otherFile : null;

      getBerthDetail(formGroup.value.berthId);
   }
   isLoading.value = false;
};

const getBerthDetail = async (berthId: number) => {
   const resp = await berthService.getBerthDetail(berthId);
   jettyList.value = resp.data.jettys;
};
const getJetty = async (berthId: number, type: string = "fetch") => {
   const res = await berthService.getBerthDetail(berthId);
   if (res.statusCode === 200) {
      if (type === "change") {
         formGroup.value.jettyId = 0;
      }
      jettyList.value = res.data.jettys;
   }
};

const renderOption = (type: any, id: number) => {
   const optionsMap: any = {
      purposeTypeId: documentOptionsStore.purposeTypeOptions,
      cargoTypeId: documentOptionsStore.cargoTypesOptions,
      cargoWharfageId: documentOptionsStore.cargoWharfageOptions,
      productId: documentOptionsStore.productsOptions,
      productGroupId: documentOptionsStore.productGroupOptions,
      productTypeId: documentOptionsStore.productTypesOptions,
      countryId: addressOptionsStore.countriesOption
   };
   const findData = optionsMap[type]?.find((e: any) => e.id === id);
   return findData ? findData.name : "-";
};

const isDialogVesselImportEditFormOpen = ref(false);
const handleVesselImportEditForm = (status: boolean, mode: string) => {
   isDialogVesselImportEditFormOpen.value = status;
};
const dialogVesselImportEditCancel = () => {
   isDialogVesselImportEditFormOpen.value = false;
};
const dialogVesselImportEditConfirm = (status: boolean, type: string = "") => {
   isDialogVesselImportEditFormOpen.value = status;
   if (type === "refresh") {
      getVesselImportDetail();
   }
};

const addProduct = (event: any) => {
   let body = {
      id: 0,
      ...event,
      is_delete: false,
   };
   productList.value.push(body);
};
const editProduct = (event: any) => {
   let body = {
      ...event,
      is_delete: false,
   };
   productList.value[itemIndexProduct.value] = body;
   itemDataProduct.value = null;
};
const deleteProduct = (product: any, index: number) => {
   productList.value.splice(index, 1);
   if (product.id !== 0) {
      productListDeletedItem.value.push({ ...product, is_delete: true });
   }
};

const actionMode = ref<string>("");
const vesselType = ref<string>("");
const isDialogProductVesselImportFormOpen = ref(false);
const handleVesselImportProductForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogProductVesselImportFormOpen.value = status;
};
const dialogProductVesselImportCancel = () => {
   isDialogProductVesselImportFormOpen.value = false;
};
const dialogProductVesselImportConfirm = (status: boolean, type: string = "") => {
   isDialogProductVesselImportFormOpen.value = status;
};
const getProductListMenuTable = (row: any, index: number) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               actionMode.value = "edit";
               itemIndexProduct.value = index;
               itemDataProduct.value = row;
               handleVesselImportProductForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deleteProduct(row, index);
            },
         },
      ],
   ];
   return items;
};

const isDialogUploadFileFormOpen = ref(false);
const handleVesselImportUploadFileForm = (status: boolean) => {
   isDialogUploadFileFormOpen.value = status;
};
const dialogUploadFileCancel = () => {
   isDialogUploadFileFormOpen.value = false;
};
const dialogUploadFileConfirm = (status: boolean, uploadItem: any) => {
   const uploadFilesDataFilter = uploadItem.uploadFiles.map((item: any) => {
      return {
         fileId: item.fileId,
         fileName: item.fileName,
         filePath: item.filePath,
         size: item.size,
         name: uploadItem.name,
         is_delete: false,
      };
   });
   isDialogUploadFileFormOpen.value = status;
   formGroup.value.files = [...formGroup.value.files, ...uploadFilesDataFilter];
};

const totalMTonQty = () => {
   return productList.value.reduce((acc: number, item: any) => {
      const mTonQty = item.mTonQty;
      const converted = removeCommaAndConvertToNumber(mTonQty);
      return acc + (converted ?? 0);
   }, 0);
};

const totalRTonQty = () => {
   return productList.value.reduce((acc: number, item: any) => {
      const rTonQty = item.rTonQty;
      const converted = removeCommaAndConvertToNumber(rTonQty);
      return acc + (converted ?? 0);
   }, 0);
};

const renderColumnsProductTable = () => {
   if (isDocumentBerthOfficer) {
      columnsProductTable.value = [
         { key: "id", label: t("id"), class: "min-w-[65px] text-center" },
         { key: "purposeTypeId", label: t("purpose") }, // ประเภทวัตถุประสงค์
         { key: "cargoTypeId", label: t("berth_position") }, // ตำแหน่งเทียบท่า
         { key: "productName", label: t("product_name") }, // ชื่อสินค้า
         { key: "productGroupId", label: t("product_group") }, // กลุ่มสินค้า
         { key: "productTypeId", label: t("product_kind") }, // ชนิดสินค้า
         { key: "mTonQty", label: t("mt") },
         { key: "rTonQty", label: t("rt") },
         { key: "blProduct", label: t("B/L") },
         { key: "cargoOwnerName", label: t("cargo_owner") },
         { key: "countryId", label: t("ประเทศต้นทาง/ปลายทาง") },
         {
            key: "actions",
            sortable: false,
         },
      ];
   } else {
      columnsProductTable.value = [
         { key: "id", label: t("id"), class: "min-w-[65px] text-center" },
         { key: "purposeTypeId", label: t("purpose") }, // ประเภทวัตถุประสงค์
         { key: "cargoTypeId", label: t("berth_position") }, // ตำแหน่งเทียบท่า
         { key: "cargoWharfageId", label: t("cargo_wharfage") }, // รูปแบบสินค้า
         { key: "productName", label: t("product_name") }, // ชื่อสินค้า
         { key: "productGroupId", label: t("product_group") }, // กลุ่มสินค้า
         { key: "productTypeId", label: t("product_kind") }, // ชนิดสินค้า
         { key: "mTonQty", label: t("mt") },
         { key: "rTonQty", label: t("rt") },
         { key: "blProduct", label: t("B/L") },
         { key: "cargoOwnerName", label: t("cargo_owner") },
         { key: "countryId", label: t("ประเทศต้นทาง/ปลายทาง") },
         {
            key: "actions",
            sortable: false,
         },
      ];
   }
};

const handleDeleteUploadFiles = (file: any, index: number) => {
   formGroup.value.files.splice(index, 1);
   uploadFilesDeletedItem.value.push({ ...file, is_delete: true });
};

const isDialogAlertOpen = ref(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;

   if (dialogAlertProps.value.type === "success") {
      navigateTo("/ship-entry/vessel-import");
      documentStore.triggerRefresh();
   }
};

const confirmType = ref<string>("");
const isDialogConfirmOpen = ref(false);
const handleDialogConfirm = (status: boolean, type: string) => {
   isDialogConfirmOpen.value = status;
   confirmType.value = type;
   if (confirmType.value === "delete") {
      dialogConfirmProps.value = {
         title: t("vessel_import_cancel_title"),
         desc: t("vessel_import_cancel_description"),
         icon: "danger",
         colorConfirm: "red",
      };
   }

   if (confirmType.value === "send") {
      dialogConfirmProps.value = {
         title: t("vessel_import_send"),
         desc: t("vessel_import_confirm"),
         icon: "warning",
      };
   }
};
const dialogConfirm = async () => {
   if (confirmType.value === "delete") {
      deleteVesselImport();
   }

   if (confirmType.value === "send") {
      updateVesselImportDetail();
   }
};
const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};

const deleteVesselImport = async () => {
   isLoading.value = true;
   const resp: any = await vesselImportService.deleteVesselImport(vesselImportId.value);
   const isSuccess = resp.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("vessel_import_cancel_title") : locale.value === "th" ? resp.message : resp.translation,
      desc: t(isSuccess ? "vessel_import_cancel_success" : ""),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};

const updateVesselImportDetail = async () => {
   const productListPayload = [
      ...productList.value,
      ...productListDeletedItem.value,
      ...passengerList.value,
      ...passengerDeletedItem.value,
      ...sparePartList.value,
      ...sparePartDeletedItem.value,
      ...otherList.value,
      ...otherDeletedItem.value,
   ].map((item) => {
      const { cargoOwnerUniqueKey, productUniqueKey, ...rest } = item;
      return {
         ...rest,
         mTonQty: removeCommaAndConvertToNumber(item.mTonQty),
         rTonQty: removeCommaAndConvertToNumber(item.rTonQty),
         passengers: typeof item.passengers === "string" ? removeCommaAndConvertToNumber(item.passengers) : item.passengers,
      };
   });

   let payload: any = {
      berthId: formGroup.value.berthId,
      grossTonnage: removeCommaAndConvertToNumber(formGroup.value.grossTonnage),
      mooringDate: convertTimezone(new Date(formGroup.value.mooringDate), 7, false),
      unmooringDate: convertTimezone(new Date(formGroup.value.unmooringDate), 7, false),
      jettyId: formGroup.value.jettyId,
      note: formGroup.value.note,
      products: productListPayload,

      statementFile: {
         fileId: formGroup.value.statementFile?.id === statementFileInit.value?.id ? 0 : formGroup.value.statementFile?.id,
         isDelete: formGroup.value.statementFile?.isDelete,
      },
      shipFile: {
         fileId: formGroup.value.shipFile?.id === shipFileInit.value?.id ? 0 : formGroup.value.shipFile?.id,
         isDelete: formGroup.value.shipFile?.isDelete,
      },
      cargoManifestFile: {
         fileId: formGroup.value.cargoManifestFile?.id === cargoManifestFileInit.value?.id ? 0 : formGroup.value.cargoManifestFile?.id,
         isDelete: formGroup.value.cargoManifestFile?.isDelete,
      },
      surveyorFile: {
         fileId: formGroup.value.surveyorFile?.id === surveyorFileInit.value?.id ? 0 : formGroup.value.surveyorFile?.id,
         isDelete: formGroup.value.surveyorFile?.isDelete,
      },
      certificateQuantityFile: {
         fileId: formGroup.value.certificateQuantityFile?.id === certificateQuantityFileInit.value?.id ? 0 : formGroup.value.certificateQuantityFile?.id,
         isDelete: formGroup.value.certificateQuantityFile?.isDelete,
      },
      berthBookingRequestFile: {
         fileId: formGroup.value.berthBookingRequestFile?.id === berthBookingRequestFileInit.value?.id ? 0 : formGroup.value.berthBookingRequestFile?.id,
         isDelete: formGroup.value.berthBookingRequestFile?.isDelete,
      },
      otherFile: {
         fileId: formGroup.value.otherFile?.id === otherFileInit.value?.id ? 0 : formGroup.value.otherFile?.id,
         isDelete: formGroup.value.otherFile?.isDelete,
      },
   };

   if (!isEdit) {
      payload.vesselId = formGroup.value.vesselId;
   }

   isLoading.value = true;
   const resp: any = isEdit
      ? await vesselImportService.updateVesselImportDetail(vesselImportId.value, payload)
      : await vesselImportService.createVesselImport(payload);
   const isSuccess = resp.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("vessel_import_send") : locale.value === "th" ? resp.message : resp.translation,
      desc: t(isSuccess ? "vessel_import_cancel_success" : ""),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};

const handleFormError = (error: ZodError): void => {
   allFieldPristine();
};
async function onSubmit(event: FormSubmitEvent<z.output<typeof vesselImportSchema>>) {
   allFieldPristine();
   if (!isFormGroupValid(formGroup.value)) {
      return;
   }
   handleDialogConfirm(true, "send");
   isDialogConfirmOpen.value = true;
}

const fieldValidation = ref<any>({
   grossTonnage: { message: t("required"), pristine: false },
   berthId: { message: t("required"), pristine: false },
   jettyId: { message: t("required"), pristine: false },
   mooringDate: { message: t("required"), pristine: false },
   unmooringDate: { message: t("required"), pristine: false },
   statementFile: { message: t("required"), pristine: false },
   shipFile: { message: t("required"), pristine: false },
   cargoManifestFile: { message: t("required"), pristine: false },
   surveyorFile: { message: t("required"), pristine: false },
   certificateQuantityFile: { message: t("required"), pristine: false },
   berthBookingRequestFile: { message: t("required"), pristine: false },
   otherFile: { message: t("required"), pristine: false },
});
const allFieldPristine = (pristineValue: boolean = true) => {
   fieldValidation.value = Object.keys(fieldValidation.value).reduce((acc: any, key) => {
      acc[key] = { ...fieldValidation.value[key], pristine: pristineValue };
      return acc;
   }, {});
};
const isFieldError = (field: string) => {
   const value = formGroup.value[field];
   const pristine = fieldValidation.value[field].pristine;
   if (field === "otherFile") {
      return;
   }
   if (!value && pristine) {
      fieldValidation.value[field].message = t("required");
      return true;
   }

   if (field === "unmooringDate" && value && new Date(formGroup.value.unmooringDate) < new Date(formGroup.value.mooringDate)) {
      fieldValidation.value[field].message = t("วันที่เวลาเรือออกจากท่าต้องมากกว่าหรือเท่ากับวันที่เวลาเรือเข้าเทียบท่า");
      return true;
   }
   return false;
};

const isFormGroupValid = ({
   id,
   vesselId,
   vesselName,
   imoNumber,
   officialNumber,
   vesselFlagId,
   vesselFlagName,
   vesselFlagImage,
   vesselTypeId,
   vesselTypeName,
   //grossTonnage,
   mooringDate,
   unmooringDate,
   //berthId,
   berthName,
   //jettyId,
   jettyName,
   note,
   notes,
   status,
   statusDes,
   files,
   products,
   logBook,
   statementFile,
   shipFile,
   cargoManifestFile,
   surveyorFile,
   certificateQuantityFile,
   berthBookingRequestFile,
   otherFile,
   ...fieldsToCheck
}: IVesselImportEdit) => {
   const isDateValid = mooringDate && unmooringDate && new Date(unmooringDate) >= new Date(mooringDate);
   const areFilesValid =
      statementFile &&
      !statementFile.isDelete &&
      shipFile &&
      !shipFile.isDelete &&
      (isDocumentBerthOfficerTCT || isDocumentBerthOfficerMIT ? cargoManifestFile && !cargoManifestFile.isDelete : true) &&
      (!isDocumentBerthOfficerTCT && !isDocumentBerthOfficerMIT ? surveyorFile && !surveyorFile.isDelete : true) &&
      (isDocumentBerthOfficerTTT ? certificateQuantityFile && !certificateQuantityFile.isDelete : true) &&
      (isDocumentBerthOfficerTCT || isDocumentBerthOfficerMIT ? berthBookingRequestFile && !berthBookingRequestFile.isDelete : true);

   const areFieldsValid = Object.values(fieldsToCheck).every((value) => value);
   return isDateValid && areFilesValid && areFieldsValid;
};

const onMooringDateChange = (newDate: any) => {
   formGroup.value.mooringDate = newDate ? new Date(newDate).toISOString() : "";
};
const onUnmooringDateChange = (newDate: any) => {
   formGroup.value.unmooringDate = newDate ? new Date(newDate).toISOString() : "";
};

const vesselSearchDisplay = ref<string>("");
const onSearchVessels = async (q: string) => {
   const filter = {
      flag: 0,
      owner: "",
      type: 0,
      page: 1,
      limit: 100,
      search: q,
      showAll: true,
   };
   vesselSearchDisplay.value = q;
   const resp = await vesselService.getVesselList(filter);
   if (resp.statusCode === 200) {
      return resp.data.data.map((e: IVesselData) => ({ ...e, id: e.id, name: e.name }));
   }
   return [];
};
const handleChangeVessel = async (value: any) => {
   formGroup.value.vesselId = value.id;
   vesselSearchDisplay.value = value.name;
   const resp = await vesselService.getVesselDetail(value.id);
   if (resp.statusCode === 200) {
      formGroup.value.vesselName = resp.data.name;
      formGroup.value.vesselTypeName = resp.data.vesselTypeName;
      formGroup.value.imoNumber = resp.data.imoNumber;
      formGroup.value.officialNumber = resp.data.officialNumber;
      formGroup.value.vesselFlagName = resp.data.vesselFlagName;
      formGroup.value.vesselFlagImage = resp.data.vesselFlagImage;
   }
};

const inputRefs = ref<any>({
   shipFile: null,
   cargoManifestFile: null,
   surveyorFile: null,
   certificateQuantityFile: null,
   berthBookingRequestFile: null,
   otherFile: null,
});

const handleFileUpload = async (e: any, type: string) => {
   const target = e.target as HTMLInputElement;
   const file = target.files?.[0];
   const res = await masterDataService.uploadVesselImport(file!);
   if (res.statusCode === 200) {
      formGroup.value[type] = {
         ...res.data,
         isDelete: false,
      };
   }
};
const selectFile = (type: string) => {
   if (inputRefs.value[type]) {
      inputRefs.value[type].value = "";
      inputRefs.value[type].click();
   }
};
const onRemoveFile = (type: string) => {
   formGroup.value[type] = {
      ...formGroup.value[type],
      isDelete: true,
   };
};

const getFieldError = (fileType: any) => {
   if (isFieldError(fileType) && fieldValidation.value[fileType]?.pristine) {
      return fieldValidation.value[fileType]?.message;
   }
   return formGroup.value[fileType]?.isDelete && fileType !== "otherFile" ? t("required") : "";
};

const getPassengerListMenuTable = (row: any, index: number) => {
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               actionMode.value = "edit";
               selectedPassenger.value = row;
               selectedPassengerIndex.value = index;
               handlePassengerDroppingForm(true, "edit", index);
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               dialogPassengerDroppingConfirm("delete", row, index);
            },
         },
      ],
   ];
   return items;
};

const getSparePartListMenuTable = (row: any, index: number) => {
   console.log(row);
   return [
      [
         {
            label: t("edit"),
            avatar: { src: EditIcon },
            click: () => {
               actionMode.value = "edit";
               selectedSparePart.value = row;
               selectedSparePartIndex.value = index;
               handleSparePartForm(true, "edit", index);
            },
         },
         {
            label: t("delete"),
            avatar: { src: CrossCircleIcon },
            click: () => {
               dialogSparePartConfirm("delete", row, index);
            },
         },
      ],
   ];
};

const getOtherListMenuTable = (row: any, index: number) => {
   return [
      [
         {
            label: t("edit"),
            avatar: { src: EditIcon },
            click: () => {
               actionMode.value = "edit";
               selectedOther.value = row;
               selectedOtherIndex.value = index;
               handleOtherForm(true, "edit", index);
            },
         },
         {
            label: t("delete"),
            avatar: { src: CrossCircleIcon },
            click: () => {
               dialogOtherConfirm("delete", row, index);
            },
         },
      ],
   ];
};

const isDialogPassengerDroppingFormOpen = ref(false);
const handlePassengerDroppingForm = (status: boolean, mode: string, index: number = -1) => {
   actionMode.value = mode;
   isDialogPassengerDroppingFormOpen.value = status;
   if (mode === "create") {
      selectedPassenger.value = "";
      selectedPassengerIndex.value = -1;
   } else {
      selectedPassengerIndex.value = index;
   }
};
const dialogPassengerDroppingConfirm = (action: string, passengerItem: any, index: number = -1) => {
   if (action === "create") {
      passengerList.value.push(passengerItem);
   } else if (action === "edit") {
      passengerList.value[index] = passengerItem;
   } else if (action === "delete") {
      const removed = passengerList.value.splice(index, 1);
      if (removed.length) {
         if (removed[0].id !== 0) {
            passengerDeletedItem.value.push({ ...removed[0], is_delete: true });
         }
      }
   }
   isDialogPassengerDroppingFormOpen.value = false;
};
const dialogPassengerDroppingCancel = () => {
   isDialogPassengerDroppingFormOpen.value = false;
};

const isDialogSparePartFormOpen = ref(false);
const handleSparePartForm = (status: boolean, mode: string, index: number = -1) => {
   actionMode.value = mode;
   isDialogSparePartFormOpen.value = status;
   if (mode === "create") {
      selectedSparePart.value = "";
      selectedSparePartIndex.value = -1;
   } else {
      selectedSparePartIndex.value = index;
   }
};
const dialogSparePartConfirm = (action: string, item: any, index: number = -1) => {
   if (action === "create") {
      sparePartList.value.push(item);
   } else if (action === "edit") {
      sparePartList.value[index] = item;
   } else if (action === "delete") {
      const removed = sparePartList.value.splice(index, 1);
      if (removed.length && removed[0].id !== 0) {
         sparePartDeletedItem.value.push({ ...removed[0], is_delete: true });
      }
   }
   isDialogSparePartFormOpen.value = false;
};
const dialogSparePartCancel = () => {
   isDialogSparePartFormOpen.value = false;
};

const isDialogOtherFormOpen = ref(false);
const handleOtherForm = (status: boolean, mode: string, index: number = -1) => {
   actionMode.value = mode;
   isDialogOtherFormOpen.value = status;
   if (mode === "create") {
      selectedOther.value = "";
      selectedOtherIndex.value = -1;
   } else {
      selectedOtherIndex.value = index;
   }
};
const dialogOtherConfirm = (action: string, item: any, index: number = -1) => {
   if (action === "create") {
      otherList.value.push(item);
   } else if (action === "edit") {
      otherList.value[index] = item;
   } else if (action === "delete") {
      const removed = otherList.value.splice(index, 1);
      if (removed.length && removed[0].id !== 0) {
         otherDeletedItem.value.push({ ...removed[0], is_delete: true });
      }
   }
   isDialogOtherFormOpen.value = false;
};
const dialogOtherCancel = () => {
   isDialogOtherFormOpen.value = false;
};
</script>
