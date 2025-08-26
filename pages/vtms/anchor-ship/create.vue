<template>
   <div class="mb-8">
      <h1 class="font-bold text-[30px]">Anchor</h1>
   </div>
   <!-- <UForm :schema="anchorSchema" :state="formGroup" @submit="onSubmit"> -->
   <div id="log-book-create-form-content" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
      <div class="flex items-center justify-between mb-5">
         <div>
            <h1 class="font-semibold text-lg text-grayy-400">ข้อมูลเรือทิ้งสมอ</h1>
            <div class="mt-1 text-grayy-75 text-sm">รายละเอียดข้อมูลเรือทิ้งสมอ</div>
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
      <div class="col-span-2">
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
         <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเรือ</h2>
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
               <!-- <Input is-view :label="'วันหมดอายุทะเบียนเรือ'" name="LicenseExpiredDate" :placeholder="''" v-model="vesselData.licenseExpiredDate" /> -->
               <UFormGroup name="vesselLicenseExpiredDate">
                  <Input
                     is-view
                     :label="'วันหมดอายุทะเบียนเรือ'"
                     name="LicenseExpiredDate"
                     :placeholder="''"
                     v-model="vesselData.licenseExpiredDate"
                     :help-text="
                        daysRemaining < 30 && daysRemaining != 0
                           ? daysRemaining > 0
                              ? `ใบอนุญาตใช้เรือจะหมดอายุในอีก ${daysRemaining} วัน`
                              : 'ใบอนุญาตทะเบียนเรือหมดอายุแล้ว'
                           : ''
                     "
                  />
               </UFormGroup>
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
         <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเรือทิ้งสมอ</h2>
         <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1">
               <NumericInput
                  label="Gross Tonnage (Confirm)"
                  placeholder="0.000"
                  name="grossTonnage"
                  required
                  v-model="formGroup.gross_tonnage"
                  :error="isFieldError('gross_tonnage', true) ? fieldValidation.gross_tonnage.message : ''"
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
                  :error="isFieldError('depth', true) ? fieldValidation.depth.message : ''"
               />
            </div>
            <div class="col-span-1">
               <USelect
                  :label="'Last Port'"
                  name="LastPort"
                  :placeholder="'Last Port'"
                  required
                  :searchable-placeholder="'Last Port'"
                  v-model="formGroup.port_id_last"
                  :error="isFieldError('port_id_last', true) ? fieldValidation.port_id_last.message : ''"
                  searchable
                  :options="portList"
               />
            </div>
            <div class="col-span-1">
               <USelect
                  :label="'Next Port'"
                  name="NextPort"
                  :placeholder="'Next Port'"
                  required
                  :searchable-placeholder="'Next Port'"
                  v-model="formGroup.port_id_next"
                  :error="isFieldError('port_id_next', true) ? fieldValidation.port_id_next.message : ''"
                  searchable
                  :options="portList"
               />
            </div>
            <div class="col-span-1">
               <Input
                  :label="'Voyage'"
                  name="voyage"
                  :placeholder="'voyage'"
                  required
                  v-model="formGroup.voyage"
                  :error="isFieldError('voyage', true) ? fieldValidation.voyage.message : ''"
               />
            </div>
            <div class="col-span-1">
               <USelect
                  :label="'รอเทียบท่า'"
                  name="berth"
                  :placeholder="'ค้นหา'"
                  required
                  :searchable-placeholder="'ค้นหา'"
                  v-model="formGroup.anchors[0].berth_id"
                  :error="isFieldError('berth_id') ? fieldValidation.berth_id.message : ''"
                  searchable
                  :options="berthList"
                  option-attribute="name_th"
                  value-attribute="id"
               />
            </div>
            <div class="col-span-1">
               <UFormGroup :label="'วันที่นัดนำร่อง'" required>
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <UInput
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.anchors[0].pilot_date"
                        :value="formGroup.anchors[0].pilot_date ? `${format(formGroup.anchors[0].pilot_date, 'd MMM, yyy, HH:mm')}` : ''"
                        :error="isFieldError('pilot_date') ? fieldValidation.pilot_date.message : ''"
                        :placeholder="'วันที่นัดนำร่อง'"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

                     <template #panel="{ close }">
                        <Datepicker v-model="pilotDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onPilotDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>
            </div>
            <div class="col-span-1">
               <UFormGroup :label="'วันที่ทอดสมอ'" required>
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <UInput
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.anchors[0].anchor_date"
                        :value="formGroup.anchors[0].anchor_date ? `${format(formGroup.anchors[0].anchor_date, 'd MMM, yyy, HH:mm')}` : ''"
                        :error="isFieldError('anchor_date') ? fieldValidation.anchor_date.message : ''"
                        :placeholder="'วันที่ทอดสมอ'"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

                     <template #panel="{ close }">
                        <Datepicker v-model="anchorDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onAnchorDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>
            </div>
            <div class="col-span-1">
               <Input
                  :label="'ละติจูดที่ทอดสมอ'"
                  name="latitude"
                  :placeholder="'latitude'"
                  required
                  v-model="formGroup.anchors[0].latitude"
                  :error="isFieldError('latitude') ? fieldValidation.latitude.message : ''"
               />
            </div>
            <div class="col-span-1">
               <Input
                  :label="'ลองติจูดที่ทอดสมอ'"
                  name="longitude"
                  :placeholder="'longitude'"
                  required
                  v-model="formGroup.anchors[0].longitude"
                  :error="isFieldError('longitude') ? fieldValidation.longitude.message : ''"
               />
            </div>
            <div class="col-span-1">
               <UFormGroup :label="'วันที่ถอนสมอ'">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                     <UInput
                        size="md"
                        variant="outline"
                        color="purple"
                        custom-icon="calendar"
                        v-model="formGroup.anchors[0].aweigh_date"
                        :value="formGroup.anchors[0].aweigh_date ? `${format(formGroup.anchors[0].aweigh_date, 'd MMM, yyy, HH:mm')}` : ''"
                        :placeholder="'วันที่ถอนสมอ'"
                        :ui="{
                           wrapper: 'w-full rounded-md bg-white',
                        }"
                     />

                     <template #panel="{ close }">
                        <Datepicker v-model="aweighDate" @close="close" is-required is24hr type="normal" mode="dateTime" v-on:date-change="onAweighDateChange" />
                     </template>
                  </UPopover>
               </UFormGroup>
            </div>
            <div class="col-span-2">
               <Input
                  :label="'หมายเหตุ'"
                  name="remark"
                  :placeholder="'หมายเหตุ'"
                  required
                  v-model="formGroup.anchors[0].remark"
                  :error="isFieldError('remark') ? fieldValidation.remark.message : ''"
               />
            </div>
         </div>
      </div>
   </div>
   <!-- </UForm> -->
   <DialogConfirm
      :title="isEdit ? $t('save_anchor_ship') : $t('add_anchor_ship')"
      :desc="isEdit ? $t('confirm_save_anchor_ship') : $t('confirm_add_anchor_ship')"
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
      :dialogConfirm="() => navigateTo('/vtms/anchor-ship')"
   />
   <DialogAlert
      :isOpen="isAlertDialogOpen"
      :desc="modalAlertMessage"
      :title="$t('add_anchor_ship')"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialog"
      :btnName="$t('close')"
   />
   <DialogAlert
      :isOpen="isAlertDialogUpdateOpen"
      :desc="modalAlertMessage"
      :title="$t('save_anchor_ship')"
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
import type { IVtmsAnchorAdd } from "~/core/interfaces/IVtmsAnchor";
import { format } from "date-fns";
import UInput from "~/components/form/u-input.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import anchorService from "~/core/services/vtms/anchorService.ts";
import type { IVesselData } from "~/core/interfaces/IVesselData";

