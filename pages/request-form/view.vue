<template>
   <div>
     <div class="mb-8">
       <h1 class="font-bold text-2xl md:text-3xl">{{ $t("vessel_management") }}</h1>
     </div>
     <div id="ship-agent-form-content" class="bg-white px-4 md:px-8 py-6 rounded-[0px_0px_20px_20px]">
      <div class="flex flex-wrap items-start  mb-5 flex-col xs:flex-row xs:justify-between">
         <div>
            <div class="flex space-x-4">
               <h1 class="font-semibold text-lg text-grayy-400 mr-4">ใบคำร้อง</h1>
               <BadgeCr v-if="!isLoading" :label="documentDataDetail.statusDescription" :type="documentDataDetail.status" class="min-w-[67px] h-[28px] text-nowrap flex justify-center" />
               <BadgeCr v-if="!isLoading" :label="documentDataDetail.vesselStatusDes" :type="documentDataDetail.vesselStatus" class="min-w-[67px] h-[28px] text-nowrap flex justify-center" />
            </div>
            <div class="mt-1 text-grayy-75 text-sm">รายละเอียดใบยื่นคำร้อง</div>
            <div class="mt-5 space-y-2">
               <div v-if="documentDataDetail.rejectedNote?.length > 0" v-for="data in documentDataDetail.rejectedNote" class="text-red-500 text-sm">
                  <span class="font-bold">ความคิดเห็นจากเจ้าหน้าที่ ({{ data.date ? renderDateFormat(data.date, DATE_FORMAT_WITH_TIME) : "" }})</span> :
                  {{ data.message }}
               </div>
            </div>
         </div>
         
         <div
           v-if="!isLoading"
           class="flex flex-wrap items-center space-x-0 sm:space-x-3 mt-4 md:mt-0"
         >
           <UButton
             v-if="
               documentDataDetail.status !== DocumentStatusEnum.Rejected &&
               documentDataDetail.status !== DocumentStatusEnum.Canceled &&
               documentDataDetail.status !== DocumentStatusEnum.Approved
             "
             @click="handleCancelDocument"
             size="md"
             color="red"
             variant="outline"
             :label="$t('cancel_request_form')"
           />
           <UButton
             @click="() => navigateToRequestFormList()"
             class="border border-grayy-100"
             size="md"
             color="gray"
             :label="$t('close')"
           />
           <UButton
             v-if="documentDataDetail.status === DocumentStatusEnum.PendingEdit && (isDocumentReviewer || isDocumentApprove || isAdmin)"
             @click="handleClickRecallDocument"
             class="bg-purple-25 text-primaryy-500 hover:bg-purple-50"
             size="md"
             :label="$t('เรียกคืน')"
             icon="i-heroicons-arrow-path"
           >
             <template #leading>
               <NuxtIcon name="redo-alt" />
             </template>
           </UButton>
           <UButton
             v-if="
               documentDataDetail.status === DocumentStatusEnum.PendingEdit ||
               ((documentDataDetail.status === DocumentStatusEnum.PendingReview ||
                 documentDataDetail.status === DocumentStatusEnum.PendingApproval) &&
                 (isDocumentReviewer || isDocumentApprove || isAdmin))
             "
             @click="() => navigateTo(`/request-form/edit?id=${documentId}`)"
             icon="i-heroicons-pencil-square"
             size="md"
             :label="$t('edit')"
             type="submit"
             :trailing="true"
           />
           <UButton
             v-if="
               (isAdmin || isDocumentReviewer || isDocumentApprove || isDocumentBerthOfficerMIT || isDocumentBerthOfficerTCT) &&
               (documentDataDetail.status === DocumentStatusEnum.PendingReview ||
                 documentDataDetail.status === DocumentStatusEnum.PendingApproval ||
                 documentDataDetail.status === DocumentStatusEnum.PendingConfirmation ||
                 documentDataDetail.status === DocumentStatusEnum.PendingConfirmation1 ||
                 documentDataDetail.status === DocumentStatusEnum.PendingConfirmation2)
             "
             @click="handleClickRejectSendBack"
             class="bg-[#E76E31]"
             size="md"
             :label="$t('ส่งกลับ')"
             type="submit"
             color="orange"
           >
             <template #trailing>
               <NuxtIcon name="redo" class="mb-1" color="text-white" />
             </template>
           </UButton>
           <UButton
             v-if="
               (documentDataDetail.status === DocumentStatusEnum.PendingReview && (isDocumentReviewer || isAdmin)) ||
               (documentDataDetail.status === DocumentStatusEnum.PendingApproval && (isDocumentApprove || isAdmin)) ||
               (documentDataDetail.canApprove && (isDocumentBerthOfficerMIT || isDocumentBerthOfficerTCT || isAdmin))
             "
             @click="handleClickApprove"
             class="bg-[#0E9860]"
             size="md"
             :label="
               (isDocumentBerthOfficerMIT || isDocumentBerthOfficerTCT || isAdmin) &&
               (documentDataDetail.status === DocumentStatusEnum.PendingConfirmation ||
                 documentDataDetail.status === DocumentStatusEnum.PendingConfirmation1 ||
                 documentDataDetail.status === DocumentStatusEnum.PendingConfirmation2)
                 ? 'ยืนยันท่า'
                 : $t('approve')
             "
             type="submit"
             color="green"
           >
             <template #trailing>
               <NuxtIcon name="check" class="mb-1" color="text-white" />
             </template>
           </UButton>
         </div>
       </div>
 
       <UDivider />
 
       <div class="border border-grayy-100 p-4 md:p-8 rounded-xl mt-6">
         <div class="flex flex-col mobile:flex-row  justify-between">
           <h2 class="font-semibold text-grayy-400 mb-3">ข้อมูลเรือ</h2>
           <UButton
             @click="handleViewVesselHistory"
             class="mx-1 bg-purple-25 text-primaryy-500 hover:bg-purple-50 max-w-[112px] mb-2 xs:mb-0"
             size="md"
             :label="$t('ประวัติเรือ')"
             icon="i-heroicons-arrow-path"
           />
         </div>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <UInputMenu
               is-view
               custom-icon="search"
               label="เจ้าของเรือ"
               name="owner"
               v-model="documentDataDetail.vessel.vesselOwner"
               placeholder="ค้นหา"
               :help-text="renderHisUnit(documentDataHistory.vessel.vesselOwner) + `${documentDataDetail.isNewShip ? ' (เรือใหม่)' : ''}`"
             />
           </div>
           <div>
             <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId">
               <div class="flex items-center">
                 <UAvatar size="xs" :src="vesselFlagData.avatar" alt="Avatar" />
                 <p class="ml-3.5 text-grayy-75">{{ vesselFlagData.flagName }}</p>
               </div>
               <div v-if="vesselFlagDataHist.avatar" class="flex items-center mt-1">
                 <UAvatar size="xs" :src="vesselFlagDataHist.avatar" alt="Avatar" />
                 <p class="ml-3.5 text-[#F04438]">{{ vesselFlagDataHist.flagName }} (เดิม)</p>
               </div>
             </UFormGroup>
           </div>
           <div>
             <UInput
               is-view
               label="ชื่อเรือ"
               placeholder="ชื่อเรือ"
               name="name"
               v-model="documentDataDetail.vessel.vesselName"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselName)"
             />
           </div>
           <div>
             <USelect
               is-view
               label="ประเภทเรือ"
               placeholder="ประเภทเรือ"
               name="vesselTypeId"
               v-model="documentDataDetail.vessel.vesselTypeId"
               :options="vesselOptionsStore.vesselTypeOption"
               :text-history="documentDataHistory.vessel.vesselTypeId"
             />
           </div>
           <div>
             <UInput
               is-view
               label="หมายเลข IMO"
               placeholder="หมายเลข IMO"
               name="imoNumber"
               v-model="documentDataDetail.vessel.vesselImoNumber"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselImoNumber)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="หมายเลข MMSI"
               placeholder="หมายเลข MMSI"
               name="mmsiNumber"
               v-model="documentDataDetail.vessel.vesselMMSiNumber"
             />
           </div>
           <div>
             <UInput
               is-view
               label="หมายเลขทะเบียนเรือ"
               placeholder="หมายเลขทะเบียนเรือ"
               name="officialNumber"
               v-model="documentDataDetail.vessel.vesselOfficialNumber"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselOfficialNumber)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="สัญญาณเรียกขาน"
               placeholder="สัญญาณเรียกขาน"
               name="callSign"
               v-model="documentDataDetail.vessel.vesselCallSign"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselCallSign)"
             />
           </div>
           <div v-if="documentDataDetail.vessel.vesselFlagName.trim().toLowerCase() == 'thailand'">
             <UInput
               is-view
               :label="'วันหมดอายุทะเบียนเรือ'"
               name="LicenseExpiredDate"
               :placeholder="''"
               :value="renderExpireDate(documentDataDetail.vessel.vesselLicenseExpiredDate)"
               @input="documentDataDetail.vessel.vesselLicenseExpiredDate = $event.target.value"
             />
           </div>
         </div>
         <UDivider class="my-4" />
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <UInput
               is-view
               label="น้ำหนักบรรทุก"
               placeholder="น้ำหนักบรรทุก"
               name="loadWeight"
               v-model="documentDataDetail.vessel.vesselLoadWeight"
               type="number"
               suffix="t"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselLoadWeight)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="Gross Tonnage"
               placeholder="Gross Tonnage"
               name="grossTonnage"
               v-model="documentDataDetail.vessel.vesselGrossTonnage"
               type="number"
               suffix="t"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselGrossTonnage)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="Net Tonnage"
               placeholder="Net Tonnage"
               name="netTonnage"
               v-model="documentDataDetail.vessel.vesselNetTonnage"
               type="number"
               suffix="t"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselNetTonnage)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="ความยาว"
               placeholder="ความยาว"
               name="lengthOverall"
               v-model="documentDataDetail.vessel.vesselLengthOverall"
               type="number"
               suffix="m"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselLengthOverall)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="ความกว้าง"
               placeholder="ความกว้าง"
               name="breadthExtreme"
               v-model="documentDataDetail.vessel.vesselBreadthExtreme"
               type="number"
               suffix="m"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselBreadthExtreme)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="กินน้ำลึก"
               placeholder="กินน้ำลึก"
               name="depth"
               v-model="documentDataDetail.vessel.vesselDepth"
               type="number"
               suffix="m"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselDepth)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="เครื่องจักรใหญ่"
               placeholder="เครื่องจักรใหญ่"
               name="mainEngine"
               v-model="documentDataDetail.vessel.vesselMainEngine"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselMainEngine)"
             />
           </div>
           <div>
             <UInput
               is-view
               label="ยี่ห้อและรุ่น"
               placeholder="ยี่ห้อและรุ่น"
               name="bandAndModel"
               v-model="documentDataDetail.vessel.vesselBandAndModel"
               :helpText="renderHisUnit(documentDataHistory.vessel.vesselBandAndModel)"
             />
           </div>
         </div>
         <UDivider class="my-4" />
         <div id="containerUpload">
           <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบ</h2>
           <FileDropzone v-if="vesselFilesUpload.length > 0" is-view :filesValue="vesselFilesUpload" />
           <div v-else>-</div>
         </div>
       </div>

       <div class="border border-grayy-100 p-4 md:p-8 rounded-xl mt-6">
         <h2 class="font-semibold text-grayy-400 mb-3">วันและเวลาที่คาดว่าเรือเข้า-ออก</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <UInput
               :label="$t('estimated_vessel_arrival_date')"
               :value="`${documentDataDetail.estimatedArrival ? format(new Date(documentDataDetail.estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`"
               is-view
               :helpText="renderHisUnit(`${documentDataHistory.estimatedArrival ? format(new Date(documentDataHistory.estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`)"
             />
           </div>
           <div>
             <UInput
               :label="$t('estimated_vessel_departure_date')"
               custom-icon="calendar"
               :value="`${documentDataDetail.estimatedDeparture ? format(new Date(documentDataDetail.estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`"
               is-view
               :helpText="renderHisUnit(`${documentDataHistory.estimatedDeparture ? format(new Date(documentDataHistory.estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`)"
             />
           </div>
         </div>
         <UDivider class="my-4" />
         <div
           v-if="documentDataDetail.berths?.length > 0"
           v-for="(data, index) in documentDataDetail.berths"
           class="my-6 text-left"
         >
           <div class="flex flex-col md:flex-row justify-between">
             <h2 class="font-semibold text-grayy-400 mb-3">
               {{ $t("docking_vessel") }} {{ index + 1 }}
             </h2>
           </div>
           <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <USelect
                 :label="$t('docking_vessel')"
                 :placeholder="$t('docking_vessel')"
                 is-view
                 :options="documentOptionsStore.berthsOption"
                 v-model="data.berthId"
               />
             </div>
             <div>
               <USelect
                 :label="$t('purpose_of_docking')"
                 :placeholder="$t('purpose_of_docking')"
                 name="purposeDocking"
                 is-view
                 :options="documentOptionsStore.purposesOptions"
                 v-model="data.purposeId"
               />
             </div>
             <div>
               <USelect
                 :label="$t('cargo_type')"
                 :placeholder="$t('cargo_type')"
                 is-view
                 :options="documentOptionsStore.cargoTypesOptions"
                 v-model="data.cargoTypeId"
               />
             </div>
             <div>
               <UInput
                 :label="$t('number_passengers')"
                 :placeholder="$t('number_passengers')"
                 is-view
                 v-model="data.passengers"
               />
             </div>
             <div>
               <UInput
                 :label="$t('estimated_vessel_arrival_date')"
                 :value="`${data.estimatedArrival ? format(new Date(data.estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`"
                 is-view
                 :helpText="documentDataHistory.berths && documentDataHistory.berths[index]
                   ? renderHisUnit(`${documentDataHistory.berths[index].estimatedArrival ? format(new Date(documentDataHistory.berths[index].estimatedArrival), 'd MMM, yyy, HH:mm') : ''}`)
                   : ''"
               />
             </div>
             <div>
               <UInput
                 :label="$t('estimated_vessel_departure_date')"
                 custom-icon="calendar"
                 :value="`${data.estimatedDeparture ? format(new Date(data.estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`"
                 is-view
                 :helpText="documentDataHistory.berths && documentDataHistory.berths[index]
                   ? renderHisUnit(`${documentDataHistory.berths[index].estimatedDeparture ? format(new Date(documentDataHistory.berths[index].estimatedDeparture), 'd MMM, yyy, HH:mm') : ''}`)
                   : ''"
               />
             </div>
             <div class="md:col-span-2">
               <UTextarea
                 :label="$t('detail')"
                 :placeholder="$t('detail')"
                 is-view
                 v-model="data.note"
               />
             </div>
           </div>
           <div v-if="isCheckingEnabledAction(data.purposeTypeId)">
             <UDivider class="my-4" />
             <div class="flex flex-col md:flex-row justify-between">
               <h2 class="font-semibold text-grayy-400 mb-3">{{ $t("รายการสินค้า") }}</h2>
             </div>
             <UTable
               :columns="columnsTable"
               :rows="data.products"
               class=""
               :ui="{
                 wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
                 thead: 'bg-primary-50',
                 tbody: 'border-none'
               }"
             >
               <template #id-data="{ index }">
                 <div class="text-center">
                   {{ index + 1 }}
                 </div>
               </template>
               <template #purposeId-data="{ row }">
                 <div class="text-center">
                   {{ renderPurpose(row.purposeId) }}
                 </div>
               </template>
               <template #productTypeId-data="{ row }">
                 <div class="text-center">
                   {{ renderProductType(row.productTypeId) }}
                 </div>
               </template>
               <template #cargoWharfageId-data="{ row }">
                 <div class="text-center">
                   {{ renderCargoWharfage(row.cargoWharfageId) }}
                 </div>
               </template>
               <template #mTonQty-data="{ row }">
                 <div class="text-center">{{ formatNumber(row.mTonQty) }} M/Ton</div>
               </template>
               <template #rTonQty-data="{ row }">
                 <div class="text-center">{{ formatNumber(row.rTonQty) }} R/Ton</div>
               </template>
             </UTable>
             <div class="grid grid-cols-1 md:grid-cols-2 mt-6">
               <div>
                 <p>ปริมาณสินค้า M/Ton รวม</p>
                 <p class="text-grayy-75">{{ calculateMton(data.products) }} M/Ton</p>
               </div>
               <div>
                 <p>ปริมาณสินค้า R/Ton รวม</p>
                 <p class="text-grayy-75">{{ calculateRton(data.products) }} R/Ton</p>
               </div>
             </div>
           </div>
           <UDivider class="my-4" />
           <div v-if="isOtherPurpose(data.purposeTypeId) || data.products.length === 0">
             <h2 class="font-semibold text-grayy-400">
               นำเข้าเอกสารหนังสือขออนุญาติเรือกิจกรรมอื่น
             </h2>
             <span class="text-grayy-500 my-2">
               กรณีเป็นเรือกิจกรรมอื่น จะต้องนำส่งหนังสือขออนุญาติเรือกิจกรรมอื่น และเลือกวัตถุประสงค์เทียบท่าเป็น Other
             </span>
           </div>
           <div v-else>
             <h2 class="font-semibold text-grayy-400">นำเข้าเอกสาร Cargo Manifest</h2>
             <ul class="list-decimal pl-6 space-y-0.5 text-grayy-500 my-2">
               <li>เอกสาร Cargo Manifest ต้องมีตราประทับและลายเซ็นต์</li>
               <li>เรือ Discharge ต้องส่งเอกสารก่อนหรือพร้อมกับเรือเข้าเทียบท่า</li>
             </ul>
           </div>
           <FileDropzone class="mt-4" :maximumFileLimit="4" upload-type="vessel" is-view :filesValue="data.files" />
         </div>
       </div>
 
       <div class="border border-grayy-100 p-4 md:p-8 rounded-xl mt-6">
         <h2 class="font-semibold text-grayy-400 mb-3">{{ $t("invoice_address") }}</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <UInput
             v-model="documentDataDetail.invoice.name"
             :label="$t('ชื่อลูกค้า/บริษัท')"
             :placeholder="$t('ชื่อลูกค้า/บริษัท')"
             is-view
           />
           <UInput
             v-model="documentDataDetail.invoice.taxId"
             :label="$t('taxpayer_identification_no')"
             :placeholder="$t('taxpayer_identification_no')"
             is-view
           />
           <UInput
             v-model="documentDataDetail.invoice.contactName"
             :label="$t('ชื่อผู้ติดต่อ')"
             :placeholder="$t('ชื่อผู้ติดต่อ')"
             is-view
           />
           <USelect
             v-model="documentDataDetail.invoice.paymentMethodId"
             :label="$t('วิธีการชำระเงิน')"
             :placeholder="$t('วิธีการชำระเงิน')"
             is-view
             :options="documentOptionsStore.paymentMethodOptions"
           />
           <USelect
             v-model="documentDataDetail.invoice.paymentTermId"
             :label="$t('เงื่อนไขการชำระเงิน')"
             :placeholder="$t('เงื่อนไขการชำระเงิน')"
             is-view
             :options="documentOptionsStore.paymentTermsOptions"
           />
           <UInput
             v-model="documentDataDetail.invoice.address"
             :label="$t('ที่อยู่')"
             :placeholder="$t('ที่อยู่')"
             is-view
           />
         </div>
       </div>
     </div>
 
     <DialogConfirm
       :title="$t('cancel_request_form')"
       :desc="$t('คุณต้องการยกเลิกใบคำร้องนี้ใช่หรือไม่ หากยกเลิกแล้วจะไม่สามารถกู้คืนได้อีก')"
       icon="danger"
       :labelConfirm="$t('confirm')"
       :isDialogOpen="isConfirmCancelDialogOpen"
       :dialogCancel="() => (isConfirmCancelDialogOpen = false)"
       :dialogConfirm="handleConfirmCancelDocument"
       colorConfirm="red"
       :label-cancel="$t('cancel')"
     />
     <DialogConfirm
       :title="$t('อนุมัติใบคำร้อง')"
       :desc="$t('คุณยืนยันการอนุมัติใบคำร้องนี้ใช่หรือไม่')"
       icon="warning"
       :labelConfirm="$t('confirm')"
       :isDialogOpen="isConfirmApproveDialogOpen"
       :dialogCancel="() => (isConfirmApproveDialogOpen = false)"
       :dialogConfirm="handleConfirmApproveDocument"
       :label-cancel="$t('cancel')"
     />
     <DialogConfirm
       :title="$t('เรียกคืนใบคำร้อง')"
       :desc="$t('คุณยืนยันเรียกคืนใบคำร้องนี้ใช่หรือไม่')"
       icon="warning"
       :labelConfirm="$t('confirm')"
       :isDialogOpen="isConfirmRecallDialogOpen"
       :dialogCancel="() => (isConfirmRecallDialogOpen = false)"
       :dialogConfirm="handleConfirmRecallDocument"
       :label-cancel="$t('cancel')"
     />
     <SendBackDialog
       :isDialogOpen="isSendBackDialogOpen"
       :dialogCancel="() => (isSendBackDialogOpen = false)"
       :confirmSendBackRejected="confirmSendBackRejected"
       :documentId="documentId"
     />
     <SelectJettysDialog
       :isDialogOpen="isSelectJettyDialogOpen"
       :dialogCancel="() => (isSelectJettyDialogOpen = false)"
       :confirmApproveWithJetty="confirmApproveWithJetty"
       :documentId="documentId"
       :spacialBerths="spacialBerths"
     />
     <DialogAlert
       :isOpen="isAlertDialogOpen"
       :desc="modalAlertMessage"
       :title="modalAlertTitle"
       :type="modalAlertType"
       :setDialog="handleCloseAlertDialog"
       :btnName="$t('close')"
     />
     <VesselHistoryDialog
       :isDialogOpen="isVesselHistoryDialogOpen"
       :dialogCancel="() => (isVesselHistoryDialogOpen = false)"
       :vessel-id="documentDataDetail.vessel.vesselId"
       :documentId="documentId"
     />
     <Loading v-if="isLoading" />
   </div>
 </template>
 

