<template>
   <div class="mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("รายงานเรือเข้า-ออก") }}</h1>
   </div>
   <div id="ship-agent-form-content" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
      <div class="flex items-center justify-between mb-5">
         <div>
            <div class="flex">
               <h1 class="font-semibold text-lg text-grayy-400 mr-4">ข้อมูลเรือเข้า-ออก</h1>
               <!-- <Badge v-if="!isLoading" :label="vesselImportMapDetail.statusDes" :type="renderStatus(vesselImportMapDetail.status)" /> -->
               <BadgeVesselInOut v-if="!isLoading" :label="vesselImportMapDetail.statusDes"
                  :type="vesselImportMapDetail.status" />
            </div>
            <div class="mt-1 text-grayy-75 text-sm">ระบุรายละเอียดข้อมูลเรือเข้า-ออก</div>
         </div>
         <div v-if="!isLoading">
            <div v-if="isStatOfficer && vesselImportMapDetail.status === VesselInOutStatusEnum.PendingCheck"
               class="flex items-center">
               <UButton @click="handleCancelDocument" class="mx-1" size="md" color="red" variant="outline"
                  :label="$t('delete')" />
               <UButton @click="() => navigateToVesselInOutList()" class="mx-1 border border-grayy-100" size="md"
                  color="gray" :label="$t('close')" />
               <UButton @click="() => (isMatchingRequestFormDialogOpen = true)"
                  class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50" size="md"
                  :label="vesselImportMapDetail.documentNumber ? $t('เปลี่ยนคำร้อง') : $t('หาคำร้อง')">
               </UButton>
               <UButton @click="handleClickRejectSendBack" class="mx-1 bg-[#E76E31]" size="md" :label="$t('ส่งกลับ')"
                  type="submit" color="orange">
                  <template #trailing>
                     <NuxtIcon name="redo" class="mb-1" color="text-white" />
                  </template>
               </UButton>
               <UButton @click="handleClickApprove" class="ml-1 bg-[#0E9860]" size="md" :label="$t('approve')"
                  type="submit" color="green">
                  <template #trailing>
                     <NuxtIcon name="check" class="mb-1" color="text-white" />
                  </template>
               </UButton>
            </div>
            <div v-else-if="isStatOfficer && vesselImportMapDetail.status === VesselInOutStatusEnum.PendingEdit"
               class="flex items-center">
               <UButton @click="handleCancelDocument" class="mx-1" size="md" color="red" variant="outline"
                  :label="$t('delete')" />
               <UButton @click="() => navigateToVesselInOutList()" class="mx-1 border border-grayy-100" size="md"
                  color="gray" :label="$t('close')" />
               <UButton @click="() => (isMatchingRequestFormDialogOpen = true)"
                  class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50" size="md"
                  :label="vesselImportMapDetail.documentNumber ? $t('เปลี่ยนคำร้อง') : $t('หาคำร้อง')">
               </UButton>
            </div>
            <div v-else-if="isStatOfficer && vesselImportMapDetail.status === VesselInOutStatusEnum.PendingApproval"
               class="flex items-center">
               <UButton @click="handleCancelDocument" class="mx-1" size="md" color="red" variant="outline"
                  :label="$t('delete')" />
               <UButton @click="() => navigateToVesselInOutList()" class="mx-1 border border-grayy-100" size="md"
                  color="gray" :label="$t('close')" />
            </div>
            <div v-else-if="isStatApprove && vesselImportMapDetail.status === VesselInOutStatusEnum.PendingApproval"
               class="flex items-center">
               <UButton @click="() => navigateToVesselInOutList()" class="mx-1 border border-grayy-100" size="md"
                  color="gray" :label="$t('close')" />
               <UButton @click="handleClickRejectSendBack" class="mx-1 bg-[#E76E31]" size="md" :label="$t('ส่งกลับ')"
                  type="submit" color="orange">
                  <template #trailing>
                     <NuxtIcon name="redo" class="mb-1" color="text-white" />
                  </template>
               </UButton>
               <UButton @click="handleClickApprove" class="ml-1 bg-[#0E9860]" size="md" :label="$t('approve')"
                  type="submit" color="green">
                  <template #trailing>
                     <NuxtIcon name="check" class="mb-1" color="text-white" />
                  </template>
               </UButton>
            </div>
            <div
               v-else-if="(isStatOfficer || isStatApprove) && vesselImportMapDetail.status === VesselInOutStatusEnum.RequestEdit"
               class="flex items-center">
               <UButton @click="() => navigateToVesselInOutList()" class="mx-1 border border-grayy-100" size="md"
                  color="gray" :label="$t('close')" />
               <UButton @click="handleClickApproveEdit(false)" class="mx-1 bg-[#F04438]" size="md" :label="$t('ปฏิเสธ')"
                  type="submit" color="orange">
                  <template #trailing>
                     <NuxtIcon name="check" class="mb-1" color="text-white" />
                  </template>
               </UButton>
               <UButton @click="handleClickApproveEdit(true)" class="ml-1 bg-[#0E9860]" size="md" :label="$t('อนุญาต')"
                  type="submit" color="green">
                  <template #trailing>
                     <NuxtIcon name="check" class="mb-1" color="text-white" />
                  </template>
               </UButton>
            </div>
            <div v-else class="flex items-center">
               <UButton @click="() => navigateToVesselInOutList()" class="mx-1 border border-grayy-100" size="md"
                  color="gray" :label="$t('close')" />
            </div>
         </div>
      </div>
      <div v-for="data in vesselImportMapDetail.notes" class="mt-2 text-red-500 text-sm">{{ data.note }}</div>

      <UDivider class="mt-6" />
      <div class="border border-grayy-100 p-8 rounded-xl mt-6">
         <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลใบคำร้อง</h2>
         <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1">
               <UInput is-view label="เลขที่คำร้อง" placeholder="เลขที่คำร้อง"
                  v-model="vesselImportMapDetail.documentNumber" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="วันที่ยื่นคำร้อง" placeholder="วันที่ยื่นคำร้อง"
                  :value="vesselImportMapDetail.documentDate && renderDateFormat(vesselImportMapDetail.documentDate, DATE_FORMAT_WITH_TIME)" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="วันที่เรือเข้า (VT)" placeholder="วันที่เรือเข้า (VT)"
                  :value="vesselImportMapDetail.vtMooringDate && renderDateFormat(vesselImportMapDetail.vtMooringDate, DATE_FORMAT_WITH_TIME)" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="วันที่เรือออก (VT)" placeholder="วันที่เรือออก (VT)"
                  :value="vesselImportMapDetail.vtMooringDate && renderDateFormat(vesselImportMapDetail.vtMooringDate, DATE_FORMAT_WITH_TIME)" />
            </div>
         </div>
         <UDivider class="my-4" />
         <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลท่าเรือ</h2>
         <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1">
               <UInput is-view label="ท่าเรือ" placeholder="ท่าเรือ" v-model="vesselImportMapDetail.berthName" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="ท่าเรือย่อย" placeholder="ท่าเรือย่อย"
                  v-model="vesselImportMapDetail.jettyName" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="วันที่เรือเข้า (VS)" placeholder="วันที่เรือเข้า (VS)"
                  :value="vesselImportMapDetail.vsMooringDate && renderDateFormat(vesselImportMapDetail.vsMooringDate, DATE_FORMAT_WITH_TIME)" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="วันที่เรือเข้า (VS)" placeholder="วันที่เรือเข้า (VS)"
                  :value="vesselImportMapDetail.vtUnmooringDate && renderDateFormat(vesselImportMapDetail.vtUnmooringDate, DATE_FORMAT_WITH_TIME)" />
            </div>
         </div>
         <UDivider class="my-4" />
         <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเรือ</h2>
         <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1">
               <UInput is-view label="ชื่อเรือ" placeholder="ชื่อเรือ" v-model="vesselImportMapDetail.vesselName" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="ประเภทเรือ" placeholder="ประเภทเรือ"
                  v-model="vesselImportMapDetail.vesselTypeName" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="หมายเลขทะเบียนเรือ" placeholder="หมายเลขทะเบียนเรือ" name="officialNumber"
                  v-model="vesselImportMapDetail.officialNumber" />
            </div>
            <div class="col-span-1">
               <UInput is-view label="หมายเลข IMO" placeholder="หมายเลข IMO" name="imoNumber"
                  v-model="vesselImportMapDetail.imoNumber" />
            </div>
            <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId">
               <div class="flex items-center">
                  <UAvatar size="xs" :src="vesselImportMapDetail.vesselFlagImage" alt="Avatar" />
                  <p class="ml-3.5 text-grayy-75">{{ vesselImportMapDetail.vesselFlagName }}</p>
               </div>
            </UFormGroup>
            <div class="col-span-1">
               <UFormGroup label="Gross Tonnage" name="vesselFlagId">
                  <div :class="textGrossClass" class="text-sm">
                     Agency - {{ formatNumber(vesselImportMapDetail.grossTonnageAgency, 0) }} t
                     <span v-if="vesselImportMapDetail.isSelectGrossTonnageAgency"
                        class="font-anuphan-bold ml-1">(เลือก)</span>
                  </div>
                  <div :class="textGrossClass" class="text-sm">
                     VT - {{ formatNumber(vesselImportMapDetail.grossTonnageVT, 0) }} t
                     <span v-if="vesselImportMapDetail.isSelectGrossTonnageVT"
                        class="font-anuphan-bold ml-1">(เลือก)</span>
                  </div>
                  <div :class="textGrossClass" class="text-sm">
                     VS - {{ formatNumber(vesselImportMapDetail.grossTonnageVS, 0) }} t
                     <span v-if="vesselImportMapDetail.isSelectGrossTonnageVS"
                        class="font-anuphan-bold ml-1">(เลือก)</span>
                  </div>
               </UFormGroup>
            </div>
         </div>
         <UDivider class="my-4" />
         <div id="product-list">
            <h2 class="font-anuphan-semi-bold text-base text-gray-400">{{ $t("cargo_list") }}</h2>
            <UTable :rows="vesselImportMapDetail.products" :columns="[
               { key: 'id', label: $t('id'), class: 'min-w-[65px] text-center' },
               { key: 'purposeTypeName', label: $t('purpose') },
               { key: 'cargoTypeId', label: $t('berth_position') },
               { key: 'cargoWharfageId', label: $t('cargo_wharfage') },
               { key: 'productName', label: $t('product_name') },
               { key: 'productGroupName', label: $t('product_group') },
               { key: 'productTypeName', label: $t('product_kind') },
               { key: 'mTonQty', label: $t('mt') },
               { key: 'rTonQty', label: $t('rt') },
               { key: 'blProduct', label: $t('B/L') },
               { key: 'cargoOwnerName', label: $t('cargo_owner') },
               { key: 'countryId', label: t('ประเทศต้นทาง/ปลายทาง') },
            ]" :ui="{
                  wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                  thead: 'bg-primary-50 whitespace-nowrap',
                  tbody: 'border-none',
               }">
               <template #id-data="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
               </template>
               <template #purposeTypeName-data="{ row }">{{ row.purposeTypeName }}</template>
               <template #productGroupName-data="{ row }">{{ row.productGroupName }}</template>
               <template #productTypeName-data="{ row }">{{ row.productTypeName }}</template>
               <template
                     v-for="key in ['purposeTypeId', 'cargoTypeId', 'cargoWharfageId', 'productId', 'productGroupId', 'productTypeId', 'countryId']"
                  #[`${key}-data`]="{ row }"
                  >
                     <div>{{ renderOption(key, row[key]) }}</div>
                  </template>
            </UTable>
         </div>
         <UDivider class="my-4" />

         <section id="passanger-table" class="mt-6">
            <div class="flex items-center justify-between">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("รายการผู้โดยสาร") }}</h1>
            </div>
            <UTable :columns="[
               {
                  key: 'id',
                  label: t('order'),
                  class: 'w-[60px] text-center',
               },
               {
                  key: 'purposeTypeId',
                  label: t('วัตถุประสงค์'),
                  class: '',
               },
               {
                  key: 'detail',
                  label: t('รายละเอียด'),
               },
               {
                  key: 'passengers',
                  label: t('จำนวนผู้โดยสาร'),
               },
               {
                  key: 'actions',
                  sortable: false,
               },
            ]" :rows="passengerList" :ui="{
                  wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                  thead: 'bg-primary-50 whitespace-nowrap',
                  tbody: 'border-none',
               }">
               <template #id-data="{ index }">
                  <div class="text-center">
                     {{ index + 1 }}
                  </div>
               </template>

               <template #purposeTypeId-data="{ row }">
                  <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
               </template>
            </UTable>
         </section>
         <UDivider class="my-4" />

         <section id="sparepart-table" class="mt-6">
            <div class="flex items-center justify-between">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("รายการ Spare Part") }}</h1>
            </div>
            <UTable :columns="[
               {
                  key: 'id',
                  label: t('order'),
                  class: 'w-[60px] text-center',
               },
               {
                  key: 'purposeTypeId',
                  label: t('วัตถุประสงค์'),
                  class: '',
               },
               {
                  key: 'detail',
                  label: t('รายละเอียด'),
               },
               {
                  key: 'actions',
                  sortable: false,
               },
            ]" :rows="sparePartList" :ui="{
                  wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                  thead: 'bg-primary-50 whitespace-nowrap',
                  tbody: 'border-none',
               }">
               <template #id-data="{ index }">
                  <div class="text-center">
                     {{ index + 1 }}
                  </div>
               </template>

               <template #purposeTypeId-data="{ row }">
                  <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
               </template>
            </UTable>
         </section>
         <UDivider class="my-4" />

         <section id="other-table" class="mt-6">
            <div class="flex items-center justify-between">
               <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("รายการอื่นๆ") }}</h1>
            </div>
            <UTable :columns="[
               {
                  key: 'id',
                  label: t('order'),
                  class: 'w-[60px] text-center',
               },
               {
                  key: 'purposeTypeId',
                  label: t('วัตถุประสงค์'),
                  class: '',
               },
               {
                  key: 'detail',
                  label: t('รายละเอียด'),
               },
               {
                  key: 'actions',
                  sortable: false,
               },
            ]" :rows="otherList" :ui="{
                  wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                  thead: 'bg-primary-50 whitespace-nowrap',
                  tbody: 'border-none',
               }">
               <template #id-data="{ index }">
                  <div class="text-center">
                     {{ index + 1 }}
                  </div>
               </template>

               <template #purposeTypeId-data="{ row }">
                  <Select is-view :options="documentOptionsStore.purposeTypeOptions" v-model="row.purposeTypeId" />
               </template>
            </UTable>
         </section>
         <UDivider class="my-4" />

         <!-- <div id="containerUpload">
                <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบใบคำร้อง</h2>
                <FileDropzone v-if="vesselImportMapDetail.filesAgency.length > 0" is-view
                    :filesValue="vesselImportMapDetail.filesAgency" />
                <div v-else>-</div>
            </div> -->

         <div id="containerUpload">
            <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบใบคำร้อง</h2>
            <FileDropzone v-if="vesselImportMapDetail.filesVS.length > 0" is-view
               :filesValue="vesselImportMapDetail.filesVS" />
            <div v-else>-</div>
         </div>

         <UDivider class="my-4" />
         <div id="containerUpload">
            <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบรายงานเรือเข้า - ออก</h2>
            <FileDropzone v-if="vesselImportMapDetail.filesVS.length > 0" :filesValue="vesselImportMapDetail.filesVS"
               :getDeletedFiles="(value: any) => deletedFiles = value" is-view
               :is-delete="vesselImportMapDetail.status !== VesselInOutStatusEnum.Approved" />
            <div v-else>-</div>
         </div>
      </div>
   </div>
   <DialogConfirm :title="$t('ลบเรือเข้า-ออก')"
      :desc="$t('คุณต้องการลบรายการเรือเข้า-ออกนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก')" icon="danger"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="() => (isConfirmCancelDialogOpen = false)" :dialogConfirm="handleConfirmCancelVesselImport"
      colorConfirm="red" :label-cancel="$t('cancel')" />
   <DialogConfirm :title="$t('อนุมัติเรือเข้า-ออก')" :desc="$t('คุณยืนยันการอนุมัติเรือเข้า-ออกนี้ใช่หรือไม่')"
      icon="warning" :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmApproveDialogOpen"
      :dialogCancel="() => (isConfirmApproveDialogOpen = false)" :dialogConfirm="handleConfirmApproveDocument"
      :label-cancel="$t('cancel')" />
   <DialogConfirm :title="approveEditType ? 'อนุญาตการขอแก้ไข' : 'ปฎิเสธการขอแก้ไข'"
      :desc="approveEditType ? 'คุณยืนยันอนุญาตการขอแก้ไขนี้ใช่หรือไม่' : 'คุณยืนยันปฎิเสธการขอแก้ไขนี้ใช่หรือไม่'"
      icon="warning" :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmApproveEditDialogOpen"
      :dialogCancel="() => (isConfirmApproveEditDialogOpen = false)" :dialogConfirm="handleConfirmApproveEditDocument"
      :label-cancel="$t('cancel')" />
   <DialogConfirm :title="$t('เรียกคืนใบคำร้อง')" :desc="$t('คุณยืนยันเรียกคืนใบคำร้องนี้ใช่หรือไม่')" icon="warning"
      :labelConfirm="$t('confirm')" :isDialogOpen="isConfirmRecallDialogOpen"
      :dialogCancel="() => (isConfirmRecallDialogOpen = false)" :dialogConfirm="handleConfirmRecallDocument"
      :label-cancel="$t('cancel')" />
   <SendBackDialog :isDialogOpen="isSendBackDialogOpen" :dialogCancel="() => (isSendBackDialogOpen = false)"
      :confirmSendBackRejected="confirmSendBackRejected" :vesselImportId="vesselImportId" />
   <SelectGrossTonnageDialog :isDialogOpen="isSelectGrossTonnage" :dialogCancel="() => (isSelectGrossTonnage = false)"
      :confirmApproveWithSelectedGrossTonnage="confirmApproveWithSelectedGrossTonnage" :vesselImportId="vesselImportId"
      :vesselImportMapDetail="vesselImportMapDetail" :deletedFiles="deletedFiles" />
   <MatchingRequestFormDialog :isDialogOpen="isMatchingRequestFormDialogOpen"
      :dialogCancel="() => (isMatchingRequestFormDialogOpen = false)"
      :confirmMatchingRequestForm="confirmMatchingRequestForm" :vesselImportId="vesselImportId"
      :vesselId="vesselImportMapDetail.vesselId" />
   <DialogAlert :isOpen="isAlertDialogOpen" :desc="modalAlertMessage" :title="modalAlertTitle" :type="modalAlertType"
      :setDialog="handleCloseAlertDialog" :btnName="$t('close')" />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import FileDropzone from "~/components/form/fileDropzone.vue";
