<template>
   <div>
      <div class="mb-8">
         <h1 class="font-bold text-[30px]">Log Book</h1>
      </div>
      <!-- <UForm :schema="logBookSchema" :state="formGroup" @submit="onSubmit"> -->
      <div id="log-book-mode-form-content" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
         <div class="flex items-center justify-between mb-5">
            <div>
               <h1 class="font-semibold text-lg text-grayy-400">ข้อมูลเรือกิจกรรม</h1>
               <div class="mt-1 text-grayy-75 text-sm">รายละเอียดข้อมูลเรือกิจกรรม</div>
            </div>
            <div class="">
               <UButton @click="handleCancleCreateVessel" class="mx-2 border border-grayy-100" size="md" color="gray" :label="isEdit ? $t('close') : $t('cancel')" />
               <!-- <UButton size="md" :label="$t('save')" type="submit" /> -->
               <UButton
                  class="border border-primaryy-500 bg-primaryy-500 hover:bg-primaryy-500 text-grayy-25 w-[82px] h-[36px] justify-center"
                  size="md"
                  color="gray"
                  :label="$t('save')"
                  type="button"
                  @click="onSubmit"
               />
            </div>
         </div>
         <UDivider class="my-4" />
         <div v-if="!isEdit" class="col-span-2">
            <UFormGroup label="ชื่อเรือ/IMO/Official No." name="vesselId">
               <UInputMenu
                  v-model="vesselSearchDisplay"
                  size="md"
                  variant="outline"
                  color="purple"
                  icon="i-heroicons-magnifying-glass-20-solid"
                  :search="onSearchVessels"
                  @change="handleChangeVessel"
                  :placeholder="$t('search_title_placeholder')"
                  option-attribute="name"
                  trailing
                  by="id"
               >
               </UInputMenu>
            </UFormGroup>
         </div>
         <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเรือรายการ</h2>
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <Input is-view :label="'เจ้าของเรือ'" name="owner" :placeholder="''" v-model="vesselData.owner" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'สัญชาติเรือ/ธงเรือ'" name="vesselFlagName" :placeholder="'vesselFlagName'" v-model="vesselData.vesselFlagName" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ชื่อเรือ'" name="name" :placeholder="'name'" v-model="vesselData.name" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ประเภทเรือ'" name="vesselTypeName" :placeholder="'vesselTypeName'" v-model="vesselData.vesselTypeName" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'หมายเลข IMO'" name="IMONumber" :placeholder="'imoNumber'" v-model="vesselData.imoNumber" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'หมายเลข MMSI'" name="MMSI Number" :placeholder="'mmsiNumber'" v-model="vesselData.mmsiNumber" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'หมายเลขทะเบียนเรือ'" name="officialNumber" :placeholder="'officialNumber'" v-model="vesselData.officialNumber" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'สัญญานเรียกขาน'" name="callSign" :placeholder="'callSign'" v-model="vesselData.callSign" />
               </div>
               <div class="col-span-1" v-if="vesselData.vesselFlagName.trim().toLowerCase() == 'thailand'">
                  <Input is-view :label="'วันหมดอายุทะเบียนเรือ'" name="LicenseExpiredDate" :placeholder="''" v-model="vesselData.licenseExpiredDate" />
               </div>
            </div>
            <UDivider class="my-4" />
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <Input is-view :label="'น้ำหนักบรรทุก'" name="loadWeight" :placeholder="'LoadWeight'" v-model="vesselData.loadWeight" float />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'Gross Tonnage'" name="grossTonnage" :placeholder="'grossTonnage'" v-model="vesselData.grossTonnage" float three-digit />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'Net Tonnage'" name="NetTonnage" :placeholder="'NetTonnage'" v-model="vesselData.netTonnage" float />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ความยาว'" name="LengthOverall" :placeholder="'LengthOverall'" v-model="vesselData.lengthOverall" float />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ความกว้าง'" name="BreadthExtreme" :placeholder="'BreadthExtreme'" v-model="vesselData.breadthExtreme" float />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'กินน้ำลึก'" name="Depth" :placeholder="'Depth'" v-model="vesselData.depth" float />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'เครื่องจักรใหญ่'" name="MainEngine" :placeholder="'MainEngine'" v-model="vesselData.mainEngine" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ยี่ห้อและรุ่น'" name="BandAndModel" :placeholder="'BandAndModel'" v-model="vesselData.bandAndModel" />
               </div>
            </div>
         </div>
         <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเรือ</h2>
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <NumericInput
                     label="Gross Tonnage (Confirm)"
                     placeholder="0.000"
                     name="grossTonnage"
                     required
                     v-model="formGroup.gross_tonnage"
                     :error="isFieldError('gross_tonnage',true) ? fieldValidation.gross_tonnage.message : ''"
                     type="number"
                     suffix="t"
                     decimalPlaces="3"
                  />
               </div>
               <div class="col-span-1">
                  <NumericInput
                     label="Draft (Confirm)"
                     placeholder="0.00"
                     name="depth"
                     required
                     v-model="formGroup.depth"
                     type="number"
                     suffix="m"
                     :error="isFieldError('depth',true) ? fieldValidation.depth.message : ''"
                  />
               </div>
               <div class="col-span-1">
                  <USelect
                     :label="'Last Port'"
                     name="lastPort"
                     :placeholder="'Last Port'"
                     required
                     :searchable-placeholder="'Last Port'"
                     v-model="formGroup.port_id_last"
                     :error="isFieldError('port_id_last',true) ? fieldValidation.port_id_last.message : ''"
                     searchable
                     :options="portList"
                  />
               </div>
               <div class="col-span-1">
                  <USelect
                     :label="'Next Port'"
                     name="nextPort"
                     :placeholder="'Next Port'"
                     required
                     :searchable-placeholder="'Next Port'"
                     v-model="formGroup.port_id_next"
                     :error="isFieldError('port_id_next',true) ? fieldValidation.port_id_next.message : ''"
                     searchable
                     :options="portList"
                  />
               </div>
               <div class="col-span-1">
                  <Input :label="'Voyage'" name="voyage" :placeholder="'voyage'" required v-model="formGroup.voyage" />
               </div>
            </div>
         </div>
         <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเทียบท่า</h2>
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <USelect
                     :label="'ท่าเทียบเรือ'"
                     name="berth"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].berth_id"
                     :error="isFieldError('berth_id') ? fieldValidation.berth_id.message : ''"
                     searchable
                     :options="berthList"
                     option-attribute="name_th"
                     value-attribute="id"
                  />
               </div>
               <div class="col-span-1">
                  <USelect
                     :label="'วันถุประสงค์เทียบท่า'"
                     name="purpose"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].purpose_id"
                     :error="isFieldError('purpose_id') ? fieldValidation.purpose_id.message : ''"
                     searchable
                     option-attribute="purpose_name"
                     :options="purposeList"
                  />
               </div>
               <!-- <div class="col-span-1">
                  <USelect
                     :label="'ลักษณะสินค้า'"
                     name="cargo_type"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].cargo_type_id"
                     :error="isFieldError('cargo_type_id') ? fieldValidation.cargo_type_id.message : ''"
                     searchable
                     :options="cargoTypeList"
                  />
               </div>
               <div class="col-span-1">
                  <USelect
                     :label="'รูปแบบสินค้า'"
                     name="cargo_wharfage"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].cargo_wharfage_id"
                     :error="isFieldError('cargo_wharfage_id') ? fieldValidation.cargo_wharfage_id.message : ''"
                     searchable
                     :options="cargoWharfageList"
                  />
               </div> -->
               <div class="col-span-1">
                  <USelect
                     :label="'ท่าเทียบเรือย่อย'"
                     name="jetty"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].jetty_id"
                     :error="isFieldError('jetty_id') ? fieldValidation.jetty_id.message : ''"
                     searchable
                     :options="jettyList"
                     :disabled="!formGroup.details[0].berth_id"
                  />
               </div>
            </div>

            <UDivider class="my-4" />
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <UFormGroup :label="'วันที่เรือเข้า'" required>
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <UInput
                           size="md"
                           variant="outline"
                           color="purple"
                           custom-icon="calendar"
                           v-model="formGroup.details[0].mooring_date"
                           :value="formGroup.details[0].mooring_date ? `${format(formGroup.details[0].mooring_date, 'd MMM, yyy, HH:mm')}` : ''"
                           :error="isFieldError('mooring_date') ? fieldValidation.mooring_date.message : ''"
                           :placeholder="'วันที่เรือเข้า'"
                           :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }"
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
               <div class="col-span-1">
                  <UFormGroup :label="'วันที่เรือออก'">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <UInput
                           size="md"
                           variant="outline"
                           color="purple"
                           custom-icon="calendar"
                           v-model="formGroup.details[0].departure_date"
                           :value="formGroup.details[0].departure_date ? `${format(formGroup.details[0].departure_date, 'd MMM, yyy, HH:mm')}` : ''"
                           :error="isFieldError('departure_date') ? fieldValidation.departure_date.message : ''"
                           :placeholder="'วันที่เรือออก'"
                           :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }"
                        />

                        <template #panel="{ close }">
                           <Datepicker
                              v-model="departureDate"
                              @close="close"
                              is-required
                              is24hr
                              type="normal"
                              mode="dateTime"
                              v-on:date-change="onDepartureDateChange"
                           />
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
            </div>
         </div>
         <section class="border border-grayy-100 p-8 rounded-xl mt-6">
            <div>
               <div class="flex items-center justify-between">
                  <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("tug_boat") }}</h1>
                  <UButton icon="i-heroicons-plus-circle" size="md" :label="$t('add_tug_boat')" @click="() => handleTugBoatForm(true, 'create', '')" />
               </div>
               <UTable
                  :columns="columnsTable1"
                  :rows="portListShow1"
                  class=""
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
                  <template #actions-data="{ row, index }">
                     <div class="text-right">
                        <UDropdown :items="getMenuTable1(row, index)">
                           <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                        </UDropdown>
                     </div>
                  </template>
               </UTable>
            </div>
            <UDivider class="my-6" />
            <div>
               <div class="flex items-center justify-between">
                  <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("pilotage") }}</h1>
                  <UButton icon="i-heroicons-plus-circle" size="md" :label="$t('add_pilotage')" @click="() => handleNavigateForm(true, 'create', '')" />
               </div>
               <UTable
                  :columns="columnsTable2"
                  :rows="portListShow2"
                  class=""
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
                  <template #actions-data="{ row, index }">
                     <div class="text-right">
                        <UDropdown :items="getMenuTable2(row, index)">
                           <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                        </UDropdown>
                     </div>
                  </template>
               </UTable>
            </div>
         </section>

         <section id="vessel-in-section4" class="border rounded-xl border-solid border-[#D0D5DD] p-8 mt-6">
            <div class="flex items-center justify-between">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("cargo_list") }}</h1>
               <UButton icon="i-heroicons-plus-circle" size="md" :label="$t('add_cargo')" @click="() => handleInventoryForm(true, 'create', '')" />
            </div>
            <UTable
               :columns="columnsTable3"
               :rows="portListShow3"
               class=""
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
               <template #actions-data="{ row }">
                  <div class="text-right">
                     <UDropdown :items="getMenuTable3(row)">
                        <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                     </UDropdown>
                  </div>
               </template>
            </UTable>
         </section>
      </div>
      <!-- </UForm> -->
   </div>
   <TugBoatForm
      :isDialogOpen="isDialogTugBoatFormOpen"
      :dialogCancel="dialogTugBoatCancel"
      :dialogConfirm="dialogTugBoatConfirm"
      :addData="addTug"
      :editData="editTug"
      :mode="actionMode"
      :itemId="itemIndexTug"
      :itemData="itemDataTug"
      :vesselType="vesselType"
   />

   <NagivateForm
      :isDialogOpen="isDialogNavigateFormOpen"
      :dialogCancel="dialogNavigateCancel"
      :dialogConfirm="dialogNavigateConfirm"
      :addData="addPilot"
      :editData="editPilot"
      :mode="actionMode"
      :itemId="itemIndexPilot"
      :itemData="itemDataPilot"
      :vesselType="vesselType"
   />

   <InventoryForm
      :isDialogOpen="isDialogInventoryFormOpen"
      :dialogCancel="dialogInventoryCancel"
      :dialogConfirm="dialogInventoryConfirm"
      :addData="addProduct"
      :editData="editProduct"
      :mode="actionMode"
      :itemId="itemIdProduct"
      :itemData="itemDataProduct"
      :vesselType="vesselType"
   />
   <DialogConfirm
      :title="isEdit ? $t('save_logbook') : $t('add_logbook')"
      :desc="isEdit ? $t('confirm_save_vessel_agent') : $t('confirm_add_vessel_agent')"
      icon="warning"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isConfirmDialogOpen"
      :dialogCancel="dialogCancel"
      :dialogConfirm="dialogConfirm"
   />
   <DialogConfirm
      :title="$t('leave_this_page_title')"
      :desc="$t('leave_this_page_message')"
      icon="warning"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isConfirmLeaveDialogOpen"
      :dialogCancel="handleCancelLeave"
      :dialogConfirm="handleConfirmLeave"
   />
   <DialogConfirm
      :title="$t('cancel_data_recording')"
      :desc="$t('leave_this_page_message')"
      icon="warning"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)"
      :dialogConfirm="() => navigateTo('/vtms/log-book')"
   />
   <DialogAlert
      :isOpen="isAlertDialogOpen"
      :desc="modalAlertMessage"
      :title="$t('add_logbook')"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialog"
      :btnName="$t('close')"
   />
   <DialogAlert
      :isOpen="isAlertDialogUpdateOpen"
      :desc="modalAlertMessage"
      :title="$t('save_logbook')"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialogUpdate"
      :btnName="$t('close')"
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
import type { IVtmsLogBookAdd } from "~/core/interfaces/IVtmsLogBook";
import { format } from "date-fns";
import UInput from "~/components/form/u-input.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import logBookService from "~/core/services/vtms/logBookService.ts";
import useCargoWharfageService from "~/core/services/masterDataShipService/product/cargoWharfageService";
import useCargoTypeService from "~/core/services/masterDataShipService/product/cargoTypeService";

