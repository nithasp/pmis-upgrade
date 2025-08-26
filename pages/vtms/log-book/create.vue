<template>
   <div class="mb-8">
      <h1 class="font-bold text-[30px]">Log Book</h1>
   </div>
   <UForm :schema="logBookSchema" :state="formGroup" @submit="onSubmit">
      <div id="log-book-create-form-content" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
         <div class="flex items-center justify-between mb-5">
            <div>
               <h1 class="font-semibold text-lg text-grayy-400">ข้อมูลเรือราชการ</h1>
               <div class="mt-1 text-grayy-75 text-sm">รายละเอียดข้อมูลเรือราชการ</div>
            </div>
            <div class="">
               <UButton @click="handleCancleCreateVessel" class="mx-2 border border-grayy-100" size="md" color="gray" :label="isEdit ? $t('close') : $t('cancel')" />
               <UButton size="md" :label="$t('save')" type="submit" />
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
                  <Input is-view :label="'ชื่อเรือ'" name="name" :placeholder="'name'" v-model="vesselData.name" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'สัญชาติเรือ/ธงเรือ'" name="vesselFlagName" :placeholder="'vesselFlagName'" v-model="vesselData.vesselFlagName" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'หมายเลขเรือราชการ'" name="officialNumber" :placeholder="'officialNumber'" v-model="vesselData.officialNumber" />
               </div>
               <UDivider class="my-4 col-span-2" />

               <div class="col-span-1">
                  <Input is-view :label="'ความยาว(LOA)'" name="vesselTypeName" :placeholder="'vesselTypeName'" v-model="vesselData.loa" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ความกว้าง(Breadth)'" name="IMONumber" :placeholder="'imoNumber'" v-model="vesselData.breadth" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'กินน้ำลึก(Draft)'" name="MMSI Number" :placeholder="'mmsiNumber'" v-model="vesselData.draft" />
               </div>
               <div class="col-span-1">
                  <Input is-view :label="'ระวางขับน้ำ(Displacemen t)'" name="MMSI Number" :placeholder="'mmsiNumber'" v-model="vesselData.displaceent" />
               </div>
            </div>
         </div>
         <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลท่าเทียบเรือ</h2>
            <div class="grid grid-cols-2 gap-4">
               <div class="col-span-1">
                  <USelect
                     :label="'ท่าเทียบเรือ'"
                     name="berth"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].berth_id"
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
                     searchable
                     option-attribute="purpose_name"
                     :options="purposeList"
                  />
               </div>
               <div class="col-span-1">
                  <USelect
                     :label="'ลักษณะสินค้า'"
                     name="cargo_type"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].cargo_type_id"
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
                     searchable
                     :options="cargoWharfageList"
                  />
               </div>
               <div class="col-span-1">
                  <USelect
                     :label="'ท่าเทียบเรือย่อย'"
                     name="jetty"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].jetty_id"
                     searchable
                     :options="jettyList"
                     :disabled="!formGroup.details[0].berth_id"
                  />
               </div>
               <!-- <div class="col-span-1">
                  <Input
                     :label="'Gross Tonnage (Confirm)'"
                     name="grossTonnage"
                     :placeholder="'grossTonnage'"
                     required
                     v-model="formGroup.gross_tonnage"
                     type="number"
                  />
               </div> -->
               <!-- <div class="col-span-1">
                  <Input :label="'กินน้ำลึก (Confirm)'" name="Depth" :placeholder="'Depth'" required v-model="formGroup.depth" />
               </div> -->
               <!-- <div class="col-span-1">
                  <USelect
                     :label="'Last Port'"
                     name="LastPort"
                     :placeholder="'Last Port'"
                     required
                     :searchable-placeholder="'Last Port'"
                     v-model="formGroup.port_id_last"
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
                     searchable
                     :options="portList"
                  />
               </div> -->
               <!-- <div class="col-span-1">
                  <Input :label="'Voyage'" name="voyage" :placeholder="'voyage'" required v-model="formGroup.voyage" />
               </div> -->
            </div>
         </div>
         <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเทียบท่า</h2>
            <div class="grid grid-cols-2 gap-4">
               <!-- <div class="col-span-1">
                  <USelect
                     :label="'ท่าเทียบเรือ'"
                     name="berth"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].berth_id"
                     searchable
                     :options="berthList"
                     option-attribute="name_th"
                     value-attribute="id"
                  />
               </div> -->
               <!-- <div class="col-span-1">
                  <USelect
                     :label="'วันถุประสงค์เทียบท่า'"
                     name="purpose"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].purpose_id"
                     searchable
                     option-attribute="purpose_name"
                     :options="purposeList"
                  />
               </div> -->
               <!-- <div class="col-span-1">
                  <USelect
                     :label="'ลักษณะสินค้า'"
                     name="cargo_type"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].cargo_type_id"
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
                     searchable
                     :options="cargoWharfageList"
                  />
               </div> -->
               <!-- <div class="col-span-1">
                  <USelect
                     :label="'ท่าเทียบเรือย่อย'"
                     name="jetty"
                     :placeholder="'ค้นหา'"
                     required
                     :searchable-placeholder="'ค้นหา'"
                     v-model="formGroup.details[0].jetty_id"
                     searchable
                     :options="jettyList"
                     :disabled="!formGroup.details[0].berth_id"
                  />
               </div> -->
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
                           :value="formGroup.details[0].mooring_date ? `${format(formGroup.details[0].mooring_date, 'd MMM, yyy, HH:mm')}` : ''"
                           :placeholder="'เลือกวัน-เวลา'"
                           :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }"
                        />

                        <template #panel="{ close }">
                           <Datepicker v-model="formGroup.details[0].mooring_date" @close="close" is24hr type="normal" mode="dateTime" />
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
               <div class="col-span-1">
                  <UFormGroup :label="'วันที่เรือออก'" required>
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <UInput
                           size="md"
                           variant="outline"
                           color="purple"
                           custom-icon="calendar"
                           :value="formGroup.details[0].departure_date ? `${format(formGroup.details[0].departure_date, 'd MMM, yyy, HH:mm')}` : ''"
                           :placeholder="'เลือกวัน-เวลา'"
                           :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }"
                        />

                        <template #panel="{ close }">
                           <Datepicker v-model="formGroup.details[0].departure_date" @close="close" is24hr type="normal" mode="dateTime" />
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
            </div>
         </div>
      </div>
   </UForm>
   <DialogConfirm
      :title="isEdit ? $t('save_vessel_agent') : $t('add_vessel_agent')"
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
      :title="$t('add_vessel_agent')"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialog"
      :btnName="$t('close')"
   />
   <DialogAlert
      :isOpen="isAlertDialogUpdateOpen"
      :desc="modalAlertMessage"
      :title="$t('save_vessel_agent')"
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
import type { IVesselData } from "~/core/interfaces/IVesselData";