import UInput from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import useDocumentService from "~/core/services/documentService";
import Badge from "~/components/badge/badge.vue";
import BadgeVesselInOut from "~/components/badge/badgeVesselInOut.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import useVesselImportService from "~/core/services/vesselImport";
import type { IMapVesselImport } from "~/core/interfaces/IMapVesselImport";
import SendBackDialog from "~/components/dialog/vessel-in-out/send-back-dialog.vue";
import SelectGrossTonnageDialog from "~/components/dialog/vessel-in-out/select-gross-tonnage-dialog.vue";
import { VesselInOutStatusEnum } from "~/utils/enums/VesselInOutStatusEnum";
import MatchingRequestFormDialog from "~/components/dialog/vessel-in-out/matching-request-form-dialog.vue";
import { useDocumentStore } from "~/stores/documentStore";

const { t } = useI18n();
const isLoading = ref(true);
const route = useRoute();
const documentStore = useDocumentStore();
const documentOptionsStore = useDocumentOptionsStore();
const vesselOptionsStore = useVesselOptionsStore();
const documentService = useDocumentService();
const vesselImportService = useVesselImportService();
const addressOptionsStore = useAddressOptionsStore();
const authStore = useAuthStore();
const query: any = route.query;
const vesselImportId = ref(query.id);
const isStatOfficer = authStore.profileUser.roleType === "StatOfficer";
const isStatApprove = authStore.profileUser.roleType === "StatApprove";

