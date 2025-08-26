import type { IUploadFile } from "./IUploadFile";

export interface IVesselData {
    vesselFlagId: number
    vesselFlagName: string
    vesselTypeId: number
    vesselTypeName: string
    id: number
    owner: string
    name: string
    imoNumber: string
    mmsiNumber: string
    dsvNumber: string
    officialNumber: string
    callSign: string
    loadWeight: number
    grossTonnage: number
    netTonnage: number
    lengthOverall: number
    breadthExtreme: number
    depth: number
    mainEngine: string
    bandAndModel: string
    createdName: string
    updatedName: string
    uploadFiles: IUploadFile[]
}