<script setup lang="ts">
import USelect from "~/components/form/u-select.vue";
import FileDropzone from "~/components/form/fileDropzone.vue";
import UInput from "~/components/form/u-input.vue";
import { format } from "date-fns";
import useDocumentService from "~/core/services/documentService";
import type { IDocumentData } from "~/core/interfaces/IDocumentData";
import type { IBerthDocumentList } from "~/core/interfaces/IBerthDocumentList";
import UInputMenu from "~/components/form/u-input-menu.vue";
import UTextarea from "~/components/form/u-textarea.vue";
import Badge from "~/components/badge/badge.vue";
import BadgeCr from "~/components/badge/badgeCr.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import SendBackDialog from "~/components/dialog/request-form/send-back-dialog.vue";
import SelectJettysDialog from "~/components/dialog/request-form/select-jettys-dialog.vue";
import { DocumentStatusEnum } from "~/utils/enums/DocumentStatusEnum";
import { VesselDocStatusEnum } from "~/utils/enums/VesselDocStatusEnum";
import { UserTypeEnum } from "~/utils/enums/UserTypeEnum";
import { PurposeType } from "~/core/utils/enum";
import type { ISpacialBerths } from "~/core/interfaces/ISpacialBerths";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";
import { RoleTypeEnum } from "~/utils/enums/RoleTypeEnum";
import { useDocumentStore } from "~/stores/documentStore";
import VesselHistoryDialog from '~/components/dialog/request-form/vessel-history-dialog.vue';