const isConfirmCancelDialogOpen = ref(false);
const isConfirmApproveDialogOpen = ref(false);
const isConfirmApproveEditDialogOpen = ref(false);
const isSendBackDialogOpen = ref(false);
const isSelectGrossTonnage = ref(false);
const isConfirmRecallDialogOpen = ref(false);
const isMatchingRequestFormDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const modalAlertTitle = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");

const passengerList = ref<any>([]);
const sparePartList = ref<any[]>([]);
const otherList = ref<any[]>([]);
const deletedFiles = ref([]);

const approveEditType = ref<boolean>(false);

const vesselImportMapDetail = ref<IMapVesselImport>({
   berthName: "",
   documentDate: "",
   documentNumber: "",
   filesAgency: [],
   filesVS: [],
   grossTonnageAgency: 0,
   grossTonnageVS: 0,
   grossTonnageVT: 0,
   imoNumber: "",
   jettyName: "",
   notes: [],
   officialNumber: "",
   products: [],
   status: "",
   statusDes: "",
   vesselFlagImage: "",
   vesselFlagName: "",
   vesselName: "",
   vesselTypeName: "",
   vsMooringDate: "",
   vsUnmooringDate: "",
   vtMooringDate: "",
   vtUnmooringDate: "",
   vesselId: 0,
   isSelectGrossTonnageAgency: false,
   isSelectGrossTonnageVS: false,
   isSelectGrossTonnageVT: false,
});

