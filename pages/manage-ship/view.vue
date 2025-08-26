<template>
    <div class="mb-8">
        <h1 class="font-bold text-[30px]">{{ $t('vessel_management') }}</h1>
    </div>
    <div id="ship-agent-form-content" class="bg-white px-8 py-6 rounded-[0px_0px_20px_20px]">
        <div class="flex items-center justify-between mb-5">
            <div>
                <div class="flex">
                    <h1 class="font-semibold text-lg text-grayy-400 mr-4">ข้อมูลเรือ</h1>
                </div>
                <div class="mt-1 text-grayy-75 text-sm">รายละเอียดข้อมูลเรือ</div>
            </div>
            <div class="flex items-center">
                <UButton @click="() => navigateToManageShipList()" class="mx-1 border border-grayy-100" size="md"
                    color="gray" label="ปิด" />
                <UButton class="ml-1" @click="handleNavigateToRequestForm" size="md" label="ยื่นคำร้อง" type="submit" />
            </div>
        </div>
        <UDivider />

        <div class="border border-grayy-100 p-8 rounded-xl mt-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-1">
                    <UInputMenu is-view custom-icon="search" label="เจ้าของเรือ" name="owner" required
                        v-model="vesselDetailData.owner" placeholder="ค้นหา" />
                </div>
                <div class="col-span-1">
                    <UFormGroup label="สัญชาติเรือ/ธงเรือ" name="vesselFlagId" required>
                        <div class="flex items-center">
                            <UAvatar size="xs" :src="vesselFlagData.avatar" alt="Avatar" />
                            <p class="ml-3.5 text-grayy-75">{{ vesselFlagData.flagName }}</p>
                        </div>
                    </UFormGroup>

                </div>
                <div class="col-span-1">
                    <Input is-view label="ชื่อเรือ" placeholder="ชื่อเรือ" name="name" required
                        v-model="vesselDetailData.name" />
                </div>
                <div class="col-span-1">
                    <USelect is-view label="ประเภทเรือ" placeholder="ประเภทเรือ" name="vesselTypeId" required
                        v-model="vesselDetailData.vesselTypeId" :options="vesselOptionsStore.vesselTypeOption" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="หมายเลข IMO" placeholder="หมายเลข IMO" name="imoNumber" required
                        v-model="vesselDetailData.imoNumber" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="หมายเลข MMSI" placeholder="หมายเลข MMSI" name="mmsiNumber" required
                        v-model="vesselDetailData.mmsiNumber" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="หมายเลขทะเบียนเรือ" placeholder="หมายเลขทะเบียนเรือ" name="officialNumber"
                        required v-model="vesselDetailData.officialNumber" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="สัญญาณเรียกขาน" placeholder="สัญญาณเรียกขาน" name="callSign" required
                        v-model="vesselDetailData.callSign" />
                </div>
            </div>
            <UDivider class="my-4" />
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-1">
                    <Input is-view label="น้ำหนักบรรทุก" placeholder="น้ำหนักบรรทุก" name="loadWeight" required
                        v-model="vesselDetailData.loadWeight" type="number" suffix="t" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="Gross Tonnage" placeholder="Gross Tonnage" name="grossTonnage" required
                        v-model="vesselDetailData.grossTonnage" type="number" suffix="t" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="Net Tonnage" placeholder="Net Tonnage" name="netTonnage" required
                        v-model="vesselDetailData.netTonnage" type="number" suffix="t" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="ความยาว" placeholder="ความยาว" name="lengthOverall" required
                        v-model="vesselDetailData.lengthOverall" type="number" suffix="m" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="ความกว้าง" placeholder="ความกว้าง" name="breadthExtreme" required
                        v-model="vesselDetailData.breadthExtreme" type="number" suffix="m" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="กินน้ำลึก" placeholder="กินน้ำลึก" name="depth" required
                        v-model="vesselDetailData.depth" type="number" suffix="m" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="เครื่องจักรใหญ่" placeholder="เครื่องจักรใหญ่" name="mainEngine" required
                        v-model="vesselDetailData.mainEngine" />
                </div>
                <div class="col-span-1">
                    <Input is-view label="ยี่ห้อและรุ่น" placeholder="ยี่ห้อและรุ่น" name="bandAndModel" required
                        v-model="vesselDetailData.bandAndModel" />
                </div>
            </div>
            <UDivider class="my-4" />
            <div id="containerUpload">
                <h2 class="font-semibold text-grayy-400 mb-3">เอกสารแนบ</h2>
                <FileDropzone v-if="vesselDetailData.uploadFiles.length > 0" is-view
                    :filesValue="vesselDetailData.uploadFiles" />
                <div v-else>-</div>
            </div>

        </div>
    </div>
    <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Loading from "~/components/loading.vue";