const { t } = useI18n();
const isLoading = ref(true);
const route = useRoute();
const documentStore = useDocumentStore();
const documentOptionsStore = useDocumentOptionsStore();
const vesselOptionsStore = useVesselOptionsStore();
const documentService = useDocumentService();
const authStore = useAuthStore();
const query: any = route.query;
const documentId = ref(query.id);
const isAgency = authStore.profileUser.type === RoleTypeEnum.Agency;
const isDocumentReviewer = authStore.profileUser.roleType === RoleTypeEnum.DocumentReviewer;
const isDocumentApprove = authStore.profileUser.roleType === RoleTypeEnum.DocumentApprove;
const isDocumentBerthOfficerMIT = authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficerMIT;
const isDocumentBerthOfficerTCT = authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficerTCT;
const isAdmin = authStore.profileUser.roleType === RoleTypeEnum.Admin;
const vesselFilesUpload = ref<IFileUpload[]>([]);
const berths = ref<IBerthDocumentList[]>([]);

const isConfirmCancelDialogOpen = ref(false);
const isConfirmApproveDialogOpen = ref(false);
const isSendBackDialogOpen = ref(false);
const isSelectJettyDialogOpen = ref(false);
const isConfirmRecallDialogOpen = ref(false);
const isVesselHistoryDialogOpen = ref(false);
const isAlertDialogOpen = ref(false);
const modalAlertTitle = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");