const products = ref<any[]>([]);

onMounted(async () => {
   await vesselOptionsStore.getVesselTypeOption();
   await vesselOptionsStore.getVesselFlagOption();
   documentOptionsStore.getBerthsOptions();
   documentOptionsStore.getPurposesOptions();
   documentOptionsStore.getCargoTypesOptions();
   documentOptionsStore.getProductGroupsOptions();
   documentOptionsStore.getCargoWharfageOptions();
   documentOptionsStore.getPaymentMethodOptions();
   documentOptionsStore.getPaymentTermsOptions();
   documentOptionsStore.getJettiesOptions();
   addressOptionsStore.getCountriesOptions();
   if (vesselImportId.value) {
      getVesselImportDetail(vesselImportId.value);
   }
});

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


const getVesselImportDetail = async (id: number) => {
   isLoading.value = true;
   const resp = await vesselImportService.getMapVesselImportDetail(id);
   if (resp.statusCode === 200) {
      vesselImportMapDetail.value = resp.data;

      passengerList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Passenger")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Passenger")[0].details
         : [];

      sparePartList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Spare Part")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Spare Part")[0].details
         : [];

      otherList.value = resp.data.products.filter((p: any) => p.purposeTypeName === "Other")[0]
         ? resp.data.products.filter((p: any) => p.purposeTypeName === "Other")[0]
         : [];

      vesselImportMapDetail.value.products = resp.data.products.filter((p: any) => !["Passenger", "Spare Part", "Other"].includes(p.purposeTypeName))[0]
         ? resp.data.products
            .filter((p: any) => !["Passenger", "Spare Part", "Other"].includes(p.purposeTypeName))
            .map((item: any) => ({
               ...item,
               mTonQty: getInputDecimal(item.details?.[0]?.mTonQty?.toString(), 3),
               rTonQty: getInputDecimal(item.details?.[0]?.rTonQty?.toString(), 3),
            }))[0].details
         : [];
   }
   isLoading.value = false;
};