const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === "edit";
const { addVtmsAnchor, updateVtmsAnchor, getVtmsAnchorDetail, getVessel, getPort, getBerth } = anchorService();
const query: any = route.query;
const anchorId = isEdit && query.id;
const vesselType = query.vesselType;
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

const createSchema = () => {
   return z.object({});
};

const anchorSchema = ref(createSchema());

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
   depth: 0,
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
   //   "document_id": 0,
   anchors: [
      {
         berth_id: 0,
         purpose_id: 0,
         cargo_type_id: 0,
         cargo_wharfage_id: 0,
         // use_berth_id: 0,
         pilot_date: "",
         anchor_date: "",
         aweigh_date: "",
         // pilot_date: "2024-10-07T19:00:00+07:00",
         // anchor_date: "2024-10-08T19:00:00+07:00",
         // aweigh_date: "2024-10-08T19:00:00+07:00",
         latitude: "",
         longitude: "",
         remark: "",
      },
   ],
});
const portList = ref([]);
const berthList = ref([]);
// const arrivalDate = ref(new Date())
const arrivalDate = ref();

watch(
   () => vesselSelect.value,
   (value) => {
      if (value) {
         vesselData.value = value;
         formGroup.value.gross_tonnage = value.grossTonnage;
         formGroup.value.depth = value.depth;
      }
   }
);
const daysRemaining = computed(() => {
   const currentDate = new Date();
   if ((vesselData.value.licenseExpiredDate && !new Date(vesselData.value.licenseExpiredDate)) || vesselData.value.licenseExpiredDate == null) {
      return 0;
   }
   console.log("sss", vesselData.value.licenseExpiredDate);
   const diffTime = new Date(vesselData.value.licenseExpiredDate).getTime() - currentDate.getTime();
   let day = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   return day ? day : null; // Convert ms to days
});
const errors = ref<FormError[]>([]);

const getError = (field: string) => {
   const error = errors.value.find((err) => err.path === field);
   return error ? error.message : null;
};