const spacialBerths = ref<ISpacialBerths[]>([]);

const documentDataDetail = ref<IDocumentData>({
   id: 0,
   requestDate: "",
   status: "",
   statusDescription: "",
   vessel: {
      vesselFlagId: 0,
      vesselTypeId: 0,
      vesselId: 0,
      vesselOwner: "",
      vesselName: "",
      vesselImoNumber: "",
      vesselMMSiNumber: "",
      vesselDSVNumber: "",
      vesselOfficialNumber: "",
      vesselCallSign: "",
      vesselNationality: "",
      vesselCountry: "",
      vesselLoadWeight: 0,
      vesselGrossTonnage: 0,
      vesselNetTonnage: 0,
      vesselLengthOverall: 0,
      vesselBreadthExtreme: 0,
      vesselDepth: 0,
      vesselMainEngine: "",
      vesselBandAndModel: "",
      vesselLicenseExpiredDate: null,
      vesselUploadFiles: [],
      documentVesselId: 0,
      vesselFlagName: "",
      vesselFlagPath: "",
      vesselFlag: "",
   },
   invoice: {
      id: 0,
      customerId: null,
      name: "",
      taxId: "",
      contactName: "",
      paymentMethodId: 0,
      paymentTermId: 0,
      countryId: 0,
      subDistrictId: 0,
      districtId: 0,
      provinceId: 0,
      postCode: "",
      stageProvince: "",
      address: "",
      paymentMethodName: "",
      paymentTermName: "",
   },
   berths: [],
   docNumber: "",
   estimatedArrival: "",
   estimatedDeparture: "",
   vesselStatus: "",
   vesselStatusDes: "",
   rejectedNote: [],
   vesselDocuments: [],
   canApprove: false,
   isNewShip: false
});