const renderStatus = (status: string) => {
   if (status === VesselInOutStatusEnum.PendingCheck) {
      return "warning";
   } else if (status === VesselInOutStatusEnum.Approved) {
      return "green";
   } else if (status === VesselInOutStatusEnum.PendingEdit || status === VesselInOutStatusEnum.RequestEdit) {
      return "error";
   } else if (status === VesselInOutStatusEnum.PendingApproval) {
      return "purple";
   }
   return "gray";
};

const handleCancelDocument = () => {
   isConfirmCancelDialogOpen.value = true;
};

const handleConfirmCancelVesselImport = async () => {
   if (vesselImportId.value) {
      const resp = await vesselImportService.deleteVesselImport(vesselImportId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ลบเรือเข้า-ออก";
         modalAlertMessage.value = "การลบเรือเข้า-ออกสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ลบเรือเข้า-ออก";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      navigateToVesselInOutList();
   }
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      navigateToVesselInOutList();
   } else {
      isAlertDialogOpen.value = false;
      isSelectGrossTonnage.value = false;
      isSendBackDialogOpen.value = false;
      isConfirmRecallDialogOpen.value = false;
      isConfirmApproveDialogOpen.value = false;
      isConfirmCancelDialogOpen.value = false;
      isMatchingRequestFormDialogOpen.value = false;
      isConfirmApproveEditDialogOpen.value = false;
   }
};

