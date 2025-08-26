<template>
  <h2 class="font-semibold text-grayy-400 mb-3">{{ $t('vessel_detail') }}</h2>
  <UDivider class="my-4" />
  <UFormGroup :label="`${$t('vessel_name')}/IMO/Official No.`" name="vesselId">
    <UInputMenu v-model="vesselSearchDisplay" size="md" variant="outline" color="purple"
      icon="i-heroicons-magnifying-glass-20-solid" :search="onSearchVessels" @change="handleChangeVessel"
      :placeholder="$t('search_title_placeholder')" option-attribute="name" trailing by="id">
      <template #leading>
        <NuxtIcon name="search" size="xl" />
      </template>
    </UInputMenu>
  </UFormGroup>
  <div class="border border-grayy-100 p-8 rounded-xl mt-6">
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('request_number')" :placeholder="$t('request_number')" disabled />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('request_date')" :placeholder="$t('request_date')" disabled />
      </div>
      <div class="col-span-2">
        <UFormGroup label="เจ้าของเรือ" name="vesselOwner" required :error="getError('vesselOwner') || ''">
          <UInputMenu v-model="formGroup.vesselOwner" size="md" variant="outline" color="purple"
            :search="onSearchVesselOwners" :placeholder="$t('search_title_placeholder')" option-attribute="name"
            trailing by="id" @change="handleChangeOwner" />
        </UFormGroup>

      </div>
      <div class="col-span-2">
        <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId" required :error="getError('vesselFlagId') || ''">
          <USelectMenu v-model="formGroup.vesselFlagId" size="md" variant="outline" color="purple" value-attribute="id"
            option-attribute="name" searchable :options="vesselOptionsStore.vesselFlagsOption" clear-search-on-close
            placeholder="สัญชาติเรือ/ธงเรือ" @change="(value: any) => validate('vesselFlagId', value)">
            <template #leading>
              <UAvatar v-if="vesselFlagData.avatar" size="xs" :src="vesselFlagData.avatar" alt="Avatar" />
              <NuxtIcon v-else name="flag" size="xl" />
            </template>
          </USelectMenu>
        </UFormGroup>

      </div>
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('vessel_name')" :placeholder="$t('vessel_name')" name="vesselName" required
          v-model="formGroup.vesselName" @blur="validate('vesselName')" @input="validate('vesselName')"
          :error="getError('vesselName') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <USelect :label="$t('vessel_type')" :placeholder="$t('vessel_type')" name="vesselTypeId" required
          v-model="formGroup.vesselTypeId" :options="vesselOptionsStore.vesselTypeOption"
          @change="(value: any) => validate('vesselTypeId', value)" :error="getError('vesselTypeId') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('imo_number')" :placeholder="$t('imo_number')" name="vesselImoNumber"
          :required="isOtherCountry" v-model="formGroup.vesselImoNumber" @blur="validate('vesselImoNumber')"
          @input="validate('vesselImoNumber')" :error="getError('vesselImoNumber') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('mmsi_number')" :placeholder="$t('mmsi_number')" name="vesselMMSiNumber"
          v-model="formGroup.vesselMMSiNumber"  @blur="validate('vesselMMSiNumber')"
          @input="validate('vesselMMSiNumber')" :error="getError('vesselMMSiNumber') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('official_number')" :placeholder="$t('official_number')" name="vesselOfficialNumber"
          required v-model="formGroup.vesselOfficialNumber" @blur="validate('vesselOfficialNumber')"
          @input="validate('vesselOfficialNumber')" :error="getError('vesselOfficialNumber') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input :label="$t('call_sign')" :placeholder="$t('call_sign')" name="vesselCallSign" 
          v-model="formGroup.vesselCallSign"  />
      </div>
      <div v-if="!isOtherCountry" class="col-span-2 md:col-span-1">
        <UFormGroup name="vesselLicenseExpiredDate" :label="$t('วันหมดอายุใบอนุญาตใช้เรือ')" required>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <Input size="md" variant="outline" color="purple" custom-icon="calendar"
              v-model="formGroup.vesselLicenseExpiredDate"
              :value="formGroup.vesselLicenseExpiredDate ? `${format(new Date(formGroup.vesselLicenseExpiredDate), 'd MMM, yyy')}` : ''"
              :placeholder="$t('วันหมดอายุใบอนุญาตใช้เรือ')" :ui="{
                wrapper: 'w-full rounded-md bg-white'
              }" @blur="validate('vesselLicenseExpiredDate')" @input="validate('vesselLicenseExpiredDate')"
              :error="getError('vesselLicenseExpiredDate') || ''" />

            <template #panel="{ close }">
              <VDatepicker v-model="licenseExpiredDate" @close="close" type="normal" />
            </template>
          </UPopover>
          <template #help>
            <span v-if="daysRemaining > 0 && daysRemaining <= 30" class="text-[#F04438]">
              ใบอนุญาตใช้เรือจะหมดอายุในอีก {{ daysRemaining }} วัน
            </span>
            <span v-else-if="daysRemaining <= 0" class="text-[#F04438]">
              ใบอนุญาตทะเบียนเรือหมดอายุแล้ว
            </span>
          </template>
        </UFormGroup>
      </div>
    </div>
    <UDivider class="my-4" />
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2 md:col-span-1">
        <NumericInput :label="$t('dead_weight')" placeholder="0.00" name="vesselLoadWeight" required
          v-model="formGroup.vesselLoadWeight" suffix="t" @blur="validate('vesselLoadWeight')"
          :value="formGroup.vesselLoadWeight" :error="getError('vesselLoadWeight') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <NumericInput :label="$t('gross_tonnage')" placeholder="0.000" name="vesselGrossTonnage" required
          v-model="formGroup.vesselGrossTonnage" suffix="t" @blur="validate('vesselGrossTonnage')"
          @input="validate('vesselGrossTonnage')" :error="getError('vesselGrossTonnage') || ''" decimalPlaces="3" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <NumericInput :label="$t('net_tonnage')" placeholder="0.00" name="vesselNetTonnage" required
          v-model="formGroup.vesselNetTonnage" suffix="t" @blur="validate('vesselNetTonnage')"
          @input="validate('vesselNetTonnage')" :error="getError('vesselNetTonnage') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <NumericInput :label="$t('length_overall')" placeholder="0.00" name="vesselLengthOverall" required
          v-model="formGroup.vesselLengthOverall" suffix="m" @blur="validate('vesselLengthOverall')"
          @input="validate('vesselLengthOverall')" :error="getError('vesselLengthOverall') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <NumericInput :label="$t('beam')" placeholder="0.00" name="vesselBreadthExtreme" required
          v-model="formGroup.vesselBreadthExtreme" suffix="m" @blur="validate('vesselBreadthExtreme')"
          @input="validate('vesselBreadthExtreme')" :error="getError('vesselBreadthExtreme') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <NumericInput :label="$t('draft')" placeholder="0.00" name="vesselDepth" required
          v-model="formGroup.vesselDepth" suffix="m" @blur="validate('vesselDepth')" @input="validate('vesselDepth')"
          :error="getError('vesselDepth') || ''" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input label="เครื่องจักรใหญ่" placeholder="เครื่องจักรใหญ่" name="vesselMainEngine"
          v-model="formGroup.vesselMainEngine" />
      </div>
      <div class="col-span-2 md:col-span-1">
        <Input label="ยี่ห้อและรุ่น" placeholder="ยี่ห้อและรุ่น" name="vesselBandAndModel"
          v-model="formGroup.vesselBandAndModel" />
      </div>
    </div>
    <UDivider class="my-4" />
    <div id="containerUpload">
      <h2 class="font-bold text-grayy-400">นำเข้าเอกสารประกอบดังต่อไปนี้</h2>
      <span class="text-grayy-500 mr-2 my-3">รองรับสกุลไฟล์ .pdf และอัปโหลดไฟล์ไม่เกิน 10 MB</span>
      <div class="flex justify-end">
        <a :href="downloadUrl" class="flex items-center cursor-pointer" target="_blank">
          <span class="text-primaryy-500 mr-2 my-3">ดาวน์โหลดตัวอย่างเอกสาร</span>
          <NuxtIcon name="download" />
        </a>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 mt-4 2xl:grid-cols-2">
      <FileUpload id="shipParticulars" label="Ship’s Particulars" name="shipParticulars" required
        v-model="shipParticulars" :type="FileVesselTypeEnum.shipParticulars" :value-file="shipParticulars"
        is-document-type :onFileUpload="onFileUpload" :file-name="shipParticularsFileName" :file-preview="shipParticularsFilePreview"
        :is-required="isRequiredFileShipsPaticulars" :onRemoveFile="(value: any) => shipParticulars = value" />

      <FileUpload id="shipRegistry" label="Ship Registry" name="shipRegistry" required v-model="shipRegistry"
        :type="FileVesselTypeEnum.shipRegistry" :value-file="shipRegistry" is-document-type :onFileUpload="onFileUpload"
        :file-name="shipRegistryFileName" :is-required="isRequiredFileShipRegistry"
        :file-preview="shipRegistryFilePreview" />
      <FileUpload id="internationTonnageCert" label="International Tonnage Certificate (1969)"
        name="internationTonnageCert" required v-model="internationTonnageCert"
        :type="FileVesselTypeEnum.internationTonnageCert" :value-file="internationTonnageCert" is-document-type
        :onFileUpload="onFileUpload" :file-name="internationTonnageCertFileName"
        :is-required="isRequiredFileShipInternation" :file-preview="internationTonnageCertFilePreview" />

      <FileUpload id="last10Ports" label="Last 10 Ports" name="last10Ports" required v-model="last10Ports"
        :type="FileVesselTypeEnum.last10Ports" :value-file="last10Ports" is-document-type :onFileUpload="onFileUpload"
        :file-name="last10PortsFileName" :is-required="isRequiredFileLast10Ports" :file-preview="last10PortsFilePreview"/>
      <FileUpload v-if="!isOtherCountry" id="powerOfAttorney" label="หนังสือมอบอำนาจถูกต้องตามกฏหมาย (กรณีเรือไทย)"
        name="powerOfAttorney" v-model="powerOfAttorney" required :type="FileVesselTypeEnum.powerOfAttorney"
        :value-file="powerOfAttorney" is-document-type :onFileUpload="onFileUpload" :file-name="powerOfAttorneyFileName"
        :is-required="isRequiredFilePowerOfAttorney" :file-preview="powerOfAttorneyFilePreview"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import NumericInput from "~/components/form/u-numeric-input.vue";