const documentDataHistory = ref<IDocumentData>({
   id: 0,
   requestDate: "",
   status: "",
   statusDescription: "",
   vessel: {
      vesselFlagId: 0,
      vesselTypeId: 0,
      vesselId: 0,
      vesselOwner: "",
      vesselName: "",
      vesselImoNumber: "",
      vesselMMSiNumber: "",
      vesselDSVNumber: "",
      vesselOfficialNumber: "",
      vesselCallSign: "",
      vesselNationality: "",
      vesselCountry: "",
      vesselLoadWeight: 0,
      vesselGrossTonnage: 0,
      vesselNetTonnage: 0,
      vesselLengthOverall: 0,
      vesselBreadthExtreme: 0,
      vesselDepth: 0,
      vesselMainEngine: "",
      vesselBandAndModel: "",
      vesselLicenseExpiredDate: null,
      vesselUploadFiles: [],
      documentVesselId: 0,
      vesselFlagName: "",
      vesselFlagPath: "",
      vesselFlag: "",
   },
   invoice: {
      id: 0,
      customerId: null,
      name: "",
      taxId: "",
      contactName: "",
      paymentMethodId: 0,
      paymentTermId: 0,
      countryId: 0,
      subDistrictId: 0,
      districtId: 0,
      provinceId: 0,
      postCode: "",
      stageProvince: "",
      address: "",
      paymentMethodName: "",
      paymentTermName: "",
   },
   berths: [],
   docNumber: "",
   estimatedArrival: "",
   estimatedDeparture: "",
   vesselStatus: "",
   vesselStatusDes: "",
   rejectedNote: [],
   vesselDocuments: [],
   canApprove: false,
   isNewShip: false
});