import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import TugBoatForm from "~/components/dialog/sailing-log/vessel/tug-boat-form.vue";
import NagivateForm from "~/components/dialog/sailing-log/vessel/navigate-form.vue";
import InventoryForm from "~/components/dialog/sailing-log/vessel/inventory-form.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";
import type { IVesselData } from "~/core/interfaces/IVesselData";

const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === "edit";
const { addVtmsLogBook, updateVtmsLogBook, getVtmsLogBookDetail, getVessel, getPort, getBerth, getUseBerth, getPurpose, getLocate, getJetty } = logBookService();
const { getCargoWharfage } = useCargoWharfageService();
const { getCargoType } = useCargoTypeService();

const query: any = route.query;
const logBookId = isEdit && query.id;
const vesselTypeA = query.vesselType;
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

// const createSchema = () => {
//    return z.object({
//       gross_tonnage: z
//          .union([z.string().min(1, { message: t("required") }), z.number()])
//          .refine((value) => (typeof value === "string" && value.trim() !== "" && !value.startsWith("0")) || (typeof value === "number" && value > 0), {
//             message: t("required"),
//          }),
//       depth: z
//          .union([z.string().min(1, { message: t("required") }), z.number()])
//          .refine((value) => (typeof value === "string" && value.trim() !== "" && !value.startsWith("0")) || (typeof value === "number" && value > 0), {
//             message: t("required"),
//          }),
//       port_id_next: z.number().min(1, { message: t("required") }),
//       port_id_last: z.number().min(1, { message: t("required") }),
//       voyage: z.string().min(1, t("required")),
//       berth_id: z.number().min(1, t("required")),
//       purpose_id: z.number().min(1, t("required")),
//       cargo_type_id: z.number().min(1, t("required")),
//       cargo_wharfage_id: z.number().min(1, t("required")),
//       jetty_id: z.number().min(1, t("required")),
//       mooring_date: z.string().min(1, t("required")),
//       departure_date: z.string().min(1, t("required")),
//       // vesselId: z.string().min(1, t("required")),
//    });
// };