import useMasterDataShipService from "~/core/services/masterDataShipService/vesselService";
import NuxtIcon from "../ui/nuxtIcon.vue";
import USelect from "../form/u-select.vue";
import useVesselService from "~/core/services/vesselService";
import type { IVesselData } from "~/core/interfaces/IVesselData";
import VDatepicker from "../form/v-datepicker.vue";
import { format } from "date-fns";
import FileUpload from "../form/FileUpload.vue";
import type { IFileUpload } from "~/core/interfaces/IFileUpload";
import { FileVesselTypeEnum } from "~/utils/enums/FileVesselTypeEnum";

const config = useRuntimeConfig();
const downloadUrl = config.public.apiBaseUrl + '/downloads/vessel-template';

const props = defineProps({
  formGroup: {
    type: Object,
    required: true
  },
  isOtherCountry: {
    type: Boolean,
    default: false
  },
  getFilesUpload: {
    type: Function,
    required: true
  },
  filesUpload: {
    type: Array,
    default: []
  },
  validate: {
    type: Function,
    required: true
  },
  getError: {
    type: Function,
    required: true
  },
  isSelectedVesselTrigger: {
    type: Function,
    default: () => { }
  },
  setCountryChange: {
    type: Function,
    default: () => { }
  },
  isRequiredFile: {
    type: Boolean,
    default: false
  },
  vesselId: {
    type: Number,
    default: 0
  },
  shipParticulars: {
    type: Object,
    default: { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
  },
  shipRegistry: {
    type: Object,
    default: { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
  },
  internationTonnageCert: {
    type: Object,
    default: { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
  },
  last10Ports: {
    type: Object,
    default: { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
  },
  powerOfAttorney: {
    type: Object,
    default: { document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 }
  },
  shipParticularsFileName: {
    type: String,
    default: ''
  },
  shipRegistryFileName: {
    type: String,
    default: ''
  },
  internationTonnageCertFileName: {
    type: String,
    default: ''
  },
  last10PortsFileName: {
    type: String,
    default: ''
  },
  powerOfAttorneyFileName: {
    type: String,
    default: ''
  },
  shipParticularsFilePreview: {
    type: String,
    default: ''
  },
  shipRegistryFilePreview: {
    type: String,
    default: ''
  },
  internationTonnageCertFilePreview: {
    type: String,
    default: ''
  },
  last10PortsFilePreview: {
    type: String,
    default: ''
  },
  powerOfAttorneyFilePreview: {
    type: String,
    default: ''
  },
  isRequiredFileShipsPaticulars: {
    type: Boolean,
    default: false
  },
  isRequiredFileShipRegistry: {
    type: Boolean,
    default: false
  },
  isRequiredFileShipInternation: {
    type: Boolean,
    default: false
  },
  isRequiredFileLast10Ports: {
    type: Boolean,
    default: false
  },
  isRequiredFilePowerOfAttorney: {
    type: Boolean,
    default: false
  },
  onRemoveShipParticulars: {
    type: Function,
    default: () => { }
  },
  onRemoveShipRegistry: {
    type: Function,
    default: () => { }
  },
  onRemoveShipInternation: {
    type: Function,
    default: () => { }
  },
  onRemoveLast10Ports: {
    type: Function,
    default: () => { }
  },
  onRemovePowerOfAttorney: {
    type: Function,
    default: () => { }
  }
});

const masterDataShipService = useMasterDataShipService()
const vesselOptionsStore = useVesselOptionsStore()
const vesselService = useVesselService()

const isOtherCountry = ref(props.isOtherCountry)
const vesselSearchDisplay = ref('')
const vesselFlagData = ref({
  avatar: '',
  flagName: ''
})
const errorFileMessage = ref('')

const filesUpload = ref(props.filesUpload || [])
const licenseExpiredDate = ref(props.formGroup.vesselLicenseExpiredDate ? new Date(props.formGroup.vesselLicenseExpiredDate) : new Date())
const vesselId = computed(() => props.vesselId)
const shipParticulars = ref<IFileUpload>(props.shipParticulars as IFileUpload);
const shipRegistry = ref<IFileUpload>(props.shipRegistry as IFileUpload);
const internationTonnageCert = ref<IFileUpload>(props.internationTonnageCert as IFileUpload);
const last10Ports = ref<IFileUpload>(props.last10Ports as IFileUpload);
const powerOfAttorney = ref<IFileUpload>(props.powerOfAttorney as IFileUpload);
const shipParticularsFileName = computed<string>(() => props.shipParticularsFileName);
const shipRegistryFileName = computed<string>(() => props.shipRegistryFileName);
const internationTonnageCertFileName = computed<string>(() => props.internationTonnageCertFileName);
const last10PortsFileName = computed<string>(() => props.last10PortsFileName);
const powerOfAttorneyFileName = computed<string>(() => props.powerOfAttorneyFileName);

const shipParticularsFilePreview = computed<string>(() => props.shipParticularsFilePreview);
const shipRegistryFilePreview = computed<string>(() => props.shipRegistryFilePreview);
const internationTonnageCertFilePreview = computed<string>(() => props.internationTonnageCertFilePreview);
const last10PortsFilePreview = computed<string>(() => props.last10PortsFilePreview);
const powerOfAttorneyFilePreview = computed<string>(() => props.powerOfAttorneyFilePreview);

const isRequiredFileShipsPaticulars = ref<boolean>(false);
const isRequiredFileShipRegistry = ref<boolean>(false);
const isRequiredFileShipInternation = ref<boolean>(false);
const isRequiredFileLast10Ports = ref<boolean>(false);
const isRequiredFilePowerOfAttorney = ref<boolean>(false);
onMounted(() => {
  vesselOptionsStore.getVesselTypeOption()
  vesselOptionsStore.getVesselFlagOption()
  if (props.formGroup.vesselFlagId) {
    const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === props.formGroup.vesselFlagId)
    if (findVesselFlag) {
      vesselFlagData.value.avatar = findVesselFlag.path
      vesselFlagData.value.flagName = findVesselFlag.name
      props.setCountryChange(findVesselFlag.name !== 'Thailand' ? true : false)
    }
  }

  if (vesselId.value) {
    getVesselDetailAndSetInForm(vesselId.value)
  }
});

const daysRemaining = computed(() => {
  const currentDate = new Date();
  if (props.formGroup.vesselLicenseExpiredDate && !new Date(props.formGroup.vesselLicenseExpiredDate)) return 0;
  const diffTime = new Date(props.formGroup.vesselLicenseExpiredDate).getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
});

const onSearchVesselOwners = async (q: any) => {
  const filter = { q }
  if (q) {
    props.formGroup.vesselOwner = q
    const resp = await masterDataShipService.getVesselOwnersOption(filter)
    if (resp.statusCode === 200) {
      props.validate('vesselOwner')
      return resp.data.map((e: any) => ({ id: e.id, name: e.name }))
    }
    props.formGroup.vesselOwner = q
    props.validate('vesselOwner')
    return []
  }
  return []
}

const handleChangeOwner = (value: any) => {
  props.formGroup.vesselOwnerId = value.id
  props.formGroup.vesselOwner = value.name
  props.validate('vesselOwner')
}

const onSearchVessels = async (q: any) => {
  const filter = {
    flag: 0,
    owner: '',
    type: 0,
    page: 1,
    limit: 100,
    search: q,
    showAll: true
  }
  vesselSearchDisplay.value = q
  const resp = await vesselService.getVesselList(filter)
  if (resp.statusCode === 200) {
    return resp.data.data.map((e: IVesselData) => ({ ...e, id: e.id, name: e.name, }))
  }
  return []
}

const handleChangeVessel = async (value: any) => {
  vesselSearchDisplay.value = value.name
  getVesselDetailAndSetInForm(value.id)
}

const getVesselDetailAndSetInForm = async (id: number) => {
  const resp = await vesselService.getVesselDetail(id)
  if (resp.statusCode === 200) {
    const data = resp.data
    props.formGroup.vesselFlagId = data.vesselFlagId
    props.formGroup.vesselTypeId = data.vesselTypeId
    props.formGroup.vesselId = data.id
    props.formGroup.vesselOwnerId = data.ownerId
    props.formGroup.vesselOwner = data.owner
    props.formGroup.vesselName = data.name
    props.formGroup.vesselImoNumber = data.imoNumber
    props.formGroup.vesselMMSiNumber = data.mmsiNumber
    props.formGroup.vesselOfficialNumber = data.officialNumber
    props.formGroup.vesselCallSign = data.callSign
    props.formGroup.vesselLoadWeight = data.loadWeight
    props.formGroup.vesselGrossTonnage = data.grossTonnage
    props.formGroup.vesselNetTonnage = data.netTonnage
    props.formGroup.vesselLengthOverall = data.lengthOverall
    props.formGroup.vesselBreadthExtreme = data.breadthExtreme
    props.formGroup.vesselDepth = data.depth
    props.formGroup.vesselMainEngine = data.mainEngine
    props.formGroup.vesselBandAndModel = data.bandAndModel
    props.formGroup.vesselLicenseExpiredDate = data.licenseExpiredDate || ''
    filesUpload.value = data.uploadFiles || []
    props.getFilesUpload(data.uploadFiles || [])
    props.isSelectedVesselTrigger(true)
  }
}

const getFiles = (value: any) => {
  props.getFilesUpload(value)
}

const replaceByFileType = (
  referenceArray: IFileUpload[],
  newObject: IFileUpload
): IFileUpload[] =>
  referenceArray.map(item =>
    item.fileType === newObject.fileType
      ? { ...newObject }
      : item
  ).concat(referenceArray.some(item => item.fileType === newObject.fileType) ? [] : [newObject]);
const onFileUpload = (value: any) => {
  const updatedFiles = replaceByFileType(filesUpload.value as IFileUpload[], value)
  console.log('=updatedFiles', updatedFiles)
  filesUpload.value = updatedFiles
  getFiles(updatedFiles)
}

watch(
  () => props.filesUpload,
  (newValue) => {
    console.log('=newValue', newValue)
    filesUpload.value = newValue;
    getFiles(newValue);
  },
  { deep: true }
);

watch(
  () => props.isOtherCountry,
  (value) => {
    isOtherCountry.value = value
  }
);

watch(
  () => props.formGroup.vesselFlagId,
  (value) => {
    if (value) {
      const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === value)
      if (findVesselFlag) {
        vesselFlagData.value.avatar = findVesselFlag.path
        vesselFlagData.value.flagName = findVesselFlag.name
        props.setCountryChange(findVesselFlag.name !== 'Thailand' ? true : false)
      }
    }
  }
);

watch(
  () => licenseExpiredDate.value,
  (value) => {
    props.formGroup.vesselLicenseExpiredDate = value ? new Date(value).toISOString() : '';
  }
);

watch(
  () => props.formGroup.vesselLicenseExpiredDate,
  (value) => {
    if (value) {
      props.validate('vesselLicenseExpiredDate')
      licenseExpiredDate.value = new Date(value)
    }
  }
);

watch(
  () => props.isRequiredFile,
  (required) => {
    if (required) {
      errorFileMessage.value = 'กรุณานำส่งเอกสาร'
    } else {
      errorFileMessage.value = ''
    }
  }
);

watch(
  () => props.isRequiredFileShipsPaticulars,
  (required) => {
    isRequiredFileShipsPaticulars.value = required
  }
);

watch(
  () => props.isRequiredFileShipRegistry,
  (required) => {
    isRequiredFileShipRegistry.value = required
  }
);
watch(
  () => props.isRequiredFileShipInternation,
  (required) => {
    isRequiredFileShipInternation.value = required
  }
);
watch(
  () => props.isRequiredFileLast10Ports,
  (required) => {
    isRequiredFileLast10Ports.value = required
  }
);
watch(
  () => props.isRequiredFilePowerOfAttorney,
  (required) => {
    isRequiredFilePowerOfAttorney.value = required
  }
);

watch(
  () => shipParticulars.value,
  (value) => {
    // remove from uploadfile
    if (value === null) {
      const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileVesselTypeEnum.shipParticulars)
      if (findFileIndex !== -1) {
        filesUpload.value.splice(findFileIndex, 1)
      }
      props.onRemoveShipParticulars({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 })
    }
  }
);

watch(
  () => shipRegistry.value,
  (value) => {
    // remove from uploadfile
    if (value === null) {
      const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileVesselTypeEnum.shipRegistry)
      if (findFileIndex !== -1) {
        filesUpload.value.splice(findFileIndex, 1)
      }
      props.onRemoveShipRegistry({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 })
    }
  }
);

watch(
  () => internationTonnageCert.value,
  (value) => {
    // remove from uploadfile
    if (value === null) {
      const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileVesselTypeEnum.internationTonnageCert)
      if (findFileIndex !== -1) {
        filesUpload.value.splice(findFileIndex, 1)
      }
      props.onRemoveShipInternation({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 })
    }
  }
);

watch(
  () => last10Ports.value,
  (value) => {
    // remove from uploadfile
    if (value === null) {
      const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileVesselTypeEnum.last10Ports)
      if (findFileIndex !== -1) {
        filesUpload.value.splice(findFileIndex, 1)
      }
      props.onRemoveLast10Ports({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 })
    }
  }
);

watch(
  () => powerOfAttorney.value,
  (value) => {
    // remove from uploadfile
    if (value === null) {
      const findFileIndex = filesUpload.value.findIndex((e: any) => e.fileType === FileVesselTypeEnum.powerOfAttorney)
      if (findFileIndex !== -1) {
        filesUpload.value.splice(findFileIndex, 1)
      }
      props.onRemovePowerOfAttorney({ document_file_type: '', extension: '', fileName: '', filePath: '', preview: '', size: 0 })
    }
  }
);

</script>