const vesselFlagData = ref({
   avatar: "",
   flagName: "",
});

const vesselFlagDataHist = ref({
   avatar: "",
   flagName: "",
});

const formVesselGroup = reactive<any>({
   vesselId: 0,
   vesselName: "",
   vesselCallSign: "",
   vesselImoNumber: "",
   vesselOwner: "",
   vesselBreadthExtreme: 0,
   vesselDepth: 0,
   vesselGrossTonnage: 0,
   vesselLengthOverall: 0,
   vesselLoadWeight: 0,
   vesselMainEngine: "",
   vesselBandAndModel: "",
   vesselMMSiNumber: "",
   vesselNetTonnage: 0,
   vesselOfficialNumber: "",
   vesselFlagId: 0,
   vesselTypeId: 0,
   vesselLicenseExpiredDate: "",
});

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
   documentOptionsStore.getPurposeTypeOptions();
   if (documentId.value) {
      await getDocumentDetail(+documentId.value);
   }
});

const getDocumentDetail = async (id: number) => {
   isLoading.value = true;
   const resp = await documentService.getDocumentDetail(id);
   if (resp.statusCode === 200) {
      const data: IDocumentData = resp.data;
      formVesselGroup.vesselId = data.vessel.vesselId;
      formVesselGroup.vesselName = data.vessel.vesselName;
      formVesselGroup.vesselCallSign = data.vessel.vesselCallSign;
      formVesselGroup.vesselImoNumber = data.vessel.vesselImoNumber;
      formVesselGroup.vesselOwner = data.vessel.vesselOwner;
      formVesselGroup.vesselBreadthExtreme = data.vessel.vesselBreadthExtreme;
      formVesselGroup.vesselDepth = data.vessel.vesselDepth;
      formVesselGroup.vesselGrossTonnage = data.vessel.vesselGrossTonnage;
      formVesselGroup.vesselLengthOverall = data.vessel.vesselLengthOverall;
      formVesselGroup.vesselLoadWeight = data.vessel.vesselLoadWeight;
      formVesselGroup.vesselMainEngine = data.vessel.vesselMainEngine;
      formVesselGroup.vesselBandAndModel = data.vessel.vesselBandAndModel;
      formVesselGroup.vesselMMSiNumber = data.vessel.vesselMMSiNumber;
      formVesselGroup.vesselNetTonnage = data.vessel.vesselNetTonnage;
      formVesselGroup.vesselOfficialNumber = data.vessel.vesselOfficialNumber;
      formVesselGroup.vesselFlagId = data.vessel.vesselFlagId || 0;
      formVesselGroup.vesselTypeId = data.vessel.vesselTypeId || 0;
      formVesselGroup.vesselLicenseExpiredDate = data.vessel.vesselLicenseExpiredDate || "";
      vesselFilesUpload.value = data.vessel.vesselUploadFiles || [];
      documentId.value = data.id;
      documentDataDetail.value = { ...data };
      berths.value = data.berths || [];
      spacialBerths.value = data.spacialBerths || [];
      if (
         !isAgency &&
         (isDocumentReviewer || isDocumentApprove) &&
         (data.status === DocumentStatusEnum.PendingReview ||
            data.status === DocumentStatusEnum.PendingEdit ||
            data.status === DocumentStatusEnum.PendingApproval) &&
         data.rejectedNote
      ) {
         const res = await documentService.getDocumentReview(data.id);
         if (res.statusCode === 200) {
            documentDataHistory.value = res.data.documentHistory;
         }
      }
   }
   isLoading.value = false;
};
const renderExpireDate = (date: string | null) => {
   if (date) {
      return renderDateFormat(date);
   } else {
      return "";
   }
};