const payload = ref<IVtmsAnchorAdd>({
   vesselType: "",
   document_berth_id: 0,
   vessel_id: 0,
   gross_tonnage: 0,
   depth: 0,
   port_id_next: 0,
   port_id_last: 0,
   voyage: "",
   anchors: [
      {
         berth_id: 0,
         purpose_id: 0,
         cargo_type_id: 0,
         cargo_wharfage_id: 0,
         pilot_date: "",
         anchor_date: "",
         aweigh_date: "",
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
   if (anchorId) {
      await getAnchorDetailById(+anchorId);
   }
});
const getMasterList = async () => {
   await getBerthList();
};
const getAnchorDetailById = async (id: number) => {
   try {
      isLoading.value = true;
      const resp = await getVtmsAnchorDetail(id);
      if (resp.statusCode === 200) {
         let setDetail = {
            ...resp.data.anchors,
            pilot_date: resp.data.anchors.pilot_date ? new Date(resp.data.anchors.pilot_date) : "",
            anchor_date: resp.data.anchors.anchor_date ? new Date(resp.data.anchors.anchor_date) : "",
            aweigh_date: resp.data.anchors.aweigh_date ? new Date(resp.data.anchors.aweigh_date) : "",
         };
         formGroup.value = { ...resp.data, anchors: [setDetail] };
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
         vesselSelect.value = vesselData.value;
         // if (resp.data.details.berth_id) {
         //    await getJettyList(resp.data.details.berth_id);
         // }
         // console.log("get detail", formGroup.value);
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

async function onSubmit() {
   await allFieldPristine();
   const fieldsWithErrors = await checkFieldErrors(fieldValidation.value);
   if (fieldsWithErrors.length > 0) {
      return;
   }
   const newPayload: IVtmsAnchorAdd = {
      vesselType: vesselType,
      ...formGroup.value,
      vessel_id: vesselData.value.id,
      // details: [
      //    {
      //       pilot_date: "2024-10-07T19:00:00+07:00",
      //        anchor_date: "2024-10-08T19:00:00+07:00",
      //  aweigh_date: "2024-10-08T19:00:00+07"
      //    },
      // ],
   };

   payload.value = { ...newPayload };
   console.log("Payload", payload.value);
   isConfirmDialogOpen.value = true;
}
const pilotDate = ref<any>(new Date());
const onPilotDateChange = (newDate: any) => {
   formGroup.value.anchors[0].pilot_date = newDate ? new Date(newDate) : "";
};
const anchorDate = ref<any>(new Date());
const onAnchorDateChange = (newDate: any) => {
   formGroup.value.anchors[0].anchor_date = newDate ? new Date(newDate) : "";
};
const aweighDate = ref<any>(new Date());
const onAweighDateChange = (newDate: any) => {
   formGroup.value.anchors[0].aweigh_date = newDate ? new Date(newDate) : "";
};

const dialogCancel = () => {
   isConfirmDialogOpen.value = false;
};
const dialogConfirm = async () => {
   isLoading.value = true;
   notAllowNavigate.value = false;
   if (anchorId) {
      const resp = await updateVtmsAnchor(anchorId, payload.value);
      if (resp.statusCode === 200) {
         isAlertDialogUpdateOpen.value = true;
         modalAlertMessage.value = "การบันทึกเรือทิ้งสมอของคุณสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogUpdateOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      const resp = await addVtmsAnchor(payload.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertMessage.value = "การเพิ่มเรือทิ้งสมอของคุณสำเร็จแล้ว";
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
      navigateTo("/vtms/anchor-ship");
   }
   isAlertDialogOpen.value = false;
};

const handleCloseAlertDialogUpdate = () => {
   isAlertDialogUpdateOpen.value = false;
   console.log("close update", modalAlertType.value);
   if (modalAlertType.value === "success") {
      navigateTo("/vtms/anchor-ship");
   }
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
const fieldValidation = ref<any>({
   gross_tonnage: { message: t("required"), pristine: false, isFieldError: false },
   depth: { message: t("required"), pristine: false, isFieldError: false },
   port_id_last: { message: t("required"), pristine: false, isFieldError: false },
   port_id_next: { message: t("required"), pristine: false, isFieldError: false },
   voyage: { message: t("required"), pristine: false, isFieldError: false },
   pilot_date: { message: t("required"), pristine: false, isFieldError: false },
   anchor_date: { message: t("required"), pristine: false, isFieldError: false },
   latitude: { message: t("required"), pristine: false, isFieldError: false },
   longitude: { message: t("required"), pristine: false, isFieldError: false },
   remark: { message: t("required"), pristine: false, isFieldError: false },
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
      value = formGroup.value.anchors[0][field];
   }
   const pristine = fieldValidation.value[field].pristine;
   fieldValidation.value[field].isFieldError = false;
   if (!value && pristine) {
      console.log("error", fieldValidation.value[field]);
      fieldValidation.value[field].message = t("required");
      fieldValidation.value[field].isFieldError = true;
      return true;
   }
   if (field === "end" && value && new Date(value) < new Date(formGroup.value.start)) {
      fieldValidation.value[field].message = t("ระยะเวลาสัญญาสิ้นสุดต้องมากกว่าหรือเท่ากับระยะเวลาสัญญาเริ่มต้น");
      return true;
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