const { t } = useI18n();
const route = useRoute();
const isEdit = route.params.mode === "edit";
const { addVtmsLogBook, updateVtmsLogBook, getVtmsLogBookDetail, getVessel, getPort, getBerth, getPurpose, getJetty } = logBookService();
const { getCargoWharfage } = useCargoWharfageService();
const { getCargoType } = useCargoTypeService();
const query: any = route.query;
const logBookId = isEdit && query.id;
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

const logBookSchema = ref(createSchema());

const vesselData = ref({
   name: "",
   vesselFlagName: "",
   officialNumber: "",
   loa: 0,
   breadth: 0,
   draft: 0,
   displaceent: 0,
});
const vesselSelect = ref({
   name: "",
   vesselFlagName: "",
   officialNumber: "",
   loa: 0,
   breadth: 0,
   draft: 0,
   displaceent: 0,
});
const formGroup = ref({
   document_berth_id: 0,
   gross_tonnage: 0,
   depth: 0,
   voyage: "",
   port_id_next: 0,
   port_id_last: 0,

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
const mooring_date = ref("");
const departure_date = ref("");
const portList = ref([]);
const berthList = ref([]);
const purposeList = ref([]);
const cargoTypeList = ref([]);
const cargoWharfageList = ref([]);
const jettyList = ref([]);
// const arrivalDate = ref(new Date())
const arrivalDate = ref();

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
      if (value) {
         getJettyList(value);
      }
   }
);
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
         let setDetail = {
            ...resp.data.details,
            mooring_date: new Date(resp.data.details.mooring_date),
            departure_date: new Date(resp.data.details.departure_date),
         };
         formGroup.value = { ...resp.data, details: [setDetail] };
         let vessel = resp.data.vessel;
         // vesselData.value = {
         //    owner: vessel.owner,
         //    vesselFlagName: vessel.vessel_flag.name,
         //    name: vessel.name,
         //    vesselTypeName: vessel.vessel_type,
         //    imoNumber: vessel.imo_number,
         //    mmsiNumber: vessel.mmsi_number,
         //    officialNumber: vessel.official_number,
         //    callSign: vessel.call_sign,
         //    licenseExpiredDate: vessel.license_expired_date,
         //    loadWeight: vessel.load_weight,
         //    grossTonnage: vessel.gross_tonnage,
         //    netTonnage: vessel.net_tonnage,
         //    lengthOverall: vessel.length_overall,
         //    breadthExtreme: vessel.breadth_extreme,
         //    depth: vessel.depth,
         //    mainEngine: vessel.main_engine,
         //    bandAndModel: vessel.band_and_model,
         // };
         vesselData.value = {
            name: "",
            vesselFlagName: "",
            officialNumber: "",
            loa: 0,
            breadth: 0,
            draft: 0,
            displaceent: 0,
         };
         vesselSelect.value = vesselData.value;
         if (resp.data.details.berth_id) {
            await getJettyList(resp.data.details.berth_id);
         }
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
      console.log("jettys id", id);
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
async function onSubmit(event: FormSubmitEvent<z.output<typeof logBookSchema.value>>) {
   if (errors.value.length === 0) {
      const newPayload: IVtmsLogBookAdd = {
         vesselType: vesselType,
         ...formGroup.value,
         vessel_id: vesselData.value.id,
         // details: [
         //    {
         //       mooring_date: "2024-10-07T19:00:00+07:00",
         //       departure_date: "2024-10-08T19:00:00+07:00",
         //    },
         // ],
      };

      payload.value = { ...newPayload };
      console.log("Payload", payload.value);
      isConfirmDialogOpen.value = true;
   }
}

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
         modalAlertMessage.value = "การเพิ่มLogbookของคุณสำเร็จแล้ว";
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
   getLogBookDetailById(logBookId);
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
</script>