// const handleOpenVesselHistoryDialog = () => {
//     isVesselHistoryDialogOpen.value = true
//     vesselId.value = documentDataDetail.value.vessel.vesselId
// }

const renderStatus = (status: string) => {
   if ((status === DocumentStatusEnum.PendingApproval && isAgency) || status === DocumentStatusEnum.PendingReview) {
      return "warning";
   } else if (status === DocumentStatusEnum.Rejected || status === DocumentStatusEnum.Canceled || status === DocumentStatusEnum.AdminCanceled) {
      return "gray";
   } else if (status === DocumentStatusEnum.PendingEdit) {
      return "error";
   } else if (status === DocumentStatusEnum.PendingApproval && !isAgency) {
      return "purple";
   } else if (status === DocumentStatusEnum.Approved) {
      return "green";
   } else if (
      (status === DocumentStatusEnum.PendingConfirmation && !isAgency) ||
      (status === DocumentStatusEnum.PendingConfirmation1 && !isAgency) ||
      (status === DocumentStatusEnum.PendingConfirmation2 && !isAgency)
   ) {
      return "blue";
   }
   return "warning";
};

const renderVesselStatus = (status: string) => {
   if (status === VesselDocStatusEnum.Berth) {
      return "green";
   } else if (status === VesselDocStatusEnum.PendingBerth) {
      return "warning";
   }
   return "warning";
};

const columnsTable = [
   {
      key: "id",
      label: t("order"),
      class: "w-[60px] text-center",
   },
   {
      key: "purposeId",
      label: t("วัตถุประสงค์"),
      class: "text-center",
   },
   {
      key: "cargoWharfageId",
      label: t("รูปแบบสินค้า"),
   },
   {
      key: "productTypeName",
      label: t("ชนิดสินค้า"),
   },
   {
      key: "mTonQty",
      label: t("ปริมาณ M/Ton"),
   },
   {
      key: "rTonQty",
      label: t("ปริมาณ R/Ton"),
   },
   {
      key: "packageAmount",
      label: t("แพ็กเกจ"),
   },
   {
      key: "receiver",
      label: t("cargo_owner"),
   },
   {
      key: "actions",
      sortable: false,
   },
];

const renderPurpose = (id: number) => {
   const findData: any = documentOptionsStore.purposesOptions.find((e: any) => e.id === id);
   if (findData) {
      return findData.name;
   }
   return "-";
};

const renderProductType = (id: number) => {
   const findData: any = documentOptionsStore.productGroupsOptions.find((e: any) => e.id === id);
   if (findData) {
      return findData.name;
   }
   return "-";
};

const renderCargoWharfage = (id: number) => {
   const findData: any = documentOptionsStore.cargoWharfageOptions.find((e: any) => e.id === id);
   if (findData) {
      return findData.name;
   }
   return "-";
};

const isOtherPurpose = (purposeTypeId: number) => {
   const findPurpose: any = documentOptionsStore.purposeTypeOptions.find((e: any) => e.id === purposeTypeId);
   if (findPurpose) {
      if ([PurposeType.Other, PurposeType.Passenger, PurposeType.SparePart].includes(findPurpose.name)) {
         return true;
      }
      return false;
   }
   return false;
};

const isCheckingEnabledAction = (purposeTypeId: number) => {
   const findPurpose: any = documentOptionsStore.purposeTypeOptions.find((e: any) => e.id === purposeTypeId);
   console.log("documentOptionsStore.purposeTypeOptions", documentOptionsStore.purposeTypeOptions);
   console.log("findPurpose", findPurpose);
   if (findPurpose) {
      if ([PurposeType.Loading, PurposeType.Discharge, PurposeType.DischargeLoading].includes(findPurpose.type)) {
         return true;
      } else {
         return false;
      }
   }
   return false;
};

const calculateMton = (products: any) => {
   const total = products.reduce((accumulator: any, currentValue: any) => (accumulator += currentValue.mTonQty), 0);
   return formatNumber(total);
};