const confirmMatchingRequestForm = (isSuccess: boolean) => {
   if (isSuccess) {
      isMatchingRequestFormDialogOpen.value = false;
      if (vesselImportId.value) {
         getVesselImportDetail(vesselImportId.value);
      }
   }
};

const handleClickRejectSendBack = () => {
   isSendBackDialogOpen.value = true;
};

type GrossTonnage = {
   grossTonnageAgency: number;
   grossTonnageVS: number;
   grossTonnageVT: number;
};

const validateGrossTonnageEquality = (grossTonnage: GrossTonnage): boolean => {
   const { grossTonnageAgency, grossTonnageVS, grossTonnageVT } = grossTonnage;

   // Check if all values are equal
   return grossTonnageAgency === grossTonnageVS && grossTonnageVS === grossTonnageVT;
};

const handleClickApprove = () => {
   if (isStatApprove) {
      isConfirmApproveDialogOpen.value = true;
      return;
   }
   const tonnageData = {
      grossTonnageAgency: vesselImportMapDetail.value.grossTonnageAgency,
      grossTonnageVS: vesselImportMapDetail.value.grossTonnageVS,
      grossTonnageVT: vesselImportMapDetail.value.grossTonnageVT,
   };
   if (!validateGrossTonnageEquality(tonnageData)) {
      isSelectGrossTonnage.value = true;
   } else {
      isConfirmApproveDialogOpen.value = true;
   }
};