// const logBookSchema = ref(createSchema());

const vesselData = ref({
   owner: "",
   vesselFlagName: "",
   name: "",
   vesselTypeName: "",
   imoNumber: "",
   mmsiNumber: "",
   officialNumber: "",
   callSign: "",
   licenseExpiredDate: "",
   loadWeight: "",
   grossTonnage: "",
   netTonnage: "",
   lengthOverall: "",
   breadthExtreme: "",
   depth: "",
   mainEngine: "",
   bandAndModel: "",
});
const vesselSelect = ref({
   owner: "",
   vesselFlagName: "",
   name: "",
   vesselTypeName: "",
   imoNumber: "",
   mmsiNumber: "",
   officialNumber: "",
   callSign: "",
   licenseExpiredDate: "",
   loadWeight: "",
   grossTonnage: "",
   netTonnage: "",
   lengthOverall: "",
   breadthExtreme: "",
   depth: "",
   mainEngine: "",
   bandAndModel: "",
});
const formGroup = ref({
   document_berth_id: 0,
   gross_tonnage: 0,
   depth: 0,
   voyage: "",
   port_id_next: 0,
   port_id_last: 0,
   status: "",
   details: [
      {
         type_doc: "Arrival",
         berth_id: 0,
         purpose_id: 0,
         cargo_type_id: 0,
         cargo_wharfage_id: 0,
         jetty_id: 0,
         mooring_date: "",
         departure_date: "",
         // mooring_date: "2024-10-07T19:00:00+07:00",
         // departure_date: "2024-10-08T19:00:00+07:00",
      },
   ],
   tugs: [],
   pilots: [],
   products: [],
});
const portList = ref([]);
const berthList = ref([]);
const purposeList = ref([]);
const cargoTypeList = ref([]);
const cargoWharfageList = ref([]);
const jettyList = ref([]);