const calculateRton = (products: any) => {
   const total = products.reduce((accumulator: any, currentValue: any) => (accumulator += currentValue.rTonQty), 0);
   return formatNumber(total);
};

const navigateToRequestFormList = () => {
   if (documentStore.requestFormQueryType === "PendingReview") {
      navigateTo("/request-form/list?status=PendingReview");
   } else if (documentStore.requestFormQueryType === "PendingApproval") {
      navigateTo("/request-form/list?status=PendingApproval");
   } else if (documentStore.requestFormQueryType === "PendingEdit") {
      navigateTo("/request-form/list?status=PendingEdit");
   } else if (documentStore.requestFormQueryType === "PendingConfirmation") {
      navigateTo("/request-form/list?status=PendingConfirmation,PendingConfirmation1,PendingConfirmation2");
   } else if (documentStore.requestFormQueryType === "PendingEdit") {
      navigateTo("/request-form/list?status=PendingEdit");
   } else if (documentStore.requestFormQueryType === "Approved") {
      navigateTo("/request-form/list?status=Approved");
   } else {
      if (isAgency) {
         navigateTo("/request-form/list");
      } else {
         navigateTo("/request-form/list?status=");
      }
   }
   documentStore.triggerRefresh();
};

const handleCancelDocument = () => {
   isConfirmCancelDialogOpen.value = true;
};

const handleConfirmCancelDocument = async () => {
   if (documentId.value) {
      isLoading.value = true;
      const resp = isAgency ? await documentService.cancelDocument(documentId.value) : await documentService.cancelAdminDocument(documentId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ยกเลิกใบคำร้อง";
         modalAlertMessage.value = "เราได้ส่งคำร้องของคุณให้กับเจ้าหน้าที่แล้ว";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "ยกเลิกใบคำร้อง";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
      isLoading.value = false;
   } else {
      navigateToRequestFormList();
   }
};

const handleCloseAlertDialog = () => {
   if (modalAlertType.value === "success") {
      navigateToRequestFormList();
   } else {
      isAlertDialogOpen.value = false;
      isConfirmApproveDialogOpen.value = false;
      isConfirmCancelDialogOpen.value = false;
   }
};

const handleClickRejectSendBack = () => {
   isSendBackDialogOpen.value = true;
};

const handleClickRecallDocument = () => {
   isConfirmRecallDialogOpen.value = true;
};

const handleClickApprove = () => {
   if (
      (isDocumentBerthOfficerMIT || isDocumentBerthOfficerTCT) &&
      (documentDataDetail.value.status === DocumentStatusEnum.PendingConfirmation ||
         documentDataDetail.value.status === DocumentStatusEnum.PendingConfirmation1 ||
         documentDataDetail.value.status === DocumentStatusEnum.PendingConfirmation2)
   ) {
      isSelectJettyDialogOpen.value = true;
   } else {
      isConfirmApproveDialogOpen.value = true;
   }
};

const handleConfirmApproveDocument = async () => {
   if (documentId.value) {
      isLoading.value = true;
      const resp = await documentService.approveDocument(documentId.value);
      if (resp.statusCode === 200) {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "อนุมัติใบคำร้อง";
         modalAlertMessage.value = "การอนุมัติใบคำร้องสำเร็จแล้ว ";
         modalAlertType.value = "success";
      } else {
         isAlertDialogOpen.value = true;
         modalAlertTitle.value = "อนุมัติใบคำร้อง";
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
      isLoading.value = false;
   } else {
      navigateToRequestFormList();
   }
};

const handleConfirmRecallDocument = async () => {
   if (documentId.value) {
      isLoading.value = true;
      const resp = await documentService.recallDocument(documentId.value);
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
      isLoading.value = false;
   } else {
      navigateToRequestFormList();
   }
};

const confirmSendBackRejected = (isSuccess: boolean, resp: any) => {
   if (isSuccess) {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "ส่งกลับใบคำร้อง";
      modalAlertMessage.value = "การส่งกลับใบคำร้องสำเร็จแล้ว ";
      modalAlertType.value = "success";
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "ส่งกลับใบคำร้อง";
      modalAlertMessage.value = resp.message;
      modalAlertType.value = "error";
   }
};

const confirmApproveWithJetty = (isSuccess: boolean, resp: any) => {
   if (isSuccess) {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "อนุมัติใบคำร้อง";
      modalAlertMessage.value = "การอนุมัติใบคำร้องสำเร็จแล้ว ";
      modalAlertType.value = "success";
   } else {
      isAlertDialogOpen.value = true;
      modalAlertTitle.value = "อนุมัติใบคำร้อง";
      modalAlertMessage.value = resp.message;
      modalAlertType.value = "error";
   }
};

const renderHisUnit = (text: string | number) => {
   if (text) {
      return `${text} (เดิม)`;
   }
   return "";
};

const handleViewVesselHistory = () => {
   isVesselHistoryDialogOpen.value = true;
};

watch(
   () => formVesselGroup.vesselFlagId,
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

watch(
   () => documentDataHistory.value.vessel.vesselFlagId,
   (value) => {
      if (value) {
         const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value);
         if (findVesselFlag) {
            vesselFlagDataHist.value.avatar = findVesselFlag.path;
            vesselFlagDataHist.value.flagName = findVesselFlag.name;
         }
      }
   }
);
</script>