const handleClickApproveEdit = (type: boolean) => {
   approveEditType.value = type;
   isConfirmApproveEditDialogOpen.value = true;
};

const handleConfirmApproveDocument = async () => {
   let payload;
   if (isStatApprove) {
      payload = {
         grossTonnage: vesselImportMapDetail.value.isSelectGrossTonnageAgency
            ? vesselImportMapDetail.value.grossTonnageAgency
            : vesselImportMapDetail.value.isSelectGrossTonnageVS
               ? vesselImportMapDetail.value.grossTonnageVS
               : vesselImportMapDetail.value.isSelectGrossTonnageVT
                  ? vesselImportMapDetail.value.grossTonnageVT
                  : 0,
      };
   } else {
      payload = {
         grossTonnage: vesselImportMapDetail.value.grossTonnageAgency,
      };
   }

   if (vesselImportId.value) {
      const resp = await vesselImportService.approveVesselImport(vesselImportId.value, payload);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "อนุมัติเรือเข้า-ออก";
         modalAlertMessage.value = "การอนุมัติเรือเข้า-ออกสำเร็จแล้ว ";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "อนุมัติเรือเข้า-ออก";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      navigateToVesselInOutList();
   }
};

const handleConfirmApproveEditDocument = async () => {
   const payload = {
      grossTonnage: vesselImportMapDetail.value.grossTonnageAgency,
   };
   if (vesselImportId.value) {
      const resp = await vesselImportService.approveVesselImportEdit(vesselImportId.value, approveEditType.value, payload);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = approveEditType.value ? "อนุญาตการขอแก้ไข" : "ปฎิเสธการขอแก้ไข";
         modalAlertMessage.value = approveEditType.value ? "อนุญาตการขอแก้ไขสำเร็จแล้ว " : "ปฎิเสธการขอแก้ไขสำเร็จแล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = approveEditType.value ? "อนุญาตการขอแก้ไข" : "ปฎิเสธการขอแก้ไข";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      navigateToVesselInOutList();
   }
};