// const arrivalDate = ref(new Date())
const arrivalDate = ref();
const actionMode = ref<string>("");
const vesselType = ref<string>("");

watch(
   () => vesselSelect.value,
   (value) => {
      if (value) {
         vesselData.value = value;
      }
   }
);
watch(
   () => formGroup.value.details[0].berth_id,
   (value) => {
     
      console.log('berth', formGroup.value.details[0].jetty_id)
      if (value) {
         getJettyList(value);
         formGroup.value.details[0].jetty_id = 0;
      }
   }
);
watch(
   () => formGroup.value.details[0].jetty_id,
   (value) => {
      console.log('jetty_id', formGroup.value.details[0].jetty_id)
   }
);
formGroup.value.details[0].jetty_id
const errors = ref<FormError[]>([]);

const getError = (field: string) => {
   const error = errors.value.find((err) => err.path === field);
   return error ? error.message : null;
};

const payload = ref<IVtmsLogBookAdd>({
   vesselType: "",
   document_berth_id: 0,
   vessel_id: 0,
   gross_tonnage: 0,
   depth: 0,
   port_id_next: 0,
   port_id_last: 0,
   voyage: "",
   details: [
      {
         type_doc: "",
         berth_id: 0,
         purpose_id: 0,
         cargo_type_id: 0,
         cargo_wharfage_id: 0,
         jetty_id: 0,
         mooring_date: "",
         departure_date: "",
      },
   ],
   tugs: [],
   pilots: [],
   products: [],
});