import Input from '~/components/form/u-input.vue';
import USelect from '~/components/form/u-select.vue';
import FileDropzone from '~/components/form/fileDropzone.vue';
import useVesselService from "~/core/services/vesselService";
import type { IVesselData } from "~/core/interfaces/IVesselData";
import UInputMenu from "~/components/form/u-input-menu.vue";
import { useDocumentStore } from "~/stores/documentStore";

const route = useRoute();
const vesselService = useVesselService()
const vesselOptionsStore = useVesselOptionsStore()
const vesselStore = useVesselStore()
const documentStore = useDocumentStore();
const query: any = route.query;
const vesselAgentId = query.id

const isLoading = ref(false)

const isConfirmDialogOpen = ref(false)

const vesselDetailData = ref<IVesselData>({
    vesselFlagId: 0,
    vesselFlagName: "",
    vesselTypeId: 0,
    vesselTypeName: "",
    id: 0,
    owner: "",
    name: "",
    imoNumber: "",
    mmsiNumber: "",
    dsvNumber: "",
    officialNumber: "",
    callSign: "",
    loadWeight: 0,
    grossTonnage: 0,
    netTonnage: 0,
    lengthOverall: 0,
    breadthExtreme: 0,
    depth: 0,
    mainEngine: "",
    bandAndModel: "",
    createdName: "",
    updatedName: "",
    uploadFiles: []
})

const vesselFlagData = ref({
    avatar: '',
    flagName: ''
})

onMounted(async () => {
    await vesselOptionsStore.getVesselTypeOption()
    await vesselOptionsStore.getVesselFlagOption()
    if (vesselAgentId) {
        await getVesselDetail(+vesselAgentId)
    }
});

const getVesselDetail = async (id: number) => {
    isLoading.value = true
    const resp = await vesselService.getVesselDetail(id)
    if (resp.statusCode === 200) {
        const data = resp.data
        vesselDetailData.value.vesselFlagId = data.vesselFlagId
        vesselDetailData.value.vesselFlagName = data.vesselFlagName
        vesselDetailData.value.vesselTypeId = data.vesselTypeId
        vesselDetailData.value.vesselTypeName = data.vesselTypeName
        vesselDetailData.value.id = data.id
        vesselDetailData.value.owner = data.owner
        vesselDetailData.value.name = data.name
        vesselDetailData.value.imoNumber = data.imoNumber
        vesselDetailData.value.mmsiNumber = data.mmsiNumber
        vesselDetailData.value.dsvNumber = data.dsvNumber
        vesselDetailData.value.officialNumber = data.officialNumber
        vesselDetailData.value.callSign = data.callSign
        vesselDetailData.value.loadWeight = data.loadWeight
        vesselDetailData.value.grossTonnage = data.grossTonnage
        vesselDetailData.value.netTonnage = data.netTonnage
        vesselDetailData.value.lengthOverall = data.lengthOverall
        vesselDetailData.value.breadthExtreme = data.breadthExtreme
        vesselDetailData.value.depth = data.depth
        vesselDetailData.value.mainEngine = data.mainEngine
        vesselDetailData.value.bandAndModel = data.bandAndModel
        vesselDetailData.value.createdName = data.createdName
        vesselDetailData.value.updatedName = data.updatedName
        vesselDetailData.value.uploadFiles = data.uploadFiles || []

        const findVesselFlag: any = vesselOptionsStore.vesselFlagsOption.find((e: any) => e.id === data.vesselFlagId)
        if (findVesselFlag) {
            vesselFlagData.value.avatar = findVesselFlag.path
            vesselFlagData.value.flagName = findVesselFlag.name
        }
    }
    isLoading.value = false
}

const handleNavigateToRequestForm = () => {
    vesselStore.setVesselId(vesselDetailData.value.id)
    navigateTo({ path: '/request-form/create' })
}

const navigateToManageShipList = () => {
   if (documentStore.manageShipQueryType === "false") {
      navigateTo("/manage-ship/list?status=false");
   } else if (documentStore.manageShipQueryType === "true") {
      navigateTo("/manage-ship/list?status=true");
   }  else {
      navigateTo("/manage-ship/list");
   }
};
</script>