const handleConfirmRecallDocument = async () => {
   if (vesselImportId.value) {
      const resp = await documentService.recallDocument(vesselImportId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "เรียกคืนใบคำร้อง";
         modalAlertMessage.value = "การเรียกคืนใบคำร้องของคุณสำเร็จแล้ว ";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "เรียกคืนใบคำร้อง";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   } else {
      navigateToVesselInOutList();
   }
};

const confirmSendBackRejected = (isSuccess: boolean, resp: any) => {
   if (isSuccess) {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "ส่งกลับเรือเข้า-ออก";
      modalAlertMessage.value = "การส่งกลับเรือเข้า-ออกสำเร็จแล้ว  ";
      modalAlertType.value = "success";
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "ส่งกลับเรือเข้า-ออก";
      modalAlertMessage.value = resp.message;
      modalAlertType.value = "error";
   }
};

const confirmApproveWithSelectedGrossTonnage = (isSuccess: boolean, resp: any) => {
   if (isSuccess) {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "อนุมัติเรือเข้า-ออก";
      modalAlertMessage.value = "การอนุมัติเรือเข้า-ออกสำเร็จแล้ว ";
      modalAlertType.value = "success";
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "อนุมัติเรือเข้า-ออก";
      modalAlertMessage.value = resp.message;
      modalAlertType.value = "error";
   }
};

const isAllGrossEqual = computed(() => {
   const { grossTonnageAgency, grossTonnageVT, grossTonnageVS } = vesselImportMapDetail.value;
   return grossTonnageAgency === grossTonnageVT && grossTonnageVT === grossTonnageVS;
});
const textGrossClass = computed(() => (isAllGrossEqual.value ? "text-grayy-75" : "text-red-500"));

const navigateToVesselInOutList = () => {
   if (documentStore.vesselInOutQueryType === "Send") {
      navigateTo("/vessel-in-out/list?status=Send,PendingCheck");
   } else if (documentStore.vesselInOutQueryType === "PendingApproval") {
      navigateTo("/vessel-in-out/list?status=PendingApproval");
   } else if (documentStore.vesselInOutQueryType === "Approved") {
      navigateTo("/vessel-in-out/list?status=Approved");
   } else if (documentStore.vesselInOutQueryType === "PendingEdit") {
      navigateTo("/vessel-in-out/list?status=PendingEdit");
   } else if (documentStore.vesselInOutQueryType === "RequestEdit") {
      navigateTo("/vessel-in-out/list?status=RequestEdit");
   } else {
      navigateTo("/vessel-in-out/list?status=");
   }
   documentStore.triggerRefresh();
};
</script>