const addressOptionsStore = useAddressOptionsStore();

onMounted(async () => {
   // getVesselList();
   await getMasterList();
   await getPortList();
   // console.log("logBookId", logBookId, isEdit);
   if (logBookId) {
      await getLogBookDetailById(+logBookId);
   }
});
const getMasterList = async () => {
   await getBerthList();
   await getPurposeList();
   await getCargoTypeList();
   await getCargoWharfageList();
};
const getLogBookDetailById = async (id: number) => {
   try {
      isLoading.value = true;
      const resp = await getVtmsLogBookDetail(id);
      if (resp.statusCode === 200) {
         if (resp.data.details[0].berth_id) {
            console.log('get berth_id list')
            await getJettyList(resp.data.details[0].berth_id);
         }
         let setDetail = {
            ...resp.data.details[0],
            mooring_date: resp.data.details[0].mooring_date ? new Date(resp.data.details[0].mooring_date) : "",
            departure_date: resp.data.details[0].departure_date ? new Date(resp.data.details[0].departure_date) : "",
         };
         // console.log('setDetail',resp.data.details)
         formGroup.value = { ...resp.data, details: [setDetail] };
         let vessel = resp.data.vessel;
         vesselData.value = {
            owner: vessel.owner,
            vesselFlagName: vessel.vessel_flag.name,
            name: vessel.name,
            vesselTypeName: vessel.vessel_type,
            imoNumber: vessel.imo_number,
            mmsiNumber: vessel.mmsi_number,
            officialNumber: vessel.official_number,
            callSign: vessel.call_sign,
            licenseExpiredDate: vessel.license_expired_date,
            loadWeight: vessel.load_weight,
            grossTonnage: vessel.gross_tonnage,
            netTonnage: vessel.net_tonnage,
            lengthOverall: vessel.length_overall,
            breadthExtreme: vessel.breadth_extreme,
            depth: vessel.depth,
            mainEngine: vessel.main_engine,
            bandAndModel: vessel.band_and_model,
         };
         portList1.value = formGroup.value.tugs.map((item: any) => {
            return { ...item, is_delete: false };
         });
         portList2.value = formGroup.value.pilots.map((item: any) => {
            return { ...item, is_delete: false };
         });
         portList3.value = formGroup.value.products.map((item: any) => {
            return { ...item, is_delete: false };
         });
         mooringDate.value = resp.data.details[0].mooring_date ? new Date(resp.data.details[0].mooring_date) : "";
         departureDate.value = resp.data.details[0].departure_date ? new Date(resp.data.details[0].departure_date) : "";
         vesselSelect.value = vesselData.value;
         setTimeout(() => {
            formGroup.value.details[0].jetty_id = resp.data.details[0].jetty_id
         }, 1000);
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

onBeforeRouteLeave((to, from, next) => {
   if (notAllowNavigate.value) {
      isConfirmLeaveDialogOpen.value = true;
      nextRoute.value = to;
      next(false); // Prevent navigation until confirmed
   } else {
      next(); // Allow navigation
   }
});

const getPortList = async () => {
   try {
      isLoading.value = true;
      const resp = await getPort();
      if (resp.statusCode === 200) {
         const { data } = resp.data;
         portList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const getBerthList = async () => {
   try {
      // isLoading.value = true;
      const resp = await getBerth();
      if (resp.statusCode === 200) {
         const { data } = resp.data;
         berthList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const getPurposeList = async () => {
   try {
      // isLoading.value = true;
      const resp = await getPurpose();
      if (resp.statusCode === 200) {
         const { data } = resp.data;
         purposeList.value = data.map((item) => {
            return { ...item, id: item.purpose_id };
         });
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const getCargoTypeList = async () => {
   try {
      // isLoading.value = true;
      const resp = await getCargoType();
      if (resp.statusCode === 200) {
         const { data } = resp.data;
         cargoTypeList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const getCargoWharfageList = async () => {
   try {
      // isLoading.value = true;
      const resp = await getCargoWharfage();
      if (resp.statusCode === 200) {
         const { data } = resp.data;
         cargoWharfageList.value = data;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const getJettyList = async (id: number) => {
   try {
      // console.log("jettys id", id);
      // isLoading.value = true;
      if (id) {
         const resp = await getJetty(id);
         if (resp.statusCode === 200) {
            const { data, jettys } = resp.data;
            // console.log("jettys id", jettys);
            jettyList.value = jettys;
         }
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

async function onSubmit() {
   await allFieldPristine();
   const fieldsWithErrors = await checkFieldErrors(fieldValidation.value);
   if (fieldsWithErrors.length > 0) {
      return;
   }
   const newPayload: IVtmsLogBookAdd = {
      vesselType: vesselType,
      ...formGroup.value,
      vessel_id: vesselData.value.id,
      tugs: portList1.value,
      pilots: portList2.value,
      products: portList3.value,
      // details: [
      //    {
      //       mooring_date: "2024-10-07T19:00:00+07:00",
      //       departure_date: "2024-10-08T19:00:00+07:00",
      //    },
      // ],
      purpose_type: "Government"
   };

   payload.value = { ...newPayload };
   console.log("Payload", payload.value);
   isConfirmDialogOpen.value = true;
}
const mooringDate = ref<any>(new Date());
const onMooringDateChange = (newDate: any) => {
   formGroup.value.details[0].mooring_date = newDate ? new Date(newDate) : "";
};
const departureDate = ref<any>(new Date());
const onDepartureDateChange = (newDate: any) => {
   formGroup.value.details[0].departure_date = newDate ? new Date(newDate) : "";
};
const dialogCancel = () => {
   isConfirmDialogOpen.value = false;
};
const dialogConfirm = async () => {
   isLoading.value = true;
   notAllowNavigate.value = false;
   if (logBookId) {
      const resp = await updateVtmsLogBook(logBookId, payload.value);
      if (resp.statusCode === 200) {
         isAlertDialogUpdateOpen.value = true;
         modalAlertMessage.value = "การบันทึกLogbookของคุณสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogUpdateOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      const resp = await addVtmsLogBook(payload.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertMessage.value = "การเพิ่มLogbookคุณสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }

   isLoading.value = false;
   isConfirmDialogOpen.value = false;
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      navigateTo("/vtms/log-book");
   }
   isAlertDialogOpen.value = false;
};

const handleCloseAlertDialogUpdate = () => {
   isAlertDialogUpdateOpen.value = false;
   navigateTo("/vtms/log-book");
   // getLogBookDetailById(logBookId);
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
const handleChangeVessel = (value: any) => {
   vesselData.value = value;
   vesselSearchDisplay.value = value.name;
};
const vesselSearchDisplay = ref("");

const onSearchVessels = async (q: any) => {
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
   const resp = await getVessel(filter);
   if (resp.statusCode === 200) {
      return resp.data.data.map((e: IVesselData) => ({ ...e, id: e.id, name: e.name }));
   }
   return [];
};

//tug boat
const isDialogTugBoatFormOpen = ref(false);
const handleTugBoatForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogTugBoatFormOpen.value = status;
};
const dialogTugBoatCancel = () => {
   isDialogTugBoatFormOpen.value = false;
};
const dialogTugBoatConfirm = (status: boolean, type: string = "") => {
   isDialogTugBoatFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getTugBoatList();
   }
};

// navigate
const isDialogNavigateFormOpen = ref(false);
const handleNavigateForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogNavigateFormOpen.value = status;
};
const dialogNavigateCancel = () => {
   isDialogNavigateFormOpen.value = false;
};
const dialogNavigateConfirm = (status: boolean, type: string = "") => {
   isDialogNavigateFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getNavigateList();
   }
};

// inventory

const isDialogInventoryFormOpen = ref(false);
const handleInventoryForm = (status: boolean, mode: string, vesselTypeValue: string) => {
   actionMode.value = mode;
   vesselType.value = vesselTypeValue;
   isDialogInventoryFormOpen.value = status;
};
const dialogInventoryCancel = () => {
   isDialogInventoryFormOpen.value = false;
};
const dialogInventoryConfirm = (status: boolean, type: string = "") => {
   isDialogInventoryFormOpen.value = status;
   if (type === "refresh") {
      // filter.value.page = 1;
      // getInventoryList();
   }
};
const addTug = (tugs: any[]) => {
   tugs.forEach((tug: any) => {
      const body = {
         id: 0,
         tug_id: tug.tug_id,
         tug_name: tug.name,
         tug_type: tug.type,
         status: formGroup.value.status === "Arrival" ? "Vessel In" : "Vessel Out",
         is_delete: false,
      };
      portList1.value.push(body);
   });
};

const editTug = (updatedTug: any, index: number) => {
   console.log('updatedTug', updatedTug);
   console.log('index', index);
   const existingTug = portList1.value[index];
   if (existingTug) {
      portList1.value[index] = {
         ...existingTug,
         tug_id: updatedTug.tug_id,
         tug_name: updatedTug.name,
         tug_type: updatedTug.type,
         is_delete: false,
      };
   }
};

const deleteTug = (id: any) => {
   try {
      console.log("deleteTug", id);
      const targetId = id;
      const index = portList1.value.findIndex((item) => item.id === targetId);
      if (id == 0) {
         portList1.value.splice(index, 1);
      } else {
         portList1.value[index].is_delete = true;
      }
   } catch (error) {
      console.error(error);
   }
};

const addPilot = (pilots: any) => {
   pilots.forEach((pilot: any) => {
      const body = {
         id: 0,
         pilot_id: pilot.pilot_id,
         pilot_number: pilot.number,
         pilot_name: pilot.name,
         pilot_tel: pilot.tel,
         status: formGroup.value.status === "Arrival" ? "Vessel In" : "Vessel Out",
         is_delete: false,
      };
      portList2.value.push(body);
   });
};

const editPilot = (updatedPilot: any, index: number) => {
   const existingPilot = portList2.value[index];
   if (existingPilot) {
      portList2.value[index] = {
         ...existingPilot,
         pilot_id: updatedPilot.pilot_id,
         pilot_number: updatedPilot.number,
         pilot_name: updatedPilot.name,
         pilot_tel: updatedPilot.tel,
         is_delete: false,
      };
   }
};
const deletePilot = (id: any) => {
   try {
      console.log("deletePilot", id);
      const targetId = id;
      const index = portList2.value.findIndex((item) => item.id === targetId);
      if (id == 0) {
         portList2.value.splice(index, 1);
      } else {
         portList2.value[index].is_delete = true;
      }
   } catch (error) {
      console.error(error);
   }
};

const addProduct = (event) => {
   try {
      let body = {
         id: 0,
         product_type_id: event.product_type_id,
         product_group_name: event.product_group_name,
         product_type_name: event.product_type_name,
         status: "",
         // unit : 'MTon',
         mTonQty: event.mTonQty,
         rTonQty: event.rTonQty,
         is_delete: false,
      };
      portList3.value.push(body);

      itemDataProduct.value = null;
   } catch (error) {
      console.error(error);
   }
};
const editProduct = (event) => {
   try {
      let body = {
         id: event.id,
         product_type_id: event.product_type_id,
         product_group_name: event.product_group_name,
         product_type_name: event.product_type_name,
         status: "",
         // unit : 'MTon',
         mTonQty: event.mTonQty,
         rTonQty: event.rTonQty,
         is_delete: false,
      };
      console.log("editInventory", body);
      const targetId = event.id;
      const index = portList3.value.findIndex((item) => item.id === targetId);
      portList3.value[index] = body;
   } catch (error) {
      console.error(error);
   }
};
const deleteProduct = (id: any) => {
   try {
      console.log("deleteProduct", id);
      const targetId = id;
      const index = portList3.value.findIndex((item) => item.id === targetId);
      if (id == 0) {
         portList3.value.splice(index, 1);
      } else {
         portList3.value[index].is_delete = true;
      }
   } catch (error) {
      console.error(error);
   }
};

// Table 1
const columnsTable1 = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: t("navigation_status"),
      // class: "text-center",
   },
   {
      key: "tug_name",
      label: t("ship_name"),
   },
   {
      key: "tug_type",
      label: t("ship_type"),
   },
   {
      key: "actions",
      sortable: false,
   },
];
const itemIndexTug = ref(0);
const itemIndexPilot = ref(0);
const itemIdProduct = ref(0);
const itemDataTug = ref();
const itemDataPilot = ref();
const itemDataProduct = ref();
const portList1 = ref<any>([]);
const portListShow1 = computed(() => {
   return portList1.value.filter((item) => !item.is_delete);
});
const getMenuTable1 = (row: any, index: number) => {
   const { status } = row;
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               itemIndexTug.value = index;
               itemDataTug.value = row;
               handleTugBoatForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deleteTug(row.id);
            },
         },
      ],
   ];
   return items;
};

// Table 2
const columnsTable2 = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: t("navigation_status"),
      // class: "text-center",
   },
   {
      key: "pilot_number",
      label: t("code"),
   },
   {
      key: "pilot_name",
      label: t("pilot_name"),
   },
   {
      key: "pilot_tel",
      label: t("phone_number"),
   },
   {
      key: "actions",
      sortable: false,
   },
];
const portList2 = ref<any>([]);
const portListShow2 = computed(() => {
   return portList2.value.filter((item) => !item.is_delete);
});
const getMenuTable2 = (row: any, index: number) => {
   const { status } = row;
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               itemIndexPilot.value = index;
               itemDataPilot.value = row;
               handleNavigateForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deletePilot(row.id);
            },
         },
      ],
   ];
   return items;
};

// Table 3
const columnsTable3 = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "product_group_name",
      label: t("product_group"),
   },
   {
      key: "product_type_name",
      label: t("product_kind"),
   },
   {
      key: "mTonQty",
      label: "ปริมาณ M/Ton",
   },
   {
      key: "rTonQty",
      label: "ปริมาณ R/Ton",
   },
   {
      key: "actions",
      sortable: false,
   },
];
const portList3 = ref<any>([]);
const portListShow3 = computed(() => {
   return portList3.value.filter((item) => !item.is_delete);
});
const getMenuTable3 = (row: any) => {
   const { status } = row;
   const items = [
      [
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               itemIdProduct.value = row.id;
               console.log("itemData", row);
               itemDataProduct.value = row;
               handleInventoryForm(true, "edit", "");
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               deleteProduct(row.id);
            },
         },
      ],
   ];
   return items;
};
const fieldValidation = ref<any>({
   gross_tonnage: { message: t("required"), pristine: false, isFieldError: false },
   depth: { message: t("required"), pristine: false, isFieldError: false },
   port_id_last: { message: t("required"), pristine: false, isFieldError: false },
   port_id_next: { message: t("required"), pristine: false, isFieldError: false },
   berth_id: { message: t("required"), pristine: false, isFieldError: false },
   purpose_id: { message: t("required"), pristine: false, isFieldError: false },
   cargo_type_id: { message: t("required"), pristine: false, isFieldError: false },
   cargo_wharfage_id: { message: t("required"), pristine: false, isFieldError: false },
   jetty_id: { message: t("required"), pristine: false, isFieldError: false },
   mooring_date: { message: t("required"), pristine: false, isFieldError: false },
   departure_date: { message: t("required"), pristine: false, isFieldError: false },
});
const allFieldPristine = async (pristineValue: boolean = true) => {
   fieldValidation.value = Object.keys(fieldValidation.value).reduce((acc: any, key) => {
      acc[key] = { ...fieldValidation.value[key], pristine: pristineValue };
      return acc;
   }, {});
};

const isFieldError = (field: any, firstChild: boolean = false) => {
   let value = "";
   if (firstChild) {
      value = formGroup.value[field];
   } else {
      value = formGroup.value.details[0][field];
   }
   const pristine = fieldValidation.value[field].pristine;
   fieldValidation.value[field].isFieldError = false;

   if (field !== "departure_date" && !value && pristine) {
      fieldValidation.value[field].message = t("required");
      fieldValidation.value[field].isFieldError = true;
      return true;
   }

   if (field === "departure_date") {
      const mooringDate = formGroup.value.details[0].mooring_date;
      if (value && mooringDate && new Date(value) < new Date(mooringDate)) {
         fieldValidation.value[field].message = t("วันที่เรือออกต้องมากกว่าหรือเท่ากับวันที่เรือเข้า");
         fieldValidation.value[field].isFieldError = true;
         return true;
      }
   }

   return false;
};
const checkFieldErrors = async (fields) => {
   const errorFields = [];
   for (const [fieldName, validation] of Object.entries(fields)) {
      if (validation.isFieldError) {
         errorFields.push(fieldName);
      }
   }
   return errorFields;
};
</script>
